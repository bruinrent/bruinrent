import { Link } from "react-router-dom";
import "./Footer.css";
import { FaInstagram } from "react-icons/fa/index.esm";

const Footer = () => {
  return (
    <div className="footer-container">
      <Link target="_blank" to="https://www.instagram.com/bruinrent/">
        <FaInstagram size={28} />
      </Link>
    </div>
  );
};

export default Footer;
