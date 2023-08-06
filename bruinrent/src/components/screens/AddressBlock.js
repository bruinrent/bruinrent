import React from "react";
import "./homepage.css";
import apart1 from "../../assets/apart_1.png";
// import apart2 from "../../assets/apart_2.png";
// import apart3 from "../../assets/apart_3.png";

const AddressBlock = ({ address, bedrooms }) => {
    return (
        <div className="homepage-image-item">
            <img className="homepage-image" src={apart1} alt="Apartment 1" />
            <p className="homepage-image-detail1">{address}</p>
            <p className="homepage-image-detail2">{bedrooms} </p>
        </div>
    );
};

export default AddressBlock;
