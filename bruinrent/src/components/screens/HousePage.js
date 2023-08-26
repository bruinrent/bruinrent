import React, { useState, useEffect } from "react";
import "./homepage.css"; // Import a separate CSS file for component-specific styles
import Waitlist from "./waitlist.js";
import { collection, getDocs } from "firebase/firestore";
import apart1 from "../../assets/apart_1.png";
import logo from "../../assets/logo_white.png";
import { Link } from "react-router-dom";
import AddressBlock from "./AddressBlock.js";
import Map from "./Map.js";
import "./MapPage.css";
import { app, firestore } from "../../firebase.js";
import BoxTemplate from "./Box.js";

import Sidebar from "./Sidebar.js";

const HousePage = () => {
    // const handleWaitlistClick = () => {
    //     // window.location.href = "/Waitlist";
    const markers = [
        //{ lat: 51.505, lng: -0.09, popupContent: "Marker 1" },
        // Add more markers as needed
    ];

    const [properties, setProperties] = useState([]);

    useEffect(() => {
        // Fetch data from Firestore and set it in the state
        const fetchProperties = async () => {
            const propertiesRef = collection(firestore, "apartments");
            const snapshot = await getDocs(propertiesRef);
            const propertyData = snapshot.docs.map((doc) => doc.data());
            setProperties(propertyData);
        };

        fetchProperties();
    }, []);

    const headerStyle = {
        color: "#100F0D",
        fontFamily: "Lato",
        fontSize: "30px",
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: "normal",
        marginLeft: "250px",
    };

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
            <div className="page-container">
                <div className="sidebar-container">
                    <Sidebar />
                </div>
                <div className="content-container">
                    <h2 style={headerStyle}>List Your Property</h2>
                    <BoxTemplate>
                        <text>hi</text>
                    </BoxTemplate>
                    <BoxTemplate>
                        <text>hi</text>
                    </BoxTemplate>
                    <BoxTemplate>
                        <text>hi</text>
                    </BoxTemplate>
                </div>
            </div>
        </div>
    );
};

export default HousePage;
