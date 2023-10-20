import React, { useState, useEffect } from "react";
import "./homepage.css"; // Import a separate CSS file for component-specific styles
import { collection, getDocs } from "firebase/firestore";
import logo from "../../assets/logo_white.png";
import { Link } from "react-router-dom";
import AddressBlock from "./AddressBlock.js";
import Map from "./Map.js";
import { app, firestore } from "../../firebase.js";
import "leaflet/dist/leaflet.css";
import { list } from "firebase/storage";

const MapPage = () => {
    const markers = [];

    const [listings, setListings] = useState([]);

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
        <div className="homepage-boxtop">
            <div className="homepage-content">
                <h2 className="homepage-header">BruinRent</h2>

                <Link to="/Construction">
                    <button className="homepage-button1">List With Us</button>
                </Link>

                <Link to="/Construction">
                    <button className="homepage-button2">Sign In</button>
                </Link>

                <img
                    className="homepage-logo"
                    src={logo}
                    alt="Bruin Rent Logo"
                />
            </div>

            <div className="tab">
                <div className="tab-content">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search..."
                            //onChange={onSearch}
                        />
                        <button>Button 1</button>
                        <button>Button 2</button>
                    </div>
                </div>
            </div>

            <div className="map-page">
                <div className="map-container">
                    <Map markers={markers} />
                </div>
                <div className="address-list">
                {listings.map((listing, index) => (
                    <Link to={`/apartment/${listing.id}`} key={index}>
                        <AddressBlock
                            address={listing.address}s
                            bedrooms={listing.bedrooms}
                            bathroom={listing.bathroom}
                        />
                    </Link>
                ))}
                </div>
            </div>
        </div>
    );
};

export default MapPage;
