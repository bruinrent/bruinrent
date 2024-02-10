import "./ListingPage.css";
import "./MapPage.css";

import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { firestore } from "../../firebase.js";

import House from "../../assets/Map.png";
import Sidebar from "./Sidebar.js";
import CheckBox from "./Checkbox.js";
import Header from "../Header.jsx";
import addressToLongLat from "../addressToLongLat.js";

const UnitDetailsSelectors = ({ unitIdx, units, setUnits }) => {
  return (
    <div className="unit-details-selectors">
      <div className="unit-details-category">
        <text className="unit-details-text">Size:</text>
        <div>
          <input
            className="unit-details-input"
            type="size"
            value={units[unitIdx].size}
            onChange={(e) => {
              const unitsCopy = units.slice();
              unitsCopy[unitIdx] = {
                ...unitsCopy[unitIdx],
                size: e.target.value,
              };
              setUnits(unitsCopy);
            }}
          />
          <text className="grey-text">sqft</text>
        </div>
      </div>
      <div className="unit-details-category">
        <text className="unit-details-text">Bedrooms:</text>

        <input
          className="unit-details-input"
          type="bedrooms"
          value={units[unitIdx].bedrooms}
          onChange={(e) => {
            const unitsCopy = units.slice();
            unitsCopy[unitIdx] = {
              ...unitsCopy[unitIdx],
              bedrooms: e.target.value,
            };
            setUnits(unitsCopy);
          }}
        />
      </div>
      <div className="unit-details-category">
        <text className="unit-details-text">Rent:</text>

        <div className="unit-details-range-input">
          <input
            className="unit-details-input"
            type="rent"
            placeholder="Min Rent"
            value={units[unitIdx].rent1}
            onChange={(e) => {
              const unitsCopy = units.slice();
              unitsCopy[unitIdx] = {
                ...unitsCopy[unitIdx],
                rent1: e.target.value,
              };
              setUnits(unitsCopy);
            }}
          />

          <text className="unit-details-text">to</text>
          <input
            className="unit-details-input"
            type="rent"
            placeholder="Max Rent"
            value={units[unitIdx].rent2}
            onChange={(e) => {
              const unitsCopy = units.slice();
              unitsCopy[unitIdx] = {
                ...unitsCopy[unitIdx],
                rent2: e.target.value,
              };
              setUnits(unitsCopy);
            }}
          />
        </div>
      </div>
      <div className="unit-details-category">
        <text className="unit-details-text">Baths:</text>

        <input
          className="unit-details-input"
          type="baths"
          value={units[unitIdx].baths}
          onChange={(e) => {
            const unitsCopy = units.slice();
            unitsCopy[unitIdx] = {
              ...unitsCopy[unitIdx],
              baths: e.target.value,
            };
            setUnits(unitsCopy);
          }}
        />
      </div>
      <div className="unit-details-category">
        <text className="unit-details-text">Lease:</text>
        <div className="unit-details-range-input">
          <input
            className="unit-details-input"
            type="lease"
            value={units[unitIdx].lease1}
            placeholder="Min Months"
            onChange={(e) => {
              const unitsCopy = units.slice();
              unitsCopy[unitIdx] = {
                ...unitsCopy[unitIdx],
                lease1: e.target.value,
              };
              setUnits(unitsCopy);
            }}
          />

          <text className="unit-details-text">to</text>
          <input
            className="unit-details-input"
            type="lease"
            value={units[unitIdx].lease2}
            placeholder="Max Months"
            onChange={(e) => {
              const unitsCopy = units.slice();
              unitsCopy[unitIdx] = {
                ...unitsCopy[unitIdx],
                lease2: e.target.value,
              };
              setUnits(unitsCopy);
            }}
          />
        </div>
      </div>
    </div>
  );
};

const ListingPage = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [latLong, setLatLong] = useState("");
  const [addressDesc, setAddressDesc] = useState("");
  // Unit Details
  const defaultUnitInfoObj = {
    rent1: "",
    rent2: "",
    lease1: "",
    lease2: "",
    bedrooms: "",
    baths: "",
    size: "",
  };
  const [units, setUnits] = useState([defaultUnitInfoObj]);
  // Apartment Details
  const [videoLink, setVideoLink] = useState("");
  const [parkingSinglePrice, setParkingSinglePrice] = useState("");
  const [parkingTandemPrice, setParkingTandemPrice] = useState("");
  const [parkingType, setParkingType] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [coverImageFiles, setCoverImageFiles] = useState([]);
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
    "Laundry",
  ];

  const apartmentFeatureData = [
    "Furnished",
    "Dishwasher",
    "Fireplace",
    "Loft",
    "Air Conditioning",
    "Heating",
    "Gas Stoves",
    "Laundry - In Unit",
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
  const handleCoverFileSelect = (e) => {
    const selectedFiles = e.target.files;
    setCoverImageFiles(Array.from(selectedFiles));
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
    // Cover image will be first file in imageUrls
    for (const coverImageFile of coverImageFiles) {
      const coverImageRef = ref(storage, "images/" + coverImageFile.name);

      try {
        // Upload the image file
        await uploadBytes(coverImageRef, coverImageFile);

        // Get the download URL for the uploaded image
        const coverImageUrl = await getDownloadURL(coverImageRef);

        // Add the image URL to the array
        imageUrls.push(coverImageUrl);
      } catch (error) {
        console.error("Error uploading cover image: ", error);
      }
    }
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
    setLatLong([longLat[1], longLat[0]]);

    // const titleAddress = address.replace(/\b\w+/g,
    // (s) => {
    //   return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
    // })

    // await setAddress(titleAddress);
    // console.log(address)
    // const address = titleAddress;

    // Calculating apartment page display info based on listed units
    const rent1 = units.reduce(
      (currMin, unitInfo) => Math.min(currMin, unitInfo.rent1),
      Number.POSITIVE_INFINITY
    );
    const rent2 = units.reduce(
      (currMax, unitInfo) => Math.max(currMax, unitInfo.rent2),
      Number.NEGATIVE_INFINITY
    );
    const bedrooms = units.reduce(
      (currMin, unitInfo) => Math.min(currMin, unitInfo.bedrooms),
      Number.POSITIVE_INFINITY
    );
    const baths = units.reduce(
      (currMin, unitInfo) => Math.min(currMin, unitInfo.baths),
      Number.POSITIVE_INFINITY
    );
    const size = units.reduce(
      (currMin, unitInfo) => Math.min(currMin, unitInfo.size),
      Number.POSITIVE_INFINITY
    );
    const lease1 = units.reduce(
      (currMin, unitInfo) => Math.min(currMin, unitInfo.lease1),
      Number.POSITIVE_INFINITY
    );
    const lease2 = units.reduce(
      (currMax, unitInfo) => Math.max(currMax, unitInfo.lease2),
      Number.NEGATIVE_INFINITY
    );

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

  return (
    <div className="listing-page-container">
      <Header />
      <div>
        <div className="sidebar-container">
          <Sidebar />
        </div>

        <div className="listing-page-body">
          <h2 className="listing-page-content-title">List Your Property</h2>
          <div className="listing-page-basic-details">
            <img
              className="listing-page-basic-details-img"
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
              <textarea
                className="property-text"
                type="addressDesc"
                value={addressDesc}
                onChange={(e) => setAddressDesc(e.target.value)}
                //onChange={onSearch}
              />
            </div>
          </div>
          <div className="listing-page-unit-details">
            <text className="unit-details">Unit Details</text>
            {units.map((unitInfo, idx) => (
              <>
                <text>Unit {idx + 1}</text>
                <UnitDetailsSelectors
                  units={units}
                  setUnits={setUnits}
                  unitIdx={idx}
                />
              </>
            ))}
            <button
              className="upload-button"
              onClick={() => setUnits([...units, defaultUnitInfoObj])}
            >
              Add A Unit
            </button>
          </div>

          {/* <div className="listing-page-unit-videos">
            <text className="unit-details">Add a Video Tour </text>
            <text className="add-attachment-text">
              By showing a video renters are able to see exactly what the
              apartment looks like!
            </text>
            <button className="upload-button">Upload</button>
            <text className="add-attachment-text">
              If your video is on a 3rd party link (ex. Youtube), add the link
              here:
            </text>

            <input
              className="video-bar"
              type="video"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
            />
          </div> */}
          <div className="listing-page-unit-photos">
            <text className="unit-details unit-photos-title">Add Photos</text>
            <text className="add-attachment-text add-photos-text">
              Choose a cover photo that best represents your listing! It will be
              your listing's icon photo and main photo
            </text>
            <img
              style={{
                maxWidth: "15rem",
                maxheight: "10rem",
                objectFit: "contain",
                borderRadius: "30px",
                flexShrink: "0",
              }}
              src={House}
              alt="House"
              className="listing-page-unit-photos-cover"
            />
            <div className="custom-file-input">
              <label htmlFor="file-upload" className="custom-file-label">
                Choose Cover Photo
              </label>
              <input
                type="file"
                id="file-upload"
                className="hidden-file-input"
                accept="image/*"
                onChange={handleCoverFileSelect}
              />
            </div>
            <div className="unit-photos-selected-files">
              <p>Selected Cover Photo:</p>
              <ul>
                {imageFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
            <text className="add-attachment-text add-photos-text">
              Remember to choose photos that showcase all important aspects of
              the home!
            </text>
            <img
              style={{
                maxWidth: "15rem",
                maxheight: "10rem",
                objectFit: "contain",
                borderRadius: "30px",
                flexShrink: "0",
              }}
              src={House}
              alt="House"
            />
            <img
              style={{
                maxWidth: "15rem",
                maxheight: "10rem",
                objectFit: "contain",
                borderRadius: "30px",
                flexShrink: "0",
              }}
              src={House}
              alt="House"
            />
            <img
              style={{
                maxWidth: "15rem",
                maxheight: "10rem",
                objectFit: "contain",
                borderRadius: "30px",
                flexShrink: "0",
              }}
              src={House}
              alt="House"
            />
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
            <div className="unit-photos-selected-files">
              <p>Selected Images:</p>
              <ul>
                {imageFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="listing-page-unit-features">
            <text className="unit-details">Building Features</text>
            <div className="features-selector">
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
          <div className="listing-page-unit-features">
            <text className="unit-details">Apartment Features</text>
            <div className="features-selector">
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
          <div className="listing-page-unit-parking">
            <text className="unit-details unit-parking-title">Parking</text>

            <div className="unit-parking-input">
              <text className="unit-details-text">Single Price:</text>

              <input
                className="unit-details-input"
                type="price"
                value={parkingSinglePrice}
                onChange={(e) => setParkingSinglePrice(e.target.value)}
                //onChange={onSearch}
              />
            </div>

            <div className="unit-parking-input">
              <text className="unit-details-text">Tandem Price:</text>

              <input
                className="unit-details-input"
                type="price"
                value={parkingTandemPrice}
                onChange={(e) => setParkingTandemPrice(e.target.value)}
              />
            </div>

            <div className="unit-parking-input">
              <text className="unit-details-text">Type available:</text>

              <input
                className="unit-details-input"
                type="price"
                value={parkingType}
                onChange={(e) => setParkingType(e.target.value)}
              />
            </div>
          </div>
          <div className="listing-page-unit-contact">
            <text className="unit-details unit-contact-title">Contact</text>

            <div className="unit-contact-input">
              <text className="unit-details-text">First Name:</text>
              <input
                className="unit-details-input unit-contact-input-box"
                type="name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="unit-contact-input">
              <text className="unit-details-text">Last Name:</text>
              <input
                className="unit-details-input unit-contact-input-box"
                type="name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="unit-contact-input">
              <text className="unit-details-text">Email:</text>
              <input
                className="unit-details-input unit-contact-input-box"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="unit-contact-input">
              <text className="unit-details-text">Phone Number:</text>
              <input
                className="unit-details-input unit-contact-input-box"
                type="name"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button className="upload-button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
