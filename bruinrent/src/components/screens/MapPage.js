import React, { useState, useEffect } from "react";
import "./MapPage.css"; // Import a separate CSS file for component-specific styles
import "leaflet/dist/leaflet.css";
import { useAuthContext } from "../AuthContext.js";
import { firestore } from "../../firebase.js";
import sizeof from "firestore-size";
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

const MapPage = () => {
  const NUMBER_OF_LISTINGS = 10;
  const [listings, setListings] = useState([]);
  const [hasMoreListings, setHasMoreListings] = useState(true);
  const [visibleListings, setVisibleListings] = useState(10); // Display the first 10 listings
  const [lastListing, setLastListing] = useState(null);

  const [filteredListings, setFilteredListings] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuthContext();


  const [selectedReviewJSON, setSelectedReviewJSON] = useState(null);
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

      const tocData = (
        await getDoc(doc(firestore, "reference", "listings-toc"))
      ).data();
      const listingsData = Object.entries(tocData).map(([id, data]) => ({
        id,
        address: data.address,
        rent1: data.rent1,
        rent2: data.rent2,
        bedrooms: data.bed,
        bathroom: data.bath,
        latLong: data.latLong,
        imageUrls: [data.image],
        phone: data.phone,
      }));
      const sortedListingData = listingsData.sort((a, b) =>
        a.address.localeCompare(b.address)
      );
      setListings(sortedListingData);
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
    const listingsData = snapshot.docs.map((doc) => ({
      [doc.id]: {
        address: doc.data().address,
        rent1: doc.data().rent1,
        rent2: doc.data().rent2,
        bed: doc.data().bedrooms,
        bath: doc.data().baths,
        image: doc.data().imageUrls[0] ? doc.data().imageUrls[0] : null,
        latLong: doc.data().latLong || null,
        phone: doc.data().phone,
      },
    }));
    console.log(listingsData);

    const combinedData = listingsData.reduce((accumulator, currentObject) => {
      return { ...accumulator, ...currentObject };
    }, {});

    // Now combinedData has the structure you want
    console.log(combinedData);
    const collectionRef = collection(firestore, "reference"); // Replace "listings" with your collection name

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

  const handleSearch = () => {
    console.log("Handlesearch");
    if (searchQuery == 0) {
      setFilteredListings(listings.slice(0, visibleListings));
      return;
    }
    // const filteredData = listings.filter((doc) => {
    //     const addressWithoutSpaces = doc.address.replace(/\s|'/g, '');
    //     const searchQueryWithoutSpaces = searchQuery.replace(/\s|'/g, '');

    //     return addressWithoutSpaces.toLowerCase().includes(searchQueryWithoutSpaces.toLowerCase());
    //   });
    const searchedListings = fuse.search(searchQuery);
    const sortedListings = searchedListings.sort(
      (a, b) => a.refIndex - b.refIndex
    );
    const sortedItems = sortedListings.map((obj) => obj.item);

    setFilteredListings(sortedItems);
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
    // const displayedListings =
    //   searchQuery.length > 0 ? filteredListings : listings;
    if (searchQuery.length > 0) {
      setMarkers([]);
    }
    // console.log(
    //   `Displayed listings for marker setting useeffect: ${displayedListings}`
    // );
    filteredListings.forEach((listing) => {
      if (listing.latLong) {
        console.log(listing.latLong);
        console.log(listing.id);
        // need to add to useeffect array
        setMarkers((markers) => [
          ...markers,
          {
            lat: listing.latLong[0],
            lng: listing.latLong[1],
            text: listing.address,
            id: listing.id,
          },
        ]);
        // markers.push( {lat:listing.latLong[0], lng:listing.latLong[1],text:listing.address} );
      }
    });
    console.log({ markers });
  }, [filteredListings]);

  const AddressList = () => {
    const displayedListings =
      searchQuery.length > 0
        ? filteredListings
        : listings.slice(0, visibleListings);
    return (
      <div className="address-list">
        {displayedListings.map((listing, index) => (
          <ListingBlock
            url={`/apartment/${listing.id}`}
            address={listing.address}
            s
            bedrooms={listing.bedrooms}
            bathroom={listing.baths}
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

    if (file && file.type === 'application/json') {
      setSelectedReviewJSON(file);
    } else {
      alert('Please select a valid JSON file.');
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
          console.error('Error parsing JSON file:', error);
        }
      };
    
    reader.readAsText(selectedReviewJSON);

  }

  // Process uploaded JSON
  const processAndAddReview = async (jsonData) => {
    console.log("process and add review call");
    

    const reviewsTocRef = doc(firestore, "reference", "reviews-toc");
    const reviewsTocData = (
      await getDoc(reviewsTocRef)
    ).data();
    console.log("Reviews toc: " + JSON.stringify(reviewsTocData, null, 4));

    // Turn array of reviews to object of objects of reviews where submission id is key, and removed
    const objectOfObjectsNewReviews = jsonData.reduce((acc, obj) => {
      // Destructure obj into submission id and the rest
      const {SubmissionID, ...rest} = obj;
      acc[obj.SubmissionID] = rest;
      return acc;
    }, {});
    
    // Store keys of already existing reviews
    const reviewsTocKeysSet = new Set(Object.keys(reviewsTocData));

    const actualNewReviews = {};
      for (const key in objectOfObjectsNewReviews) {
        if (!reviewsTocKeysSet.has(key)) {
          actualNewReviews[key] = objectOfObjectsNewReviews[key];
          reviewsTocData[key] = objectOfObjectsNewReviews[key].SubmissionTime;
        } else {
          console.log("Duplicate found: " + key + ": " + JSON.stringify(objectOfObjectsNewReviews[key], null, 4));
        }
      }
    
      console.log("Actual New Reviews: " + JSON.stringify(actualNewReviews, null, 4));
      console.log("Updated reviewsTocData: " + JSON.stringify(reviewsTocData, null, 4));

      // Update reviewsToc with new data
      await setDoc(reviewsTocRef, reviewsTocData);
      
      // Add all latlongs to new reviews, and add empty parents 
      for (const key in actualNewReviews) { 
        actualNewReviews[key].LatLong = await addressToLatLong(actualNewReviews[key].Address);
        actualNewReviews[key].parents = [];

      }
      console.log("Actual New Reviews with latlong: " + JSON.stringify(actualNewReviews, null, 4));

      // Fetch listingsToc
      const listingsTocData = (
        await getDoc(doc(firestore, "reference", "listings-toc"))
      ).data();
      console.log("Listings toc: " + JSON.stringify(listingsTocData, null, 4));

      // Use map of listing latLong to ID
      const latLongToIdMap = new Map();

      for (const [id, listing] of Object.entries(listingsTocData)) {
        const latLong = JSON.stringify(listing.latLong);
        latLongToIdMap.set(latLong, id);
      }

      for (const [key, value] of latLongToIdMap) {
        console.log(`${key} => ${value}`);
      }

      // For each new review, check if it has a correponding apartment
      // If so, update parent to remember review, and review to remember parent
      // Either way, write review in as a new doc
      for (const reviewKey in actualNewReviews) {
        const thisReviewLatLongString = JSON.stringify(actualNewReviews[reviewKey].LatLong)
        if (latLongToIdMap.has(thisReviewLatLongString)) {
          const matchingListingID = latLongToIdMap.get(thisReviewLatLongString);
          // 1. If found existing listing in listings toc, add listing ID to reviews' parents list
          actualNewReviews[reviewKey].parents.push(matchingListingID);


          // 2. If found existing listing, also add review ID to parent listing's reviews list in actual listing document
            // a) get listing's data
          const listingDocRef = doc(firestore, "listings", matchingListingID);
          const listingSnapshot = await getDoc(listingDocRef);
          const listingData = listingSnapshot.data();
            // b) Edit data to add
          if (!('reviews' in listingData)) {listingData.reviews = [];}
          listingData.reviews.push(reviewKey);
            // c) write the data again
            console.log("Will write the following to listing " + matchingListingID + ": " + JSON.stringify(listingData, null, 4));
            // await setDoc(listingDocRef, listingData); 

        } else {
          //orphan review
        }
        // Write doc
        console.log("Will write following data to review doc with id " + reviewKey + ": " + JSON.stringify(actualNewReviews[reviewKey], null, 4)); 

      }
    

  
  }

  const cleanInvalidCharacters = (jsonString) => {
    // Define a regular expression to match invalid characters
    const cleanedJsonString = jsonString
    .split('')
    .filter((char) => {
      const charCode = char.charCodeAt(0);
      return charCode === 9 || (charCode >= 32 && charCode <= 126) || (charCode >= 160 && charCode <= 1114111);
    })
    .join('');
  
    return cleanedJsonString;
  };

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
                    bathroom={listing.baths}
                    rent1={listing.rent1}
                    rent2={listing.rent2}
                    imageUrl={listing.imageUrls ? listing.imageUrls[0] : null}
                    phone={listing.phone}
                    className="address-list-item"
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
         <button onClick={handleProcessClick} >Process Reviews JSON</button> 
         </div>
        )}
        
      </div>
    </div>
  );
};

export default MapPage;
