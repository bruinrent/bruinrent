import React from "react";
import { Link } from "react-router-dom";
import "./AddressBlock.css";
import apart1 from "../../assets/apart_1.png";

const AddressBlock = ({ url, address, bedrooms, bathroom }) => {
  return (
    <Link to={url} style={{ textDecoration: "none" }}>
      <img className="address-block-image" src={apart1} alt="Apartment 1" />
      <p className="address-block-apartment">{address}</p>
      <p className="address-block-details">
        {bedrooms} Bed {bathroom} Bath{" "}
      </p>
    </Link>
  );
};

export default AddressBlock;
