import React, { useState, useEffect } from "react";
import "./Apartment.css"; // Import the CSS file for component-specific styles
import logo from "../../assets/logo_white.png"; // Import your logo image
import apart1 from "../../assets/apart_1.png";
import apart2 from "../../assets/apart_2.png";
import BoxTemplate from "./ResizableBox.js";
import Map from "./Map.js";
import { Link } from "react-router-dom";
import { Tooltip } from 'react-tooltip'
import ReviewSumPart from "../reviewSummaryPart.jsx";
import addressToLongLat from "../addressToLongLat.js"
import GoogleMap from "../GoogleMap.js";

// firebase stuff
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { app, firestore } from "../../firebase.js"; 
import { useParams } from "react-router-dom";

let markers = [
  { lat: 51.505, lng: -0.09, text: "Marker 1" },
  { lat: 51.805, lng: -0.19, text: "Marker 2" },
  //Add more markers as needed
];

const ApartmentPage = () => {
  // Get the document ID from the URL parameter
  const [markers, setMarkers] = useState([{ lat: 51.505, lng: -0.09, text: "Marker 1" },{ lat: 51.805, lng: -0.19, text: "Marker 2" },]);
  const { id } = useParams();
  const [imageFiles, setImageFiles] = useState([]);
  const [latLong, setLatLong] = useState([]);
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



    fetchDataFromFirebase()
    
 }, [id]); // Include the ID in the dependency array to re-fetch data when the ID changes


 //Temporary, should NOT be calling API to get latlong, should be created when listing is made
 useEffect(() => {
  if (apartmentData.address) {
      addressToLongLat(apartmentData.address).then((result) => {
        console.log(`Result: ${result[0]}`)
          setLatLong([result[1], result[0]])
          console.log(latLong)
      });
      console.log(latLong[0] + " || "+ latLong[1])
      // 
  }
}, [apartmentData.address]);

useEffect(() => {
  console.log("latlong updated, latlong: " + latLong);
  if (latLong.length === 2) {
    setMarkers([{ lat: 51.505, lng: -0.09, popupContent: "Marker 1" },{ lat: latLong[0], lng: latLong[1], text: apartmentData.address }]);
  }
}, [latLong]);

 function sendEmail(recipient) {
  const emailLink = `mailto:${recipient}`;
  window.location.href = emailLink;
}
// Note: Not sure about the access/current backend state of:
// Reviews (compiled ratings, individual review info, etc) 
// Note: Headers inside or outside boxes?
  return (
    <div className="apartment-homepage-container">
      
      {/* Images Group at the top of Apartment Page */}

      {/* NOTE: Probably want to add aspect ratio when rescaling */}
      <div className="image-group">
        <div className="individual-img-container">
          <img src={apart2} alt="Large Scenic View" className="big-image" />
        </div>

        <div className="small-image-container">
          <div className="individual-small-img-container">
            <img src={apart1} alt="Small 1" />
          </div>
          <div className="individual-small-img-container">
            <img src={apart1} alt="Small 2" className="filtered-image"/>
            <button className="show-all-button">Show All Photos</button>
          </div>
            
        </div>
      </div>


      {/* COLUMNED PAGE */}
      <div className="columned-page">
        {/* Left column */}
        <div className="main-apartment-column">
          {/* Listing Header */}
          <div className="listing-header">
            <p className="header-subtext"> 
            Rent: {apartmentData.rent1} - {apartmentData.rent2}
            </p>
            <div className="big-Header">{apartmentData.address}</div>
            <div className="header-subtext" >
              <span className="header-subtext"style={{fontSize: '1.1rem'}}>Los Angeles, CA 90024   </span> 
              <span className="header-subtext" style={{fontSize: '1.1rem' ,paddingLeft: '0.5rem',fontStyle:'italic'}}>  {apartmentData.bedrooms} bed | {apartmentData.baths} bath | {apartmentData.size} sqft</span>
            </div>

            <div className="about-me-text">
              <p>
              {apartmentData.addressDesc}
              </p>
              {/* <p>{apartmentData.firstName} {apartmentData.lastName}</p>

              <p>Lease: {apartmentData.lease1} - {apartmentData.lease2}</p>
              <p>Units: </p> */}
            </div>
          </div>
          
          

        </div>

      
{/* CONTACT COLUMN */}
        <div className="smaller-column">
          <div className="contact-box">
            <div className="contact-head">Contact This Property</div>
            <button className="blue-contact-button">Request Tour</button>
           
              <button className="blue-contact-button" onClick={() => sendEmail(apartmentData.email)}>Send Message</button>

            <div className="phone-number">{apartmentData.phone}</div>
          </div>
        </div>
      </div>
{/* SECOND COLUMN SET*/}
      
  <div className="columned-page">
        <div className="smaller-column">
          <div className="header">Property Details</div>
          <BoxTemplate>
            <div className="content-container">
                <div className="main-features-header">
                  Main Features
                  <ul className="main-features-list">
                    <li>Bath: {apartmentData.baths} </li>
                    <li>Bedrooms: {apartmentData.bedrooms} </li>
                  </ul>
                </div>

                <div className="main-features-header">
                  Building Features
                  <ul className="main-features-list">
                  {apartmentData.checkedBuildingFeatureLabels.map((label, index) => (
                    <li key={index}>{label}</li>
                  ))}
                  </ul>
                </div>

                <div className="main-features-header">
                  Apartment Features
                  <ul className="main-features-list">
                  {apartmentData.checkedApartmentFeatureLabels.map((label, index) => (
                    <li key={index}>{label}</li>
                  ))}
                </ul>

              </div> 
            </div>
          </BoxTemplate>
        </div>

        <div className="smaller-column">
        {/* Utilities */}
        <div className="header">Utilities</div>
          <BoxTemplate>
            <div className="content-container">
              
                <ul className="main-features-list">
                  <li>Trash</li>
                  <li>Water</li>
                  <li>Electricity</li>
                </ul>
              </div>
          </BoxTemplate>

{/* Parking */}
          <div className="header">Parking</div>
          <BoxTemplate>
            <div className="content-container">
              <div className="main-features">
                <div className="main-features-header">
                Parking type: {apartmentData.parkingType}
                <ul className="main-features-list">
                  <li>Single Price: {apartmentData.parkingSinglePrice}</li>
                  <li>Tandem Price: {apartmentData.parkingTandemPrice}</li>
                </ul>
                </div>
                
              </div> 

              <div className="main-features">
                <div className="main-features-header">
                  Surface Lot
                  <ul className="main-features-list">
                    <li>Single</li>
                  </ul>
                </div>
                
              </div> 
            </div>
          </BoxTemplate>

        </div>
      </div>
      


          

          <div className="review-num-word" style={{paddingBottom:'1rem'}}>
            <div className="circle" style={{width:'3.5rem', height:'3.5rem'}}>
              <div className="review-num" style={{fontSize:'1.5rem'}}>4.2</div>  
            </div>
            <div className="review-header">3 Reviews</div>
          </div>
          <BoxTemplate>
            <div className="content-container">
              
              
              <div className="reviews-container">
                <ReviewSumPart rating={"4.5"} label={"Value"} tooltip={"Overall value and worth of the unit for its price, with 1 having very low value and 5 being very valuable"}/>
                <ReviewSumPart rating={"3"} label={"Noise"} tooltip={"Noise level of the unit, with 1 being very noisy and 5 being very quiet"}/>
                <ReviewSumPart rating={"4.3"} label={"Landlord"} tooltip={"Overall rating for the landlord or building manager, with 1 being very difficult or unhelpful and 5 being very helpful"}/>
                <ReviewSumPart rating={"4.2"} label={"Cleanliness"} tooltip={"Overall cleanliness of the unit, with 1 being very dirty and 5 being very clean"}/>
                <ReviewSumPart rating={"3.0"} label={"Social"} tooltip={"Social aspect of the unit, with 1 being very private and 5 being very social"}/>
                <ReviewSumPart rating={"3.0"} label={"Location"} tooltip={"Rating for the location of the unit relative to UCLA and Westwood Village, with 1 being a very poor location and 5 being a good location"}/>
              </div>

              <div className="date">Jan. 29, 2021</div>
              <div className="review-text">
                <p>
                  General: Overall value and worth of the unit for its price, with 1 having very low value and 5 being very valuable
                </p>
              </div>

              <div className="date">Jan. 01, 2023</div>
              <div className="review-text">
                <p>
                Lorem ipsum dolor sit amet consectetur adipiscing elit nibh augue tortor, est mollis non dui bibendum imperdiet 
                urna convallis magna sodales, vitae facilisis dapibus fermentum hendrerit vulputate sed
                </p>
              </div>


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
                  {/* <Map markers={markers} /> */}
              </div>
              <div className="main-features">
                <div className="main-features-header">
                  Transportation
                    <div className="left-right-display"> 
                      <span className="transport-left">Westwood Target</span> 
                      <span className="transport-right">Walk: 10 min</span>
                    </div>
                    <div className="left-right-display"> 
                      <span className="transport-left">Bruin Plaza</span> 
                      <span className="transport-right">Walk: 10 min</span>
                    </div>
                    <div className="left-right-display"> 
                      <span className="transport-left">De Neve Gardenia</span> 
                      <span className="transport-right">Walk: 10 min</span>
                    </div>
                </div>
                
              </div> 

            </div>
          </BoxTemplate>

          <BoxTemplate>
            <div className="content-container">
              <div className="header"> Google Map</div>
                    <GoogleMap markers={markers}/>
            </div>
          </BoxTemplate>

          <BoxTemplate>
            <div className="content-container">
              <div className="header">Comparable Apartments</div>

            </div>
          </BoxTemplate>
      
      
    </div>
  );
};

export default ApartmentPage;
