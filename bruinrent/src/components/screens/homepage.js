import React, { useState, useEffect } from "react";
import "./homepage.css"; // Import a separate CSS file for component-specific styles
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import AddressBlock from "./AddressBlock.js";
import { app, firestore } from "../../firebase.js";
import Header from "../Header.jsx";
import { useAuthContext } from "../AuthContext.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  // const handleWaitlistClick = () => {
  //     // window.location.href = "/Waitlist";
  // };
  const [listings, setListings] = useState([]);
  const { user } = useAuthContext();
  const navigate = useNavigate();

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

  const handleSignInWithGoogleAndRedirect = () => {
    handleSignInWithGoogle();
    navigate("/ReviewPage");
  };

  const handleSignInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    signInWithPopup(auth, provider)
      .then((result) => {
        // signed-in user info.
        const user = result.user;
        const email = result.user.email;
        const name = result.user.name;

        //FOR TEST PURPOSES
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);

        // connect to users collection.
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid); // 'users' is the Firestore collection

        const userData = {
          email: user.email, // Update the email field
        };

        console.log(userRef);
        console.log(userData);

        setDoc(userRef, userData, { merge: true })
          .then(() => {
            // navigate("/account");
          })
          .catch((error) => {
            console.error("Error writing user data to Firestore: ", error);
          });
      })
      .catch((error) => {
        console.error("Google sign-in error: ", error);
      });
  };

  console.log("Properties:", listings); // Check if properties data is available
  return (
    <div className="homepage-container">
      <Header />
      <div className="homepage-banner">
        <h1 className="homepage-banner-title">Housing Made Easy For Bruins.</h1>
        <div className="homepage-banner-button-container">
          {user === null ? (
            <button
              className="homepage-banner-button"
              onClick={() => {
                handleSignInWithGoogle();
                navigate("/ReviewPage");
              }}
            >
              Leave a Review
            </button>
          ) : (
            <Link to="/ReviewPage">
              <button className="homepage-banner-button">Leave a Review</button>
            </Link>
          )}

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
            {listings.slice(0, 8).map((listing) => (
              <AddressBlock
                url={`/apartment/${listing.id}`}
                address={listing.address}
                s
                bedrooms={listing.bedrooms}
                bathroom={listing.bathroom}
                imageUrl={listing.imageUrls ? listing.imageUrls[0] : null}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
