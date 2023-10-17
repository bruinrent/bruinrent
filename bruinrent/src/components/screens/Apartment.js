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


 function sendEmail(recipient) {
  const emailLink = `mailto:${recipient}`;
  window.location.href = emailLink;
}
// Note: Not sure about the access/current backend state of:
// Reviews (compiled ratings, individual review info, etc) 
  return (
    <div className="homepage-container">
      
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
              <span className="header-subtext" style={{fontSize: '1.1rem' ,paddingLeft: '0.5rem',fontStyle:'italic'}}>  BED | BATH | Size: {apartmentData.size}</span>
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

{/* Utilities */}
          <BoxTemplate>
            <div className="content-container">
              <div className="header">Utilities
                <ul className="main-features-list">
                  <li>Trash</li>
                  <li>Water</li>
                  <li>Electricity</li>
                </ul>
              </div>
              
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
          

          <BoxTemplate>
            <div className="content-container">
              <div className="review-num-word">
                <div className="circle" style={{width:'3.5rem', height:'3.5rem'}}>
                  <div className="review-num" style={{fontSize:'1.5rem'}}>4.2</div>  
                </div>
                <div className="review-header">Reviews</div>
              </div>
              
              <div className="reviews-container">
                <div className="review-num-word">
                  <div className="circle">
                    <div className="review-num">4.2</div>  
                  </div>
                  <div className="review-word">Value</div>
                </div>
                <div className="review-num-word">
                  <div className="circle">
                    <div className="review-num">4.0</div>  
                  </div>
                  <div className="review-word">Social</div>
                </div>
                <div className="review-num-word">
                  <div className="circle">
                    <div className="review-num">3</div>  
                  </div>
                  <div className="review-word">Noise</div>
                </div>
                <div className="review-num-word">
                  <div className="circle">
                    <div className="review-num">4.3</div>  
                  </div>
                  <div className="review-word">Landlord</div>
                </div>
                <div className="review-num-word">
                  <div className="circle">
                    <div className="review-num">4.2</div>  
                  </div>
                  <div className="review-word">Cleanliness</div>
                </div>
                <div className="review-num-word">
                  <div className="circle">
                    <div className="review-num">3.0</div>  
                  </div>
                  <div className="review-word">Location</div>
                </div>
              </div>
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
                  <Map markers={markers} />
              </div>
              <div className="main-features">
                <div className="main-features-header">
                  Transportation
                  <ul className="main-features-list">
                    <li>Westwood Target  --  Walk: 10 min</li>
                    <li>Bruin Plaza      --  Walk: 10 min</li>
                    <li>De Neve Gardenia --  Walk: 10 min</li> 
                  </ul>
                </div>
                
              </div> 

            </div>
          </BoxTemplate>

          <BoxTemplate>
            <div className="content-container">
              <div className="header">Comparable Apartments</div>

            </div>
          </BoxTemplate>

        </div>

      
        {/* CONTACT COLUMN */}
        <div className="contact-column">
          <div className="contact-box">
            <div className="contact-head">Contact This Property</div>
            <button className="blue-contact-button">Request Tour</button>
           
              <button className="blue-contact-button" onClick={() => sendEmail(apartmentData.email)}>Send Message</button>

            <div className="phone-number">{apartmentData.phone}</div>
          </div>
        </div>
      </div>

      

      

      

      

      
      
    </div>
  );
};

export default ApartmentPage;
