import React from 'react';
import './homepage.css'; // Import a separate CSS file for component-specific styles
import apart1 from '../../assets/apart_1.png';
import apart2 from '../../assets/apart_2.png';
import apart3 from '../../assets/apart_3.png';
import logo from '../../assets/logo_white.png';
import circle from '../../assets/blue_circle.png';

const Homepage = () => {
  return (
<div className="homepage-container">
  <div className="homepage-boxtop">
    <div className="homepage-content">
      <h2 className="homepage-header">BruinRent</h2>
      <h1 className="homepage-title">Housing Made Easy For Bruins.</h1>
      <button className="homepage-button1">List With Us</button>
      <button className="homepage-button2">Sign In</button>
      <button className="homepage-button3">
        <span className="button3-text">Look for an Apartment</span>
      </button>
      <img className="homepage-logo" src={logo} alt="Bruin Rent Logo" />
    </div>
  </div>
  <div className="homepage-boxbot">
    <h3 className="homepage-populartext">Popular Apartments Near You:</h3>
    <div className="homepage-image-container">
      <div className="homepage-image-item">
        <img className="homepage-image" src={apart1} alt="Apartment 1" />
        <p className="homepage-image-detail1">123 Main St</p>
        <p className="homepage-image-detail2">3 bed | 2 bath</p>
        <img className="circle-image" src={circle} alt="Circle" />
      </div>
      <div className="homepage-image-item">
        <img className="homepage-image" src={apart2} alt="Apartment 2" />
        <p className="homepage-image-detail1">456 Elm St</p>
        <p className="homepage-image-detail2">3 bed | 2 bath</p>
      </div>
      <div className="homepage-image-item">
        <img className="homepage-image" src={apart3} alt="Apartment 3" />
        <p className="homepage-image-detail1">789 Oak St</p>
        <p className="homepage-image-detail2">3 bed | 2 bath</p>
      </div>
    </div>
  </div>
</div>
  );
}

export default Homepage;
