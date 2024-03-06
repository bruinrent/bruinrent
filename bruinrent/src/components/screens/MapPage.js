import React, { useState, useEffect } from "react";
import "./MapPage.css"; // Import a separate CSS file for component-specific styles
import "leaflet/dist/leaflet.css";
import { useAuthContext } from "../AuthContext.js";
import { firestore } from "../../firebase.js";
import { useSpring, animated } from "@react-spring/web";
import sizeof from "firestore-size";
import FilterBed from "../FilterButtonBed.js";
import FilterPrice from "../FilterButtonPrice.js";
import FilterReviews from "../FilterButtonReviews.js";

import { FaChevronDown } from "react-icons/fa/index.esm.js";

import {
  collection,
  getDocs,
  query,
  startAfter,
  limit,
  orderBy,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import InfiniteScroll from "react-infinite-scroll-component";
import ListingBlock from "./ListingBlock.js";
import GoogleMap from "../GoogleMap.js";
import Header from "../Header.jsx";
import Fuse from "fuse.js";
import { useInsertionEffect } from "react";
import { addressToLatLong } from "../addressToLongLat.js";
import {
  processAndAddReview,
  cleanInvalidCharacters,
} from "../ReviewUploadUtil.js";
import CheckBox from "./Checkbox.js";

const MapPage = () => {
  const [selectedBeds, setSelectedBeds] = useState("");
  const [selectedBaths, setSelectedBaths] = useState("");
  const [selectedPrice1, setSelectedPrice1] = useState("");
  const [selectedPrice2, setSelectedPrice2] = useState("");
  // REVIEW FILTERING CHECKBOX LOGIC SHOULD BE OK, change this bool to use
  const [showWrittenReviews, setShowWrittenReviews] = useState(false);

  const [selectedReviewJSON, setSelectedReviewJSON] = useState(null);

  const NUMBER_OF_LISTINGS = 10;
  const [listings, setListings] = useState([]);
  const [hasMoreListings, setHasMoreListings] = useState(true);
  const [visibleListings, setVisibleListings] = useState(10); // Display the first 10 listings
  const [lastListing, setLastListing] = useState(null);

  const [filteredListings, setFilteredListings] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuthContext();
  const adminUIDList = [
    "dJ2BhadxRMUcLbes3kvLzAbcUJ82",
    "qgE8ZilUG4VWEsWlGzH4a5lG5b53",
    "lwjUg0pXKmVdpGOWXEPH0dZqeno1",
    "hY8GizjXLzMeqe80ktnCo15XIZl2",
    "dJ2BhadxRMUcLbes3kvLzAbcUJ82",
    "K1JhDmiZZgYRcheXcOL7xClLUyq2",
    "EMTgE8nafjZfxr1nfVtHTaUhhDM2",
    "1GU3X53O5Dg5ZbJKOfjYc38eBuq2",
  ];
  const isAdmin = user && adminUIDList.includes(user.uid);

  const handleBedBathFilterChange = (beds, baths) => {
    setSelectedBeds(beds);
    setSelectedBaths(baths);
  };

  const handlePriceFilterChange = (rent1, rent2) => {
    setSelectedPrice1(rent1);
    setSelectedPrice2(rent2);
    // console.log("rent 1", rent1);
    // console.log("rent 2", rent2);
  };

  const handleReviewsFilterChange = () => {};

  useEffect(() => {
    // Fetch data from the "listings" collection in Firestore
    const fetchListings = async () => {
      // const q = query(
      //   collection(firestore, "listings"),
      //   orderBy("address"),
      //   limit(NUMBER_OF_LISTINGS)
      // );
      // const snapshot = await getDocs(q);
      // const listingsData = snapshot.docs.map((doc) => ({
      //   id: doc.id, // Include the document ID as 'id'
      //   ...doc.data(), // Include other data from the document
      // }));
      // console.log("LISTING DATA", listingsData);
      // if (listingsData.length > 0) {
      //   setLastListing(snapshot.docs[snapshot.docs.length - 1]);
      // }

      try {
        // Fetch data from listings-toc
        const listingsTocData = (
          await getDoc(doc(firestore, "reference", "listings-toc"))
        ).data();

        // Convert listings-toc data to array format
        const listingsData = Object.entries(listingsTocData).map(
          ([id, data]) => ({
            id,
            address: data.address,
            rent1: data.rent1,
            rent2: data.rent2,
            bedrooms: data.bed,
            bathroom: data.bath,
            latLong: data.latLong,
            imageUrls: [data.image],
            rating: data.rating,
          })
        );

        // Fetch data from csv-toc
        const csvTocData = (
          await getDoc(doc(firestore, "reference", "csv-toc"))
        ).data();

        // Convert csv-toc data to array format
        const csvListingsData = Object.entries(csvTocData).map(
          ([id, data]) => ({
            id,
            address: data.address,
            rent1: data.rent1,
            rent2: data.rent2,
            bedrooms: data.bedrooms,
            bathroom: data.bathroom,
            latLong: data.latLong,
            imageUrls: [data.imageUrls],

            // temp fix, all csv ratings show as 5.0 stars
            rating: data.rating || 5,
          })
        );

        // Combine listings data from both collections
        // CURRENTLY IGNORING CSB LISTINGS
        const combinedListingsData = listingsData.concat(csvListingsData);
        // const combinedListingsData = listingsData;
        const combinedListingsValidAddresses = combinedListingsData.filter(
          (listing) => listing.address !== null && listing.address !== undefined
        );

        // Sort listings to display those with rent first
        const sortedListings = combinedListingsValidAddresses.sort((a, b) => {
          const aRent = parseInt(a.rent1);
          const bRent = parseInt(b.rent1);

          if (aRent && bRent) {
            if (a.rating && b.rating) {
              return a.rating > b.rating ? -1 : 1;
            } else if (a.rating) {
              return -1;
            } else {
              return 1;
            }
          } else if (aRent) {
            return -1;
          } else {
            return 1;
          }
        });

        // Set listings state with the sorted data
        setListings(sortedListings);

        // // Separate listings with and without rent
        // const listingsWithRent = combinedListingsData.filter(
        //     (listing) => listing.rent1 !== "" && listing.rent2 !== ""
        // );
        // const listingsWithoutRent = combinedListingsData.filter(
        //     (listing) => listing.rent1 === "" || listing.rent2 === ""
        // );

        // // Sort listings
        // const sortedListingsWithRent = listingsWithRent.sort((a, b) =>
        //     a.address.localeCompare(b.address)
        // );
        // const sortedListingsWithoutRent = listingsWithoutRent.sort(
        //     (a, b) => a.address.localeCompare(b.address)
        // );

        // // Set listings state with the combined and sorted data
        // setListings(
        //     sortedListingsWithRent.concat(sortedListingsWithoutRent)
        // );

        console.log("Data fetched successfully.");
        console.log(`Listings set to: ${JSON.stringify(sortedListings)}`);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchListings();
  }, []);

  const loadMoreListings = async () => {
    // For now not using dynamic listing loading, using TOC instead
    // console.log("LISTING LAST", lastListing);

    // if (lastListing == null) {
    //   setHasMoreListings(false);
    //   return;
    // }

    // const q = query(
    //   collection(firestore, "listings"),
    //   orderBy("address"),
    //   startAfter(lastListing),
    //   limit(NUMBER_OF_LISTINGS)
    // );
    // const snapshot = await getDocs(q);
    // const listingsData = snapshot.docs.map((doc) => ({
    //   id: doc.id, // Include the document ID as 'id'
    //   ...doc.data(), // Include other data from the document
    // }));
    // setListings((prevListings) => [...prevListings, ...listingsData]);
    // console.log("LISTINGS", listingsData);
    // if (listingsData.length == 0) {
    //   console.log("LISTINGS NO MORE");
    //   setHasMoreListings(false);
    //   setLastListing(null);
    // } else {
    //   setLastListing(snapshot.docs[snapshot.docs.length - 1]);
    // }

    // Since data for ALL listings is loaded initially from one document read, we can just increment slice variable to load more instead of dynamically loading new docs
    if (searchQuery.length > 0) {
      return;
    }
    setVisibleListings(
      visibleListings + 10 < listings.length
        ? visibleListings + 10
        : listings.length
    );
  };

  const handleAdminButton = async () => {
    console.log("adminnnn");
    // Get ALL listings
    const listingsRef = collection(firestore, "listings");
    const snapshot = await getDocs(listingsRef);

    let id_to_rating = {};
    // For each document ID that has reviews, add to map of document to review array
    for (const d of snapshot.docs) {
      console.log(`d: ${JSON.stringify(d.data())}`);
      const dData = d.data();
      let dRatings = [];
      if (!("reviews" in dData)) {
        continue;
      }
      const dReviews = dData.reviews;
      for (const r of dReviews) {
        try {
          const thisReviewData = (
            await getDoc(doc(firestore, "reviews", r))
          ).data();
          console.log(thisReviewData.ScoreOverall);
          dRatings.push(parseInt(thisReviewData.ScoreOverall));
        } catch (error) {
          console.error(`Error retrieving review ${r}: ${error}`);
        }
      }
      const averagedRating =
        dRatings.reduce((acc, next) => acc + next, 0) / dRatings.length;
      id_to_rating[d.id] = averagedRating;
    }
    for (const [key, value] of Object.entries(id_to_rating)) {
      console.log(`Average rating for ${key} is ${value}`);
    }
    // Now I have an ID to valid reviews array map

    // Make new map: ID to rating
    // Iterate through each ID in the first map
    // Make array of ratings
    // Iterate through each review of this listing's array
    // Retrieve overall review, add to array
    //average the array and set this ID's value to the average rating

    const listingsData = snapshot.docs.map((doc) => ({
      [doc.id]: {
        address: doc.data().address || null,
        rent1: doc.data().rent1 || null,
        rent2: doc.data().rent2 || null,
        bed: doc.data().bedrooms || null,
        bath: doc.data().baths || null,
        image: doc.data().imageUrls
          ? doc.data().imageUrls[0]
            ? doc.data().imageUrls[0]
            : null
          : null,
        latLong: doc.data().latLong || null,
        rating: id_to_rating[doc.id] || null,
      },
    }));
    console.log(listingsData);

    const combinedData = listingsData.reduce((accumulator, currentObject) => {
      return { ...accumulator, ...currentObject };
    }, {});

    console.log("Combined Data (TO WRITE): " + JSON.stringify(combinedData));

    try {
      await setDoc(doc(firestore, "reference", "listings-toc"), combinedData);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    const tocDocRef = await getDoc(doc(firestore, "reference", "listings-toc"));
    console.log(`Size of table of contents: ${sizeof(tocDocRef.data())}`);
  };

  const fuseOptions = {
    // isCaseSensitive: false,
    // includeScore: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    threshold: 0.3,
    // distance: 100,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    keys: ["address"],
  };
  const fuse = new Fuse(listings, fuseOptions);

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);
  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  // #region OLD COMMENTED OUT SEARCH FEATURES
  // const handleSearch = () => {
  //     console.log("Handlesearch");
  //     if (searchQuery == 0) {
  //         setFilteredListings(listings.slice(0, visibleListings));
  //         return;
  //     }
  //     // const filteredData = listings.filter((doc) => {
  //     //     const addressWithoutSpaces = doc.address.replace(/\s|'/g, '');
  //     //     const searchQueryWithoutSpaces = searchQuery.replace(/\s|'/g, '');

  //     //     return addressWithoutSpaces.toLowerCase().includes(searchQueryWithoutSpaces.toLowerCase());
  //     //   });
  //     const searchedListings = fuse.search(searchQuery);
  //     const sortedListings = searchedListings.sort(
  //         (a, b) => a.refIndex - b.refIndex
  //     );
  //     const sortedItems = sortedListings.map((obj) => obj.item);

  //     setFilteredListings(sortedItems);
  // };

  // #endregion
  //     // If only bed/bath filter is applied, show the bed/bath filtered listings
  //     setFilteredListings(bedBathFilteredListings.slice(0, visibleListings));
  // };
  // #endregion

  const handleSearch = () => {
    console.log("Handlesearch");

    // Filter based on bed and bath values
    const bedBathFilteredListings = listings.filter((listing) => {
      const matchBeds =
        selectedBeds === "" ||
        (listing.bedrooms && listing.bedrooms.toString() === selectedBeds);
      const matchBaths =
        selectedBaths === "" ||
        (listing.bathroom && listing.bathroom.toString() === selectedBaths);

      return matchBeds && matchBaths;
    });

    // Filter based on rent range
    const rentFilteredListings = bedBathFilteredListings.filter((listing) => {
      const rentInRange =
        (selectedPrice1 === "" || listing.rent1 >= selectedPrice1) &&
        (selectedPrice2 === "" || listing.rent2 <= selectedPrice2);

      return rentInRange;
    });

    // If both bed/bath filter, rent range, and searchQuery are empty, show all listings
    if (
      selectedBeds === "" &&
      selectedBaths === "" &&
      selectedPrice1 === "" &&
      selectedPrice2 === "" &&
      searchQuery === "" &&
      showWrittenReviews == false
    ) {
      setFilteredListings(listings.slice(0, visibleListings));
      return;
    }

    // Apply Fuse.js search to the rent filtered listings if searchQuery is not empty
    if (searchQuery !== "") {
      const searchedListings = fuse.search(searchQuery, {
        limit: visibleListings,
      });
      const sortedListings = searchedListings.sort(
        (a, b) => a.refIndex - b.refIndex
      );
      const sortedItems = sortedListings.map((obj) => obj.item);
      if (showWrittenReviews == true) {
        sortedItems = sortedItems.filter((listing) => listing.rating != null);
      }
      // If bed/bath filter or rent range is applied, intersect the search results with the filtered listings
      if (
        selectedBeds !== "" ||
        selectedBaths !== "" ||
        selectedPrice1 !== "" ||
        selectedPrice2 !== ""
      ) {
        const combinedListings = sortedItems.filter((listing) =>
          rentFilteredListings.includes(listing)
        );
        setFilteredListings(combinedListings);
        return;
      }

      // If only searchQuery is applied, show the search results
      setFilteredListings(sortedItems);
      return;
    }

    // If only bed/bath filter or rent range is applied, show the filtered listings
    setFilteredListings(rentFilteredListings.slice(0, visibleListings));
  };

  useEffect(() => {
    setFilteredListings(listings.slice(0, visibleListings));
  }, [visibleListings]);

  useEffect(() => {
    //need to update search or based on visible listings
    setFilteredListings(listings.slice(0, visibleListings));
  }, [listings]);
  // Displaying markers

  useEffect(() => {
    if (searchQuery.length > 0) {
      setMarkers([]); // Clear markers if there's a search query
    }
    setMarkers(
      filteredListings
        .filter((listing) => listing.latLong && listing.latLong.length > 0) // Filter out listings with latLong data length of 0
        .map((listing) => ({
          lat: listing.latLong[0],
          lng: listing.latLong[1],
          text: listing.address,
          id: listing.id,
        }))
    );
  }, [filteredListings]);

  // useEffect(() => {
  //     // const displayedListings =
  //     //   searchQuery.length > 0 ? filteredListings : listings;
  //     if (searchQuery.length > 0) {
  //         setMarkers([]);
  //     }
  //     // console.log(
  //     //   `Displayed listings for marker setting useeffect: ${displayedListings}`
  //     // );
  //     filteredListings.forEach((listing) => {
  //         if (listing.latLong) {
  //             console.log(listing.latLong);
  //             console.log(listing.id);
  //             // need to add to useeffect array
  //             setMarkers((markers) => [
  //                 ...markers,
  //                 {
  //                     lat: listing.latLong[0],
  //                     lng: listing.latLong[1],
  //                     text: listing.address,
  //                     id: listing.id,
  //                 },
  //             ]);
  //             // markers.push( {lat:listing.latLong[0], lng:listing.latLong[1],text:listing.address} );
  //         }
  //     });
  //     console.log({ markers });
  // }, [filteredListings]);

  const AddressList = () => {
    const displayedListings =
      searchQuery.length > 0
        ? filteredListings
        : listings.slice(0, visibleListings);

    // Filter listings with imageUrls not equal to the specific URL

    return (
      <div className="address-list">
        {displayedListings.map((listing, index) => (
          <ListingBlock
            url={`/apartment/${listing.id}`}
            address={listing.address}
            s
            bedrooms={listing.bedrooms}
            bathroom={listing.bathroom}
            imageUrl={listing.imageUrls ? listing.imageUrls[0] : null}
            className="address-list-item"
          />
        ))}
        {visibleListings < listings.length && searchQuery.length == 0 && (
          <button onClick={loadMoreListings} className="address-list-load-more">
            Load More
          </button>
        )}
      </div>
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type === "application/json") {
      setSelectedReviewJSON(file);
    } else {
      alert("Please select a valid JSON file.");
    }
  };

  const handleProcessClick = async () => {
    console.log("Process click");
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const cleanedJsonString = cleanInvalidCharacters(event.target.result);

        const jsonData = JSON.parse(cleanedJsonString);
        console.log(JSON.stringify(jsonData, null, 4));
        processAndAddReview(jsonData);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
      }
    };

    reader.readAsText(selectedReviewJSON);
  };

  // Process uploaded JSON
  return (
    <div className="map-page-container">
      <Header />
      <div className="map-page-body">
        <div className="map-page-search">
          <input
            className="map-page-search-bar"
            type="text"
            placeholder="Search address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <FilterBed
            onFilterChange={handleBedBathFilterChange}
            onSearch={handleSearch}
          />
          <FilterPrice
            onFilterChange={handlePriceFilterChange}
            onSearch={handleSearch}
          />
          <FilterReviews
            onFilterChange={handleReviewsFilterChange}
            onSearch={handleSearch}
          />
        </div>
        <div className="map-page-listings">
          <div className="map-container">
            <GoogleMap markers={markers} mapHeight="100%" />
          </div>
          <div className="address-list-container">
            <InfiniteScroll
              dataLength={filteredListings.length}
              next={loadMoreListings}
              hasMore={hasMoreListings}
              loader={
                filteredListings.length == 0 ? (
                  <h1>No results</h1>
                ) : (
                  <h1>End of results</h1>
                )
              }
              className="address-list"
              height="89vh"
            >
              {filteredListings &&
                filteredListings.map((listing) => (
                  <ListingBlock
                    key={listing.id}
                    url={`/apartment/${listing.id}`}
                    address={listing.address}
                    bedrooms={listing.bedrooms}
                    bathroom={listing.bathroom}
                    rent1={listing.rent1}
                    rent2={listing.rent2}
                    imageUrl={listing.imageUrls ? listing.imageUrls[0] : null}
                    phone={listing.phone}
                    className="address-list-item"
                    rating={listing.rating}
                  />
                ))}
            </InfiniteScroll>
          </div>
        </div>
        {isAdmin && (
          <button onClick={handleAdminButton}>
            ADMIN FUNCTION: Reload Table of Contents
          </button>
        )}

        {isAdmin && (
          <div>
            <input type="file" accept=".json" onChange={handleFileChange} />
            <button onClick={handleProcessClick}>Process Reviews JSON</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
