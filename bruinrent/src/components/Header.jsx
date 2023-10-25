import "../styles/Header.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo_white.png";

const Header = () => {
  return (
    <div className="header-container">
      <Link to="/" className="header-logo-container">
        <img className="header-logo" src={logo} alt="Bruin Rent Logo" />
      </Link>

      <Link to="/" style={{ textDecoration: "none" }}>
        <h2 className="header-title">BruinRent</h2>
      </Link>

      <div className="header-links">
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
    </div>
  );
};
export default Header;
