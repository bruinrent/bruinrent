import React from 'react';
import logo from '../../assets/BruinRentLogo.png';
import './homepagebackup.css'; // Import a separate CSS file for component-specific styles
import instagram1 from '../../assets/Instagram.png';
import instagram2 from '../../assets/Instagram2.png';

const HomepageBackup = () => {
  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <h2 className="homepage-header">BruinRent</h2>
        <h1 className="homepage-title">Housing Made Easy For Bruins.</h1>
        <p className="homepage-italics">Coming Soon</p>
        <button className="homepage-waitlist">Join the Waitlist</button>
        <img className="homepage-logo" src={logo} alt="Bruin Rent Logo" />
        <button className="homepage-instagram">
            <img className="homepage-instagram1" src={instagram1} alt="ig1" />
            <img className="homepage-instagram2" src={instagram2} alt="ig1" />
        </button>
      </div>
    </div>
  );
}

export default HomepageBackup;
