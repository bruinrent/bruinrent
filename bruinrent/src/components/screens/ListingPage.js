import React, { useState, useEffect } from "react";
import "./homepage.css"; // Import a separate CSS file for component-specific styles
import { collection, getDocs, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import logo from "../../assets/logo_white.png";
import { Link } from "react-router-dom";
import "./MapPage.css";
import { app, firestore } from "../../firebase.js";
import BoxTemplate from "./Box.js";
import House from "../../assets/Map.png";
import "./ListingPage.css";
import Sidebar from "./Sidebar.js";
import CheckBox from "./Checkbox.js";

const ListingPage = () => {
    const [properties, setProperties] = useState([]);
    const [address, setAddress] = useState("");
    const [addressDesc, setAddressDesc] = useState("");
    const [size, setSize] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [rent1, setRent1] = useState("");
    const [rent2, setRent2] = useState("");
    const [deposit, setDeposit] = useState("");
    const [units, setUnits] = useState("");
    const [baths, setBaths] = useState("");
    const [lease1, setLease1] = useState("");
    const [lease2, setLease2] = useState("");
    const [tags, setTags] = useState("");
    const [videoLink, setVideoLink] = useState("");
    const [parkingSinglePrice, setParkingSinglePrice] = useState("");
    const [parkingTandemPrice, setParkingTandemPrice] = useState("");
    const [parkingType, setParkingType] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [imageFiles, setImageFiles] = useState([]);

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

    const handleLogStates = () => {
        console.log("Address:", address);
        console.log("Description:", addressDesc);
        console.log(size);
        console.log(bedrooms);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const storage = getStorage();

        // Upload each selected image to Firebase Storage
        const imageUrls = [];
        for (const imageFile of imageFiles) {
            const imageRef = ref(storage, "images/" + imageFile.name);

            try {
                // Upload the image file
                await uploadBytes(imageRef, imageFile);

                // Get the download URL for the uploaded image
                const imageUrl = await getDownloadURL(imageRef);

                // Add the image URL to the array
                imageUrls.push(imageUrl);
            } catch (error) {
                console.error("Error uploading image: ", error);
            }
        }

        const formData = {
            address,
            addressDesc,
            size,
            bedrooms,
            rent1,
            rent2,
            deposit,
            units,
            baths,
            lease1,
            lease2,
            tags,
            videoLink,
            parkingSinglePrice,
            parkingTandemPrice,
            parkingType,
            firstName,
            lastName,
            email,
            phone,
            imageUrls,
        };

        // Write the form data to the Firestore collection

        const collectionRef = collection(firestore, "listings"); // Replace "listings" with your collection name

        try {
            const docRef = await addDoc(collectionRef, formData);
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };
    const handleFileSelect = (e) => {
        const selectedFiles = e.target.files;
        setImageFiles(Array.from(selectedFiles));
    };
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
                                type="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <text className="address">
                                Describe Your Property:
                            </text>
                            <input
                                className="property-text"
                                type="addressDesc"
                                value={addressDesc}
                                onChange={(e) => setAddressDesc(e.target.value)}
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
                                    type="size"
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
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
                                    type="bedrooms"
                                    value={bedrooms}
                                    onChange={(e) =>
                                        setBedrooms(e.target.value)
                                    }
                                />

                                <text
                                    className="unit-details-text"
                                    style={{ marginLeft: "60px" }}
                                >
                                    Rent:
                                </text>

                                <input
                                    className="unit-details-input"
                                    type="rent"
                                    value={rent1}
                                    onChange={(e) => setRent1(e.target.value)}
                                />

                                <text
                                    className="unit-details-text"
                                    style={{ marginLeft: "5px" }}
                                >
                                    to
                                </text>
                                <input
                                    className="unit-details-input"
                                    type="rent"
                                    value={rent2}
                                    onChange={(e) => setRent2(e.target.value)}
                                />
                            </div>
                            <div className="left-aligned-content">
                                <text className="unit-details-text">
                                    Units:
                                </text>
                                <input
                                    className="unit-details-input"
                                    type="units"
                                    value={units}
                                    onChange={(e) => setUnits(e.target.value)}
                                />

                                <text
                                    className="unit-details-text"
                                    style={{ marginLeft: "105px" }}
                                >
                                    Baths:
                                </text>

                                <input
                                    className="unit-details-input"
                                    type="baths"
                                    value={baths}
                                    onChange={(e) => setBaths(e.target.value)}
                                />

                                <text
                                    className="unit-details-text"
                                    style={{ marginLeft: "50px" }}
                                >
                                    Lease:
                                </text>

                                <input
                                    className="unit-details-input"
                                    type="lease"
                                    value={lease1}
                                    onChange={(e) => setLease1(e.target.value)}
                                />

                                <text
                                    className="unit-details-text"
                                    style={{ marginLeft: "5px" }}
                                >
                                    to
                                </text>
                                <input
                                    className="unit-details-input"
                                    type="lease"
                                    value={lease2}
                                    onChange={(e) => setLease2(e.target.value)}
                                />
                                <text className="grey-text">months:</text>
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
                                <input
                                    className="video-bar"
                                    type="video"
                                    value={videoLink}
                                    onChange={(e) =>
                                        setVideoLink(e.target.value)
                                    }
                                ></input>
                            </div>
                        </div>
                    </BoxTemplate>
                    <BoxTemplate>
                        <div
                            className="content-container"
                            style={{
                                // marginTop: "55px",
                                height: "300px",
                                padding: "0px",
                            }}
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
                                <div className="custom-file-input">
                                    <label
                                        htmlFor="file-upload"
                                        className="custom-file-label"
                                    >
                                        Choose Images
                                    </label>
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden-file-input"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        multiple
                                    />
                                </div>
                                <div>
                                    <p>Selected Files:</p>
                                    <ul>
                                        {imageFiles.map((file, index) => (
                                            <li key={index}>{file.name}</li>
                                        ))}
                                    </ul>
                                </div>
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
                                    type="price"
                                    value={parkingSinglePrice}
                                    onChange={(e) =>
                                        setParkingSinglePrice(e.target.value)
                                    }
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
                                    type="price"
                                    value={parkingTandemPrice}
                                    onChange={(e) =>
                                        setParkingTandemPrice(e.target.value)
                                    }
                                />

                                <text
                                    className="unit-details-text"
                                    style={{ marginLeft: "30px" }}
                                >
                                    Type available:
                                </text>

                                <input
                                    className="unit-details-input"
                                    type="price"
                                    value={parkingType}
                                    onChange={(e) =>
                                        setParkingType(e.target.value)
                                    }
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
                                    type="name"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                />

                                <input
                                    className="unit-details-input"
                                    style={{
                                        marginLeft: "40px",
                                        width: "266.098px",
                                    }}
                                    type="name"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
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
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <input
                                    className="unit-details-input"
                                    style={{
                                        marginLeft: "20px",
                                        width: "500.355px",
                                    }}
                                    type="name"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>
                    </BoxTemplate>
                    <button onClick={handleSubmit}>hi</button>
                </div>
            </div>
        </div>
    );
};

export default ListingPage;
