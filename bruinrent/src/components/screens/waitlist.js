import React from 'react';
import logo from '../../assets/BruinRentLogo.png';
import './homepage.css'; // Import a separate CSS file for component-specific styles
import instagram1 from '../../assets/Instagram.png';
import instagram2 from '../../assets/Instagram2.png';

const Waitlist = () => {
  return (
    <div className="waitlist-container">
      <div className="waitlist-content">
        <h2 className="waitlist-header">BruinRent</h2>
        <h1 className="waitlist-title">Housing Made Easy For Bruins.</h1>
        <p className="waitlist-italics">Coming Soon</p>
        <button className="waitlist-waitlist">Join the Waitlist</button>
        <img className="waitlist-logo" src={logo} alt="Bruin Rent Logo" />
        <button className="waitlist-instagram">
            <img className="waitlist-instagram1" src={instagram1} alt="ig1" />
            <img className="waitlist-instagram2" src={instagram2} alt="ig1" />
        </button>
      </div>
    </div>
  );
}

export default Waitlist;
