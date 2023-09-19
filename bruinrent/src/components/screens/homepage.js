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
import ListingPage from "./ListingPage.js";
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

                    <Link to="/ListingPage">
                        <button className="homepage-button1">
                            List With Us
                        </button>
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
                <div className="homepage-bigbox">
                    <h1 className="homepage-title">
                        Housing Made Easy For Bruins.
                    </h1>
                    <div className="homepage-white-container">
                        <div className="homepage-rangeline">
                            <p className="homepage-text">Bedrooms:</p>
                            <button className="homepage-button">
                                <div className="button-content"></div>
                                <div className="button-text">1</div>
                            </button>
                            <p className="homepage-text">Price Range:</p>
                            <button className="homepage-button">Button2</button>
                            <p className="homepage-to">to</p>
                            <button className="homepage-button">Button2</button>
                        </div>

                        <div className="homepage-button-container">
                            <Link to="MapPage">
                                <button className="homepage-button-search">
                                    Start Your Search
                                </button>
                            </Link>

                            <p className="homepage-button-explore">
                                Explore All Apartments
                            </p>
                        </div>
                    </div>

                    {/* <Link to="/Waitlist"> // waitlist button removed!
                        <button className="homepage-button3">
                            <h1 className="homepage-button3-text">
                                Join the Waitlist
                            </h1>
                        </button>
                    </Link> */}
                </div>
            </div>
            <div className="homepage-boxbot">
                <h3 className="homepage-populartext">
                    Popular Apartments Near You:
                </h3>
                <div className="address-block">
                    {properties.slice(0, 6).map((property, index) => (
                        <AddressBlock
                            key={index}
                            address={property.Address}
                            bedrooms={property.Bedrooms}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Homepage;
