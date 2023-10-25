import React, { useState, useEffect } from "react";
import "./homepage.css"; // Import a separate CSS file for component-specific styles
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import AddressBlock from "./AddressBlock.js";
import { app, firestore } from "../../firebase.js";
import Header from "../Header.jsx";

const Homepage = () => {
    // const handleWaitlistClick = () => {
    //     // window.location.href = "/Waitlist";
    // };
    const [listings, setListings] = useState([]);

    useEffect(() => {
        // Fetch data from Firestore and set it in the state
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

    console.log("Properties:", listings); // Check if properties data is available
    return (
        <div className="homepage-container">
            <Header />
            <div className="homepage-banner">
                <h1 className="homepage-banner-title">
                    Housing Made Easy For Bruins.
                </h1>
                <div className="homepage-banner-button-container">
                    <Link to="ListingPage">
                        <button className="homepage-banner-button">
                            List a Property
                        </button>
                    </Link>
                    <Link to="MapPage">
                        <button className="homepage-banner-button">
                            Start Your Search
                        </button>
                    </Link>
                </div>
            </div>
            <div className="homepage-body">
                <div className="homepage-body-listing-container">
                    <h2 className="homepage-body-title">Popular Apartments</h2>
                    <div className="homepage-body-listings">
                        {listings.slice(0, 6).map((listing) => (
                            <AddressBlock
                                url={`/apartment/${listing.id}`}
                                address={listing.address}
                                s
                                bedrooms={listing.bedrooms}
                                bathroom={listing.bathroom}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
