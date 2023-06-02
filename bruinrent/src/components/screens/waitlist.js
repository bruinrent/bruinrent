import React from 'react';
import logo from '../../assets/BruinRentLogo.png';
import './waitlist.css'; // Import a separate CSS file for component-specific styles
import instagram1 from '../../assets/Instagram.png';
import instagram2 from '../../assets/Instagram2.png';
import TextBox from './textbox';

const Waitlist = ( {handleSubmit}) => {
  const handleButtonClick = () => {
    const newWindow = window.open('https://www.instagram.com/bruinrent/', '_blank');
  };

  

  return (
    <div className="waitlist-container">
     <div className="waitlist-content">
        <h2 className="waitlist-header">BruinRent</h2>
        <h1 className="waitlist-title">Launching Soon</h1>
        <p className="waitlist-email">Email:</p>
        <TextBox />
        <button className="waitlist-waitlist" onClick={handleSubmit}>Join the Waitlist</button>
        <img className="waitlist-logo" src={logo} alt="Bruin Rent Logo" />
        {<button className="waitlist-instagram" onClick={handleButtonClick}>
            <img className="waitlist-instagram1" src={instagram1} alt="ig1" />
            <img className="waitlist-instagram2" src={instagram2} alt="ig1" />
  </button>}
        <p className="waitlist-bottom">Housing Made Easy for Bruins</p>
      </div>
    </div>
  );
}

export default Waitlist;
