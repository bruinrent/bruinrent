import React, { useState, useEffect } from "react";
import "./Apartment.css"; // Import the CSS file for component-specific styles
import logo from "../../assets/logo_white.png"; // Import your logo image
import apart1 from "../../assets/apart_1.png";
import apart2 from "../../assets/apart_2.png";
import BoxTemplate from "./ResizableBox.js";
import Map from "./Map.js";
import { Link } from "react-router-dom";

// firebase stuff
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { app, firestore } from "../../firebase.js"; 
import { useParams } from "react-router-dom";

const markers = [
  { lat: 51.505, lng: -0.09, popupContent: "Marker 1" },
  //Add more markers as needed
];

const ApartmentPage = () => {
  // Get the document ID from the URL parameter
  const { id } = useParams();
  const [imageFiles, setImageFiles] = useState([]);
  const [apartmentData, setApartmentData] = useState({
    address: "",
    addressDesc: "",
    size: "",
    bedrooms: "",
    rent1: "",
    rent2: "",
    units: "",
    baths: "",
    lease1: "",
    lease2: "",
    videoLink: "",
    parkingSinglePrice: "",
    parkingTandemPrice: "",
    parkingType: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    checkedApartmentFeatureLabels: [],
    checkedBuildingFeatureLabels: [],
    imageUrls: [],
  });
  
  useEffect(() => {
    // Function to fetch apartment data from Firebase and update state
    const fetchDataFromFirebase = async () => {
       try {
          // Assuming you have a reference to the document in Firestore
          const apartmentDocRef = doc(firestore, "listings", id);

          // Fetch the data from Firestore
          const docSnapshot = await getDoc(apartmentDocRef);

          if (docSnapshot.exists()) {
             const data = docSnapshot.data();
             // Update your component state with the fetched data
             setApartmentData(data);
          } else {
             console.error("Document doesn't exist:");
          }
       } catch (error) {
          console.error("Error fetching data from Firebase:", error);
       }
    };

    fetchDataFromFirebase();
 }, [id]); // Include the ID in the dependency array to re-fetch data when the ID changes

  const handleFileSelect = (e) => {
    const selectedFiles = e.target.files;
    setImageFiles(Array.from(selectedFiles));
  };

  // Function to handle form submission
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
  }

  return (
    <div className="homepage-container">
      <div className="homepage-boxtop">
        <div className="homepage-content">
          <h2 className="homepage-header">BruinRent</h2>
          <Link to="/Construction">
            <button className="homepage-button1">List With Us</button>
          </Link>
          <Link to="/Construction">
            <button className="homepage-button2">Sign In</button>
          </Link>
          <img className="homepage-logo" src={logo} alt="Bruin Rent Logo" />
        </div>
      </div>

      {/* Images Group at the top of Apartment Page */}
      <div className="image-group">
        <div>
          <img src={apart2} alt="Large Scenic View" className="big-image" />
        </div>
        <div className="small-images">
          <div className="small-image-container">
            <img src={apart1} alt="Small 1" />
            <img src={apart1} alt="Small 2" className="filtered-image"/>
            <button className="show-all-button">Show All Photos</button>
          </div>
        </div>
      </div>

      {/* Big Address */}
      <div className="big-Header">{apartmentData.address}</div>
      <div className="about-me-text">
        <p>
        {apartmentData.addressDesc}
        </p>
        <p>{apartmentData.firstName} {apartmentData.lastName}</p>
        <p>Rent: {apartmentData.rent1} - {apartmentData.rent2}</p>
        <p>Lease: {apartmentData.lease1} - {apartmentData.lease2}</p>
        <p>Size: {apartmentData.size}</p>
        <p>Units: </p>
      </div>

      <div className="contact-box">
        <div className="contact-head">Contact This Property</div>
        <button className="blue-contact-button">Request Tour</button>
        <button className="blue-contact-button">{apartmentData.email}</button>
        <div className="phone-number">{apartmentData.phone}</div>
      </div>


      <BoxTemplate>
        <div className="content-container">
          <div className="header">Property Details</div>

          {/* <div className="main-features"> */}
            <div className="main-features-header">
            Main Features
            </div>
            <div className="main-features-list">
              Bath: {apartmentData.baths} <br/>
              Bedrooms: {apartmentData.bedrooms} 
            </div>
          {/* </div> */}

          {/* <div className="main-features"> */}
            <div className="main-features-header">Building Features</div>
            <div className="main-features-list">
            {apartmentData.checkedBuildingFeatureLabels.map((label, index) => (
              <p key={index}>{label}</p>
            ))}
            </div>
          {/* </div>  */}

          {/* <div className="main-features"> */}
            <div className="main-features-header">
            Apartment Features
            </div>
            <div className="main-features-list">
            {apartmentData.checkedApartmentFeatureLabels.map((label, index) => (
              <p key={index}>{label}</p>
            ))}
            {/* </div> */}
          </div> 
        </div>
      </BoxTemplate>

      <BoxTemplate>
        <div className="content-container">
          <div className="header">Utilities</div>
          <div className="main-features-list">
            Trash   <br/>
            Water <br/>
            Electricity
          </div>
        </div>
      </BoxTemplate>

      <BoxTemplate>
        <div className="content-container">
          <div className="header">Parking</div>
          <div className="main-features">
            <div className="main-features-header">
            Parking type: {apartmentData.parkingType}
            </div>
            <div className="main-features-list">
            Single Price: {apartmentData.parkingSinglePrice} <br/>
            Tandem Price: {apartmentData.parkingTandemPrice}
            </div>
          </div> 

          <div className="main-features">
            <div className="main-features-header">
            Surface Lot
            </div>
            <div className="main-features-list">
            Single 
            </div>
          </div> 
        </div>
      </BoxTemplate>

      <BoxTemplate>
        <div className="content-container">
          <div className="header">Reviews</div>
          <div className="main-features-header">Overall: 4.2</div>
          <div className="reviews-container">
            <div className="review-pair">
              <div className="review-word">Value: 4.2</div>
              <div className="review-word">Social: 4.0</div>
            </div>
            <div className="review-pair">
              <div className="review-word">Noise: 3.0</div>
              <div className="review-word">Landlord: 3.0</div>
            </div>
            <div className="review-pair">
              <div className="review-word">Cleanliness: 3.0</div>
              <div className="review-word">Location: 3.0</div>
            </div>
            {/* Add more review pairs as needed */}
          </div>
          <div className="review-text">
            <p>
              General: Overall value and worth of the unit for its price, with 1 having very low value and 5 being very valuable
            </p>
          </div>
          {/*Review #1*/}
          <div className="date">Jan. 01, 2023</div>
          <div className="review-text">
            <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit nibh augue tortor, est mollis non dui bibendum imperdiet 
            urna convallis magna sodales, vitae facilisis dapibus fermentum hendrerit vulputate sed
            </p>
          </div>

          {/*Review #2*/}
          <div className="date">Dec. 10, 2022</div>
          <div className="review-text">
            <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit nibh augue tortor, est mollis non dui bibendum imperdiet 
            urna convallis magna sodales, vitae facilisis dapibus fermentum hendrerit vulputate sed
            </p>
          </div>
        </div>
      </BoxTemplate>

      <BoxTemplate>
        <div className="content-container">
          <div className="header">Location</div>
          <div className="map">
              <Map markers={markers} />
          </div>
          <div className="main-features">
            <div className="main-features-header">
            Transportation
            </div>
            <div className="main-features-list">
            Westwood Target  --  Walk: 10 min <br/>
            Bruin Plaza      --  Walk: 10 min <br/>
            De Neve Gardenia --  Walk: 10 min 
            </div>
          </div> 

        </div>
      </BoxTemplate>

      <BoxTemplate>
        <div className="content-container">
          <div className="header">Comparable Apartments</div>
          {/* Import the similar apartments  */}
        </div>
      </BoxTemplate>
      
    </div>
  );
};

export default ApartmentPage;
