import React, { useState, useEffect } from "react";
import "./homepage.css"; // Import a separate CSS file for component-specific styles
import { collection, getDocs } from "firebase/firestore";
import apart1 from "../../assets/apart_1.png";
import { Link } from "react-router-dom";
import AddressBlock from "./AddressBlock.js";
import Map from "./Map.js";
import { app, firestore } from "../../firebase.js";
import "leaflet/dist/leaflet.css";
import { list } from "firebase/storage";
import Header from "../Header.jsx";

const MapPage = () => {
    const markers = [];

    const [listings, setListings] = useState([]);
    const [visibleListings, setVisibleListings] = useState(10); // Display the first 10 listings

    const loadMoreListings = () => {
        // Increase the number of visible listings by 10
        setVisibleListings((prevVisibleListings) => prevVisibleListings + 10);
    };

    useEffect(() => {
        // Fetch data from the "listings" collection in Firestore
        const fetchListings = async () => {
            const listingsRef = collection(firestore, "listings");
            const snapshot = await getDocs(listingsRef);
            const listingsData = snapshot.docs.map((doc) => ({
                id: doc.id, // Include the document ID as 'id'
                ...doc.data(), // Include other data from the document
            }));
            setListings(listingsData);
        };

        fetchListings();
    }, []);

    return (
        <div className="map-page-container">
            <Header />
            <div className="map-page-body">
                <div className="map-page-search">
                    <input
                        className="map-page-search-bar"
                        type="text"
                        placeholder="Point of Interest"
                        //onChange={onSearch}
                    />
                </div>
                <div className="map-page-listings">
                    <div className="map-container">
                        <Map markers={markers} />
                    </div>
                    <div className="address-list">
                        {listings
                            .slice(0, visibleListings)
                            .map((listing, index) => (
                                <AddressBlock
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
                                />
                            ))}
                        {visibleListings < listings.length && (
                            <button onClick={loadMoreListings}>
                                Load More
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapPage;
