import React, { useState, useEffect } from "react";
import "./MapPage.css"; // Import a separate CSS file for component-specific styles
import "leaflet/dist/leaflet.css";
import { useAuthContext } from "../AuthContext.js";
import { firestore } from "../../firebase.js";
import { useSpring, animated } from "@react-spring/web";
import sizeof from "firestore-size";
import FilterBed from "../FilterButtonBed.js";
import FilterPrice from "../FilterButtonPrice.js";

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
import AddressBlock from "./AddressBlock.js";
import GoogleMap from "../GoogleMap.js";
import Header from "../Header.jsx";
import Fuse from "fuse.js";
import { useInsertionEffect } from "react";

const MapPage = () => {
    const [selectedBeds, setSelectedBeds] = useState("");
    const [selectedBaths, setSelectedBaths] = useState("");
    const [selectedPrice1, setSelectedPrice1] = useState("");
    const [selectedPrice2, setSelectedPrice2] = useState("");

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
        console.log("rent 1", rent1);
        console.log("rent 2", rent2);
    };

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
                image: doc.data().imageUrls ? doc.data().imageUrls[0] : null,
                latLong: doc.data().latLong || null,
            },
        }));
        console.log(listingsData);

        const combinedData = listingsData.reduce(
            (accumulator, currentObject) => {
                return { ...accumulator, ...currentObject };
            },
            {}
        );

        // Now combinedData has the structure you want
        console.log(combinedData);
        const collectionRef = collection(firestore, "reference"); // Replace "listings" with your collection name

        try {
            await setDoc(
                doc(firestore, "reference", "listings-toc"),
                combinedData
            );
        } catch (error) {
            console.error("Error adding document: ", error);
        }
        const tocDocRef = await getDoc(
            doc(firestore, "reference", "listings-toc")
        );
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

    // const handleSearch = () => {
    //     console.log("Handlesearch");

    //     // Filter based on bed and bath values
    //     const bedBathFilteredListings = listings.filter((listing) => {
    //         const matchBeds =
    //             selectedBeds === "" ||
    //             listing.bedrooms.toString() === selectedBeds;
    //         const matchBaths =
    //             selectedBaths === "" ||
    //             listing.bathroom.toString() === selectedBaths;

    //         return matchBeds && matchBaths;
    //     });

    //     // If both bed/bath filter and searchQuery are empty, show all listings
    //     if (selectedBeds === "" && selectedBaths === "" && searchQuery === "") {
    //         setFilteredListings(listings.slice(0, visibleListings));
    //         return;
    //     }

    //     // Apply Fuse.js search to the bed/bath filtered listings if searchQuery is not empty
    //     if (searchQuery !== "") {
    //         const searchedListings = fuse.search(searchQuery, {
    //             limit: visibleListings,
    //         });
    //         const sortedListings = searchedListings.sort(
    //             (a, b) => a.refIndex - b.refIndex
    //         );
    //         const sortedItems = sortedListings.map((obj) => obj.item);

    //         // If bed/bath filter is applied, intersect the search results with the bed/bath filtered listings
    //         if (selectedBeds !== "" || selectedBaths !== "") {
    //             const combinedListings = sortedItems.filter((listing) =>
    //                 bedBathFilteredListings.includes(listing)
    //             );
    //             setFilteredListings(combinedListings);
    //             return;
    //         }

    //         // If only searchQuery is applied, show the search results
    //         setFilteredListings(sortedItems);
    //         return;
    //     }

    //     // If only bed/bath filter is applied, show the bed/bath filtered listings
    //     setFilteredListings(bedBathFilteredListings.slice(0, visibleListings));
    // };

    const handleSearch = () => {
        console.log("Handlesearch");

        // Filter based on bed and bath values
        const bedBathFilteredListings = listings.filter((listing) => {
            const matchBeds =
                selectedBeds === "" ||
                listing.bedrooms.toString() === selectedBeds;
            const matchBaths =
                selectedBaths === "" ||
                listing.bathroom.toString() === selectedBaths;

            return matchBeds && matchBaths;
        });

        // Filter based on rent range
        const rentFilteredListings = bedBathFilteredListings.filter(
            (listing) => {
                const rentInRange =
                    (selectedPrice1 === "" ||
                        listing.rent1 >= selectedPrice1) &&
                    (selectedPrice2 === "" || listing.rent2 <= selectedPrice2);

                return rentInRange;
            }
        );

        // If both bed/bath filter, rent range, and searchQuery are empty, show all listings
        if (
            selectedBeds === "" &&
            selectedBaths === "" &&
            selectedPrice1 === "" &&
            selectedPrice2 === "" &&
            searchQuery === ""
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
                    <AddressBlock
                        url={`/apartment/${listing.id}`}
                        address={listing.address}
                        s
                        bedrooms={listing.bedrooms}
                        bathroom={listing.baths}
                        imageUrl={
                            listing.imageUrls ? listing.imageUrls[0] : null
                        }
                        className="address-list-item"
                    />
                ))}
                {visibleListings < listings.length &&
                    searchQuery.length == 0 && (
                        <button
                            onClick={loadMoreListings}
                            className="address-list-load-more"
                        >
                            Load More
                        </button>
                    )}
            </div>
        );
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

                    <FilterBed
                        onFilterChange={handleBedBathFilterChange}
                        onSearch={handleSearch}
                    />
                    <FilterPrice
                        onFilterChange={handlePriceFilterChange}
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
                                    <AddressBlock
                                        key={listing.id}
                                        url={`/apartment/${listing.id}`}
                                        address={listing.address}
                                        s
                                        bedrooms={listing.bedrooms}
                                        bathroom={listing.bathroom}
                                        imageUrl={
                                            listing.imageUrls
                                                ? listing.imageUrls[0]
                                                : null
                                        }
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
            </div>
        </div>
    );
};

export default MapPage;
