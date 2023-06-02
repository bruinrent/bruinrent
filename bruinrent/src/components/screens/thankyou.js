import React from 'react';
import './thankyou.css';
import './waitlist.css'
import logo from '../../assets/BruinRentLogo.png';


const ThankYou = () => {
    return(

        <div className="waitlist-container">
            <div className="waitlist-content">
                <h2 className="waitlist-header">BruinRent</h2>
                <h1 className="waitlist-title">Thank you!</h1>
        
                <img className="waitlist-logo" src={logo} alt="Bruin Rent Logo" />
                <p className="thankyou-message">You will receive an email when BruinRent launches!</p>
        {/*<button className="waitlist-instagram">
            <img className="waitlist-instagram1" src={instagram1} alt="ig1" />
            <img className="waitlist-instagram2" src={instagram2} alt="ig1" />
  </button>*/}
        <p className="waitlist-bottom">Housing Made Easy for Bruins</p>
      </div>
    </div>

    );

}

export default ThankYou;
