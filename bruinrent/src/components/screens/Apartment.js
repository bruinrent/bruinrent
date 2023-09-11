import React from "react";
import "./Apartment.css"; // Import the CSS file for component-specific styles
import logo from "../../assets/logo_white.png"; // Import your logo image
import apart1 from "../../assets/apart_1.png";
import apart2 from "../../assets/apart_2.png";
import { Link } from "react-router-dom";

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

      {/* New content for the Apartment Page */}
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

      
    </div>
  );
};

export default ApartmentPage;
