import React, { useState } from "react";
import logo from "../../assets/BruinRentLogo.png";
import { collection, addDoc } from "firebase/firestore";
import { app, firestore } from "../../firebase";
import "./waitlist.css"; // Import a separate CSS file for component-specific styles
import instagram1 from "../../assets/Instagram.png";
import instagram2 from "../../assets/Instagram2.png";
import TextBox from "./textbox";

const Waitlist = ({ handleSubmit, errorMsg}) => {

    const handleButtonClick = () => {
        const newWindow = window.open(
            "https://www.instagram.com/bruinrent/", "_blank"
        );
    };

    const handleListClick = () => {
        const newWindow = window.open(
            "https://docs.google.com/forms/d/e/1FAIpQLSfJvQnoRMgKmSBZo1EbibEOyjRaB6SdY7V2holC8lklTUiiPg/viewform", "_blank"
        );
    };

    const handleFindClick = () => {
        const newWindow = window.open(
            "https://docs.google.com/spreadsheets/d/1NcXH3NXmE6HIH1IaLa_7JPojTljxyShluVk25HR7TJc/edit#gid=1702217131", "_blank"
        );
    };



    const [email, setEmail] = useState("");
    const handleClick = async () => {

        //console.log("clicked");
        handleSubmit(email);

        handleSubmit();

        try {
            // Create a new document in the "waitlist" collection with the email
            await addDoc(collection(firestore, "waitlist"), { email });
            console.log("Waitlist joined!");
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    return (
        <div className="waitlist-container">
            <div className="waitlist-content">
                <h2 className="waitlist-header">BruinRent</h2>
                <h1 className="waitlist-title">Launching Soon</h1>
                <p className="waitlist-email">Email:</p>

                <TextBox value={email} onChange={handleEmailChange} placeholder="joebruin@gmail.com"/>
                
                <button className="waitlist-waitlist" onClick={handleClick}>Join the Waitlist</button>
                {errorMsg && <p className="waitlist-error">Please enter a valid UCLA email</p>}
                <p className="waitlist-subheading">Need a place for the summer or to list your apartment?</p>

                <button className="waitlist-list" onClick={handleListClick}>List Your Apartment</button>
                <button className="waitlist-find" onClick={handleFindClick}>Find An Apartment</button>
               
                <img className="waitlist-logo" src={logo} alt="Bruin Rent Logo"/>
                
                <button className="waitlist-instagram" onClick={handleButtonClick}>
                    <img className="waitlist-instagram1" src={instagram1} alt="ig1"/>
                    <img className="waitlist-instagram2" src={instagram2} alt="ig1"/>
                </button>
                <p className="waitlist-bottom">Housing Made Easy for Bruins</p>
            </div>
        </div>
    );
};

export default Waitlist;
