import "../styles/Header.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo_white.png";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const Header = () => {
  const handleSignInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
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
          <button className="header-button" onClick={handleSignInWithGoogle}>Sign In</button>
        <Link
          target="_blank"
          to="https://docs.google.com/forms/d/e/1FAIpQLSfHY7fNYDFBbNYr3Xy4caIz7yqNmvDnYfAB9HZlq1aH7vl0Qw/viewform"
        >
          <button className="header-button">Feedback</button>
        </Link>
      </div>
    </div>
  );
};
export default Header;
