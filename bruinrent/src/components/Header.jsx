import "../styles/Header.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo_white.png";

const Header = () => {
  return (
    <div className="container">
      <Link to="/" className="logo-container">
        <img className="logo" src={logo} alt="Bruin Rent Logo" />
      </Link>

      <Link to="/" style={{ textDecoration: "none" }}>
        <h2 className="title">BruinRent</h2>
      </Link>

      <div className="links">
        <Link to="/ListingPage">
          <button className="button">List With Us</button>
        </Link>

        <Link to="/ConstructionPage">
          <button className="button">Sign In</button>
        </Link>
      </div>
    </div>
  );
};
export default Header;
