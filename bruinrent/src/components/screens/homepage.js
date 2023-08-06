import React, { useState, useEffect } from "react";
import "./homepage.css"; // Import a separate CSS file for component-specific styles
import Waitlist from "./waitlist.js";
import { collection, getDocs } from "firebase/firestore";
import apart1 from "../../assets/apart_1.png";
import apart2 from "../../assets/apart_2.png";
import apart3 from "../../assets/apart_3.png";
import logo from "../../assets/logo_white.png";
import circle from "../../assets/blue_circle.png";
import { Link } from "react-router-dom";
import AddressBlock from "./AddressBlock.js";
import { app, firestore } from "../../firebase.js";

const Homepage = () => {
    // const handleWaitlistClick = () => {
    //     // window.location.href = "/Waitlist";
    // };
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

    console.log("Properties:", properties); // Check if properties data is available
    return (
        <div className="homepage-container">
            <div className="homepage-boxtop">
                <div className="homepage-content">
                    <h2 className="homepage-header">BruinRent</h2>

                    <button className="homepage-button1">List With Us</button>
                    <button className="homepage-button2">Sign In</button>

                    <img
                        className="homepage-logo"
                        src={logo}
                        alt="Bruin Rent Logo"
                    />
                </div>
                <div className="homepage-bigbox">
                    <h1 className="homepage-title">
                        Housing Made Easy For Bruins.
                    </h1>
                    <Link to="/Waitlist">
                        <button className="homepage-button3">
                            <h1 className="homepage-button3-text">
                                Join the Waitlist
                            </h1>
                        </button>
                    </Link>
                </div>
            </div>
            <div className="homepage-boxbot">
                <h3 className="homepage-populartext">
                    Popular Apartments Near You:
                </h3>
                <div className="homepage-image-container">
                    <div className="address">
                        {properties.map((property, index) => (
                            <AddressBlock
                                key={index}
                                address={property.Address}
                                bedrooms={property.Bedrooms}
                            />
                        ))}
                    </div>
                    <div className="homepage-image-item">
                        {/* <img
                            className="homepage-image"
                            src={apart1}
                            alt="Apartment 1"
                        />
                        <p className="homepage-image-detail1">123 Main St</p>
                        <p className="homepage-image-detail2">3 bed | 2 bath</p>
                        {/* <img
                            className="circle-image"
                            src={circle}
                            alt="Circle"
                        /> */}
                    </div>
                    <div className="homepage-image-item">
                        {/* <img
                            className="homepage-image"
                            src={apart2}
                            alt="Apartment 2"
                        />
                        <p className="homepage-image-detail1">456 Elm St</p>
                        <p className="homepage-image-detail2">3 bed | 2 bath</p> */}
                    </div>
                    <div className="homepage-image-item">
                        {/* <img
                            className="homepage-image"
                            src={apart3}
                            alt="Apartment 3"
                        />
                        <p className="homepage-image-detail1">789 Oak St</p>
                        <p className="homepage-image-detail2">3 bed | 2 bath</p> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
