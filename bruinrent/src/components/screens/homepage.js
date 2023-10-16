import React, { useState, useEffect } from "react";
import "./homepage.css"; // Import a separate CSS file for component-specific styles
import Waitlist from "./waitlist.js";
import { collection, getDocs } from "firebase/firestore";
import apart1 from "../../assets/apart_1.png";
import apart2 from "../../assets/apart_2.png";
import apart3 from "../../assets/apart_3.png";
import circle from "../../assets/blue_circle.png";
import { Link } from "react-router-dom";
import ListingPage from "./ListingPage.js";
import AddressBlock from "./AddressBlock.js";
import { app, firestore } from "../../firebase.js";
import Header from "../Header.jsx";

const Homepage = () => {
  // const handleWaitlistClick = () => {
  //     // window.location.href = "/Waitlist";
  // };
  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Fetch data from Firestore and set it in the state
    const fetchListings = async () => {
      const listingsRef = collection(firestore, "listings");
      const snapshot = await getDocs(listingsRef);
      const listingsData = snapshot.docs.map((doc) => ({
        id: doc.id, // Include the document ID as 'id'
        ...doc.data(), // Include other data from the document
      }));
      setListings(listingsData);
    };

    fetchListings();
  }, []);

  console.log("Properties:", listings); // Check if properties data is available
  return (
    <div className="homepage-MAIN-container">
      <div className="homepage-boxtop">
        <Header />
        <div className="homepage-bigbox">
          <h1 className="homepage-title">Housing Made Easy For Bruins.</h1>
          <div className="homepage-white-container">
            <div className="homepage-rangeline">
              <p className="homepage-text">Bedrooms:</p>
              <button className="homepage-button">
                <div className="button-content"></div>
                <div className="button-text">1</div>
              </button>
              <p className="homepage-text">Price Range:</p>
              <button className="homepage-button">Button2</button>
              <p className="homepage-to">to</p>
              <button className="homepage-button">Button2</button>
            </div>

            <div className="homepage-button-container">
              <Link to="MapPage">
                <button className="homepage-button-search">
                  Start Your Search
                </button>
              </Link>

              <p className="homepage-button-explore">Explore All Apartments</p>
            </div>
          </div>

          {/* <Link to="/Waitlist"> // waitlist button removed!
                        <button className="homepage-button3">
                            <h1 className="homepage-button3-text">
                                Join the Waitlist
                            </h1>
                        </button>
                    </Link> */}
        </div>
      </div>
      <div className="homepage-boxbot">
        <h3 className="homepage-populartext">Popular Apartments Near You:</h3>
        <div className="address-block">
          {listings.slice(0, 6).map((listing, index) => (
            <Link to={`/apartment/${listing.id}`} key={index}>
              <AddressBlock
                address={listing.address}
                s
                bedrooms={listing.bedrooms}
                bathroom={listing.bathroom}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
