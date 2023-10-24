import React, { useState } from "react";
import "./homepage.css"; // Import a separate CSS file for component-specific styles
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { Link, useNavigate } from "react-router-dom";
import "./MapPage.css";
import { app, firestore } from "../../firebase.js";
import BoxTemplate from "./Box.js";
import House from "../../assets/Map.png";
import "./ListingPage.css";
import Sidebar from "./Sidebar.js";
import CheckBox from "./Checkbox.js";
import Header from "../Header.jsx";
import addressToLongLat from "../addressToLongLat.js";

const ListingPage = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [addressDesc, setAddressDesc] = useState("");
  const [size, setSize] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [rent1, setRent1] = useState("");
  const [rent2, setRent2] = useState("");
  const [units, setUnits] = useState("");
  const [baths, setBaths] = useState("");
  const [lease1, setLease1] = useState("");
  const [lease2, setLease2] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [parkingSinglePrice, setParkingSinglePrice] = useState("");
  const [parkingTandemPrice, setParkingTandemPrice] = useState("");
  const [parkingType, setParkingType] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  // const [buildingFeaturesTrue, setBuildingFeaturesTrue] = useState(false);
  // const [apartmentFeaturesTrue, setApartmentFeaturesTrue] = useState(false);
  const buildingFeatureData = [
    "Gated Entry",
    "Fitness Center",
    "Lounge",
    "No Smoking",
    "Wheelchair Accessible",
    "Elevator",
    "Swimming Pool",
    "Sauna",
    "Parking",
    "EV Charging",
    "Rooftop",
  ];

  const apartmentFeatureData = [
    "Furnished",
    "Dishwasher",
    "Fireplace",
    "Loft",
    "Air Conditioning",
    "Heating",
    "Gas Stoves",
  ];

  const [buildingFeatures, setBuildingFeatures] = useState(
    buildingFeatureData.map((label, id) => ({
      id,
      label,
      checked: false,
    }))
  );

  const [apartmentFeatures, setApartmentFeatures] = useState(
    apartmentFeatureData.map((label, id) => ({
      id,
      label,
      checked: false,
    }))
  );

  const handleCheckboxChange = (id, data, setData) => {
    const updatedData = [...data];
    const index = updatedData.findIndex((item) => item.id === id);

    if (index !== -1) {
      updatedData[index].checked = !updatedData[index].checked;
      setData(updatedData);
      console.log(
        `Checkbox "${updatedData[index].label}" (ID: ${id}) is now ${
          updatedData[index].checked ? "checked" : "unchecked"
        }`
      );
    }
  };
  const handleFileSelect = (e) => {
    const selectedFiles = e.target.files;
    setImageFiles(Array.from(selectedFiles));
  };

  // For building features
  const checkedBuildingFeatureLabels = buildingFeatures
    .filter((feature) => feature.checked)
    .map((feature) => feature.label);

  // For apartment features
  const checkedApartmentFeatureLabels = apartmentFeatures
    .filter((feature) => feature.checked)
    .map((feature) => feature.label);

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
    const longLat = await addressToLongLat(address);
    const latLong = [longLat[1], longLat[0]]

    const formData = {
      address,
      addressDesc,
      latLong,
      size,
      bedrooms,
      rent1,
      rent2,
      units,
      baths,
      lease1,
      lease2,
      videoLink,
      parkingSinglePrice,
      parkingTandemPrice,
      parkingType,
      firstName,
      lastName,
      email,
      phone,
      imageUrls,
      checkedBuildingFeatureLabels,
      checkedApartmentFeatureLabels,
    };

    // Write the form data to the Firestore collection

    const collectionRef = collection(firestore, "listings"); // Replace "listings" with your collection name

    try {
      const docRef = await addDoc(collectionRef, formData);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    navigate("/MapPage");
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
    <div className="listing-page-container">
      <Header />
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
              <text className="address">Describe Your Property:</text>
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
                <text className="unit-details">Unit Details</text>
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
                  onChange={(e) => setBedrooms(e.target.value)}
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
                <text className="unit-details-text">Units:</text>
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
                <text className="unit-details">Add a Video Tour </text>
              </div>
              <div className="centered-text">
                <text className="add-photos-text">
                  By showing a video renters are able to see exactly what the
                  apartment looks like!
                </text>
              </div>
              <div className="centered-text">
                <button className="upload-button">Upload</button>
              </div>
              <div className="centered-text">
                <text className="add-photos-text">
                  If your video is on a 3rd party link (ex. Youtube), add the
                  link here:
                </text>
              </div>

              <div className="centered-text">
                <input
                  className="video-bar"
                  type="video"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
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
                <text className="unit-details" style={{ marginTop: "12px" }}>
                  Add Photos
                </text>
              </div>
              <div className="centered-text">
                <text className="add-photos-text">
                  Remember to choose photos that showcase all important aspects
                  of the home!
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
                  <label htmlFor="file-upload" className="custom-file-label">
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
            <div className="content-container" style={{ padding: "20px" }}>
              <div className="centered-text">
                <text className="unit-details">Building Features</text>
              </div>
              <div
                className="left-aligned-content"
                style={{ paddingLeft: "50px" }}
              >
                {buildingFeatures.map((data) => (
                  <CheckBox
                    key={data.id}
                    label={data.label}
                    checked={data.checked}
                    onChange={() =>
                      handleCheckboxChange(
                        data.id,
                        buildingFeatures,
                        setBuildingFeatures
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </BoxTemplate>
          <BoxTemplate>
            <div className="content-container" style={{ padding: "30px" }}>
              <div className="centered-text">
                <text className="unit-details">Apartment Features</text>
              </div>
              <div
                className="left-aligned-content"
                style={{ paddingLeft: "50px" }}
              >
                {apartmentFeatures.map((data) => (
                  <CheckBox
                    key={data.id}
                    label={data.label}
                    checked={data.checked}
                    onChange={() =>
                      handleCheckboxChange(
                        data.id,
                        apartmentFeatures,
                        setApartmentFeatures
                      )
                    }
                  />
                ))}
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
                style={{ marginTop: "30px" }}
              >
                <text className="unit-details-text">Single Price:</text>

                <input
                  className="unit-details-input"
                  type="price"
                  value={parkingSinglePrice}
                  onChange={(e) => setParkingSinglePrice(e.target.value)}
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
                  onChange={(e) => setParkingTandemPrice(e.target.value)}
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
                  onChange={(e) => setParkingType(e.target.value)}
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
                <text className="unit-details-text">First Name:</text>

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
                  onChange={(e) => setFirstName(e.target.value)}
                />

                <input
                  className="unit-details-input"
                  style={{
                    marginLeft: "40px",
                    width: "266.098px",
                  }}
                  type="name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="left-aligned-text" style={{ marginTop: "15px" }}>
                <text className="unit-details-text">Email:</text>

                <text
                  className="unit-details-text"
                  style={{ marginLeft: "500px" }}
                >
                  Phone Number:
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              className="upload-button"
              style={{ marginBottom: "50px" }}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
