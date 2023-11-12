import "../styles/Header.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo_white.png";
import { useEffect, useState } from "react";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from "../firebase.js";
import { useAuthContext } from "./AuthContext.js";
import { useNavigate } from "react-router-dom";

import { FaBars } from "react-icons/fa/index.esm";

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate(); // Initialize navigate
  const { user } = useAuthContext();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (result) => {
      if (result) {
        const { displayName, email } = result;
        setUserData({ displayName, email });
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const Logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setUserData({});
        setIsLoggedIn(false);
      })
      .catch((error) => {
        // An error happened.
        console.log({ error });
      });
  };

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

  return (
    <div className="header-container">
      <Link to="/" className="header-logo-container">
        <img className="header-logo" src={logo} alt="Bruin Rent Logo" />
      </Link>

      <Link to="/" style={{ textDecoration: "none" }}>
        <h2 className="header-title">BruinRent</h2>
      </Link>

      <div className="header-links">
        <FaBars onClick={() => setDropdownOpen(!isDropdownOpen)} />
      </div>

      {isDropdownOpen && (
        <div className="header-dropdown">
          {user === null ? (
            <button
              className="header-button"
              onClick={handleSignInWithGoogleAndRedirect}
            >
              Leave a Review
            </button>
          ) : (
            <Link to="/ReviewPage">
              <button className="header-button">Leave a Review</button>
            </Link>
          )}
          {user === null ? (
            <button className="header-button" onClick={handleSignInWithGoogle}>
              Sign In
            </button>
          ) : (
            <button className="header-button" onClick={Logout}>
              Logout
            </button>
          )}
          <Link to="/ConstructionPage">
            <button className="header-button">Sign In</button>
          </Link>
          <Link
            target="_blank"
            to="https://docs.google.com/forms/d/e/1FAIpQLSfHY7fNYDFBbNYr3Xy4caIz7yqNmvDnYfAB9HZlq1aH7vl0Qw/viewform"
          >
            <button className="header-button">Feedback</button>
          </Link>
        </div>
      )}
    </div>
  );
};
export default Header;
