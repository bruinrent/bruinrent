import React from "react";
import "./Apartment.css"; // Import the CSS file for component-specific styles
import logo from "../../assets/logo_white.png"; // Import your logo image
import apart1 from "../../assets/apart_1.png";
import apart2 from "../../assets/apart_2.png";
import BoxTemplate from "./ResizableBox.js";
import Map from "./Map.js";
import { Link } from "react-router-dom";

const markers = [
  { lat: 51.505, lng: -0.09, popupContent: "Marker 1" },
  //Add more markers as needed
];

const ApartmentPage = () => {
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
      <div className="big-Header">123 Gayley Ave</div>
      <div className="about-me-text">
        <p>
        Lorem ipsum dolor sit amet consectetur adipiscing elit nibh augue tortor,
        est mollis non dui bibendum imperdiet urna convallis magna sodales, vitae
        facilisis dapibus fermentum hendrerit vulputate sed Lorem ipsum dolor sit
        amet consectetur adipiscing elit nibh augue tortor, est mollis non dui
        bibendum imperdiet urna convallis magna sodales, vitae facilisis dapibus
        fermentum hendrerit vulputate sed
        </p>
        <p>firstName lastName</p>
        <p>Rent: rent1 - rent2</p>
        <p>Lease: least1 - least2</p>
        <p>Deposit: </p>
        <p>Size: </p>
        <p>Units: </p>
      </div>

      <div className="contact-box">
        <div className="contact-head">Contact This Property</div>
        <button className="blue-contact-button">Request Tour</button>
        <button className="blue-contact-button">email</button>
        <div className="phone-number">phoneNumber</div>
      </div>


      <BoxTemplate>
        <div className="content-container">
          <div className="header">Property Details</div>
          <div className="main-features">
            <div className="main-features-header">
            Main Features
            </div>
            <div className="main-features-list">
              Air Conditioning <br/>
              Elevator <br/>
              Pet-Friendly
            </div>
          </div>

          <div className="main-features">
            <div className="main-features-header">
            Building Features
            </div>
            <div className="main-features-list">
            Laundry 
            </div>
          </div> 

          <div className="main-features">
            <div className="main-features-header">
            Apartment Features
            </div>
            <div className="main-features-list">
            Bath <br/>
            Bathroom 
            </div>
          </div> 

          <div className="main-features">
            <div className="main-features-header">
            Amenities
            </div>
            <div className="main-features-list">
            Pet-Friendly <br/>
            Laundry 
            </div>
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
            Garage
            </div>
            <div className="main-features-list">
            Single Price <br/>
            Tandem Price
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
