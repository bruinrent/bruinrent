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
import House from "../../assets/Map.png";
import "./HousePage.css";
import Sidebar from "./Sidebar.js";
import CheckBox from "./Checkbox.js";

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
                        <img
                            style={{
                                maxWidth: "100%",
                                maxheight: "100%",
                                objectFit: "contain",
                                // marginLeft: "50px",
                            }}
                            src={House}
                            alt="House"
                        />

                        <div className="text-container">
                            <text className="basic-details">Basic Details</text>
                            <text className="address">Address:</text>
                            <input
                                className="address-text"

                                //onChange={onSearch}
                            />
                            <text className="address">
                                Describe Your Property:
                            </text>
                            <input
                                className="property-text"

                                //onChange={onSearch}
                            />
                        </div>
                    </BoxTemplate>
                    <BoxTemplate>
                        <div className="content-container">
                            <div className="centered-text">
                                <text className="unit-details">
                                    Unit Details
                                </text>
                            </div>
                            <div
                                className="left-aligned-content"
                                style={{ marginBottom: "30px" }}
                            >
                                <text className="unit-details-text">Size:</text>
                                <input
                                    className="unit-details-input"

                                    //onChange={onSearch}
                                />
                                <text className="grey-text">sq ft:</text>

                                <text
                                    className="unit-details-text"
                                    style={{ marginLeft: "50px" }}
                                >
                                    Bedrooms:
                                </text>

                                <input
                                    className="unit-details-input"

                                    //onChange={onSearch}
                                />

                                <text
                                    className="unit-details-text"
                                    style={{ marginLeft: "50px" }}
                                >
                                    Rent:
                                </text>

                                <input
                                    className="unit-details-input"

                                    //onChange={onSearch}
                                />

                                <text
                                    className="unit-details-text"
                                    style={{ marginLeft: "5px" }}
                                >
                                    to
                                </text>
                                <input
                                    className="unit-details-input"

                                    //onChange={onSearch}
                                />

                                <text
                                    className="unit-details-text"
                                    style={{ marginLeft: "50px" }}
                                >
                                    Deposit:
                                </text>

                                <input
                                    className="unit-details-input"

                                    //onChange={onSearch}
                                />
                            </div>
                            <div className="left-aligned-content">
                                <text className="unit-details-text">
                                    Units:
                                </text>
                                <input
                                    className="unit-details-input"

                                    //onChange={onSearch}
                                />

                                <text
                                    className="unit-details-text"
                                    style={{ marginLeft: "105px" }}
                                >
                                    Baths:
                                </text>

                                <input
                                    className="unit-details-input"

                                    //onChange={onSearch}
                                />

                                <text
                                    className="unit-details-text"
                                    style={{ marginLeft: "50px" }}
                                >
                                    Lease:
                                </text>

                                <input
                                    className="unit-details-input"

                                    //onChange={onSearch}
                                />

                                <text
                                    className="unit-details-text"
                                    style={{ marginLeft: "5px" }}
                                >
                                    to
                                </text>
                                <input
                                    className="unit-details-input"

                                    //onChange={onSearch}
                                />
                                <text className="grey-text">months:</text>
                            </div>
                        </div>
                    </BoxTemplate>
                    <BoxTemplate>
                        <div className="content-container">
                            <div className="centered-text">
                                <text className="unit-details">Tags</text>
                                <input className="tag-bar"></input>
                            </div>
                        </div>
                    </BoxTemplate>
                    <BoxTemplate>
                        <div className="content-container">
                            <div className="centered-text">
                                <text className="unit-details">
                                    Add a Video Tour{" "}
                                </text>
                            </div>
                            <div className="centered-text">
                                <text className="add-photos-text">
                                    By showing a video renters are able to see
                                    exactly what the apartment looks like!
                                </text>
                            </div>
                            <div className="centered-text">
                                <button className="upload-button">
                                    Upload
                                </button>
                            </div>
                            <div className="centered-text">
                                <text className="add-photos-text">
                                    If your video is on a 3rd party link (ex.
                                    Youtube), add the link here:
                                </text>
                            </div>

                            <div className="centered-text">
                                <input className="video-bar"></input>
                            </div>
                        </div>
                    </BoxTemplate>
                    <BoxTemplate>
                        <div
                            className="content-container"
                            style={{ marginTop: "75px" }}
                        >
                            <div className="centered-text">
                                <text
                                    className="unit-details"
                                    style={{ marginTop: "12px" }}
                                >
                                    Add Photos
                                </text>
                            </div>
                            <div className="centered-text">
                                <text className="add-photos-text">
                                    Remember to choose photos that showcase all
                                    important aspects of the home!
                                </text>
                            </div>
                            <div className="centered-text">
                                <img
                                    style={{
                                        maxWidth: "300.52px",
                                        maxheight: "207.822px",
                                        objectFit: "contain",
                                        borderRadius: "30px",
                                        flexShrink: "0",
                                        marginRight: "40px",

                                        // marginLeft: "50px",
                                    }}
                                    src={House}
                                    alt="House"
                                />
                                <img
                                    style={{
                                        maxWidth: "300.52px",
                                        maxheight: "207.822px",
                                        objectFit: "contain",
                                        borderRadius: "30px",
                                        flexShrink: "0",
                                        marginRight: "40px",

                                        // marginLeft: "50px",
                                    }}
                                    src={House}
                                    alt="House"
                                />
                                <img
                                    style={{
                                        maxWidth: "300.52px",
                                        maxheight: "207.822px",
                                        objectFit: "contain",
                                        borderRadius: "30px",
                                        flexShrink: "0",

                                        // marginLeft: "50px",
                                    }}
                                    src={House}
                                    alt="House"
                                />
                            </div>
                            <div className="centered-text">
                                <button className="upload-button">
                                    Upload
                                </button>
                            </div>
                        </div>
                    </BoxTemplate>
                    <BoxTemplate>
                        <div
                            className="content-container"
                            style={{ padding: "30px" }}
                        >
                            <div className="centered-text">
                                <text className="unit-details">
                                    Building Features
                                </text>
                            </div>
                            <div className="left-aligned-content">
                                <CheckBox></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>

                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>

                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                            </div>
                            <div
                                className="left-aligned-content"
                                style={{ marginTop: "30px" }}
                            >
                                <CheckBox></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>

                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>

                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                            </div>
                        </div>
                    </BoxTemplate>
                    <BoxTemplate>
                        <div
                            className="content-container"
                            style={{ padding: "30px" }}
                        >
                            <div className="centered-text">
                                <text className="unit-details">
                                    Apartment Features
                                </text>
                            </div>
                            <div className="left-aligned-content">
                                <CheckBox></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>

                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>

                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                            </div>
                            <div
                                className="left-aligned-content"
                                style={{ marginTop: "30px" }}
                            >
                                <CheckBox></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>

                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>

                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                            </div>
                        </div>
                    </BoxTemplate>
                    <BoxTemplate>
                        <div
                            className="content-container"
                            style={{ padding: "30px" }}
                        >
                            <div className="centered-text">
                                <text className="unit-details">Amenities</text>
                            </div>
                            <div className="left-aligned-content">
                                <CheckBox></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>

                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>

                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                            </div>
                            <div
                                className="left-aligned-content"
                                style={{ marginTop: "30px" }}
                            >
                                <CheckBox></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>

                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>

                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                                <CheckBox
                                    style={{ marginLeft: "10px" }}
                                ></CheckBox>
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginRight: "90px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Baths:
                                </text>
                            </div>
                        </div>
                    </BoxTemplate>
                    <BoxTemplate>
                        <div className="content-container">
                            <div className="centered-text">
                                <text className="unit-details">Parking</text>
                            </div>

                            <div
                                className="left-aligned-content"
                                style={{ marginTop: "-50px" }}
                            >
                                <CheckBox style={{ marginRight: "10px" }} />{" "}
                                {/* Render CheckBox first */}
                                <text
                                    className="unit-details-text"
                                    style={{
                                        marginLeft: "10px",
                                        marginTop: "5px",
                                    }}
                                >
                                    Parking Included
                                </text>
                            </div>

                            <div
                                className="left-aligned-content"
                                style={{ marginTop: "30px" }}
                            >
                                <text className="unit-details-text">
                                    Single Price:
                                </text>

                                <input
                                    className="unit-details-input"

                                    //onChange={onSearch}
                                />

                                <text
                                    className="unit-details-text"
                                    style={{ marginLeft: "30px" }}
                                >
                                    Tandem Price:
                                </text>

                                <input
                                    className="unit-details-input"

                                    //onChange={onSearch}
                                />

                                <text
                                    className="unit-details-text"
                                    style={{ marginLeft: "30px" }}
                                >
                                    Type available:
                                </text>

                                <input
                                    className="unit-details-input"

                                    //onChange={onSearch}
                                />
                            </div>
                        </div>
                    </BoxTemplate>
                    <BoxTemplate>
                        <div className="content-container">
                            <div className="centered-text">
                                <text className="unit-details">Contact</text>
                            </div>

                            <div
                                className="left-aligned-content"
                                style={{ marginTop: "-50px" }}
                            >
                                <text className="unit-details-text">
                                    First Name:
                                </text>

                                <text
                                    className="unit-details-text"
                                    style={{ marginLeft: "250px" }}
                                >
                                    Last Name:
                                </text>
                            </div>

                            <div
                                className="left-aligned-content"
                                style={{
                                    marginTop: "15px",
                                    marginLeft: "-10px",
                                }}
                            >
                                <input
                                    className="unit-details-input"
                                    style={{
                                        width: "266.098px",
                                    }}
                                    //onChange={onSearch}
                                />

                                <input
                                    className="unit-details-input"
                                    style={{
                                        marginLeft: "40px",
                                        width: "266.098px",
                                    }}
                                    //onChange={onSearch}
                                />
                            </div>

                            <div
                                className="left-aligned-text"
                                style={{ marginTop: "15px" }}
                            >
                                <text className="unit-details-text">
                                    Email:
                                </text>

                                <text
                                    className="unit-details-text"
                                    style={{ marginLeft: "500px" }}
                                >
                                    Email:
                                </text>
                            </div>

                            <div
                                className="left-aligned-text"
                                style={{
                                    marginTop: "10px",
                                    marginLeft: "-10px",
                                }}
                            >
                                <input
                                    className="unit-details-input"
                                    style={{
                                        width: "500.355px",
                                    }}
                                    //onChange={onSearch}
                                />

                                <input
                                    className="unit-details-input"
                                    style={{
                                        marginLeft: "20px",
                                        width: "500.355px",
                                    }}
                                    //onChange={onSearch}
                                />
                            </div>
                        </div>
                    </BoxTemplate>
                </div>
            </div>
        </div>
    );
};

export default HousePage;
