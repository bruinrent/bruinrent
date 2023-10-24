import React, { useState, useEffect } from "react";
import "./homepage.css"; // Import a separate CSS file for component-specific styles
import { collection, getDocs } from "firebase/firestore";
import apart1 from "../../assets/apart_1.png";
import { Link } from "react-router-dom";
import AddressBlock from "./AddressBlock.js";
import Map from "./Map.js";
import { app, firestore } from "../../firebase.js";
import "leaflet/dist/leaflet.css";
import { list } from "firebase/storage";
import GoogleMap from "../GoogleMap.js"
import Header from "../Header.jsx";

const MapPage = () => {
  const markers = [];

  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Fetch data from the "listings" collection in Firestore
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

  return (
    <div className="map-page-container">
      <Header />

      <div className="tab">
        <div className="tab-content">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              //onChange={onSearch}
            />
            <button>Button 1</button>
            <button>Button 2</button>
          </div>
        </div>
      </div>

      <div className="map-page">
        <div className="map-container">
        <GoogleMap markers = {markers}/>
        </div>
        <div className="address-list">
          {listings.map((listing, index) => (
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

export default MapPage;
