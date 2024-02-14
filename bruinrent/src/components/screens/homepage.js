import "./homepage.css";

import React, { useState, useEffect } from "react";
import { useSpring, useInView, animated } from "@react-spring/web";
import { useAuthContext } from "../AuthContext.js";
import { useNavigate } from "react-router-dom";
import { firestore } from "../../firebase.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  getDocs,
  query,
  limit,
  orderBy,
} from "firebase/firestore";

import { Link } from "react-router-dom";
import Header from "../Header.jsx";
import AddressBlock from "./AddressBlock.js";
import Footer from "../Footer.jsx";

const Homepage = () => {
  const NUMBER_OF_POP_LISTINGS = 8;
  const [listings, setListings] = useState([]);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [titleRef, titleInView] = useInView();
  const titleSpring = useSpring({
    from: { opacity: 0, height: 0, x: 20 },
    to: {
      opacity: titleInView ? 1 : 0,
      height: titleInView ? 80 : 0,
    },
    config: { mass: 5, tension: 2000, friction: 200, duration: 300 },
  });

  const filterForApartmentsWithRent = (apartmentData) => {
    // Filter for apartments with both rent ranges
    // return apartmentData.rent1 != "" && apartmentData.rent2 != "";
    // Filter for apartments with one rent ranges
    // return apartmentData.rent1;
    // Return all apartments for now
    return true;
  };

  useEffect(() => {
    // Fetch data from Firestore and set it in the state
    const fetchListings = async () => {
      const q = query(
        collection(firestore, "listings"),
        orderBy("reviews"),
        limit(NUMBER_OF_POP_LISTINGS)
      );
      const snapshot = await getDocs(q);
      const listingsData = snapshot.docs.map((doc) => ({
        id: doc.id, // Include the document ID as 'id'
        ...doc.data(), // Include other data from the document
      }));

      setListings(listingsData.filter(filterForApartmentsWithRent));
    };
    fetchListings();
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email;
      const name = user.name;

      // FOR TEST PURPOSES
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);

      // connect to users collection.
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);

      const userData = {
        email: user.email,
      };

      console.log(userRef);
      console.log(userData);

      await setDoc(userRef, userData, { merge: true });

      // If setDoc is successful, you can navigate here.
      // navigate("/account");
    } catch (error) {
      console.error("Error during Google sign-in: ", error);
    }
  };

  return (
    <div className="homepage-container">
      <Header />
      <div className="homepage-banner">
        <animated.h1
          className="homepage-banner-title"
          style={titleSpring}
          ref={titleRef}
        >
          Housing Made Easy For Bruins
        </animated.h1>
        <div className="homepage-banner-button-container">
          <Link to="/ReviewPage">
            <button className="homepage-banner-button">Leave a Review</button>
          </Link>

          <Link to="MapPage">
            <button className="homepage-banner-button">
              Start Your Search
            </button>
          </Link>
        </div>
      </div>
      <div className="homepage-body">
        <div className="homepage-body-listing-container">
          <h2 className="homepage-body-title">Popular Apartments</h2>
          <div className="homepage-body-listings">
            {listings.length != null &&
              listings.map((listing) => (
                <AddressBlock
                  url={`/apartment/${listing.id}`}
                  address={listing.address}
                  s
                  bedrooms={listing.bedrooms}
                  bathroom={listing.baths}
                  imageUrl={listing.imageUrls ? listing.imageUrls[0] : null}
                  className="homepage-body-listing-item"
                />
              ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Homepage;
