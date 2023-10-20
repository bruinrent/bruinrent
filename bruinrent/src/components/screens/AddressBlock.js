import React from "react";
import apart1 from "../../assets/apart_1.png";
import "./homepage.css";

const AddressBlock = ({ address, bedrooms, bathroom, imageUrl }) => {
    return (
        <div className="homepage-image-item">
            {imageUrl ? (
                <img className="homepage-image" src={imageUrl} alt={address} />
            ) : (
                <img
                    className="homepage-image"
                    src={apart1}
                    alt="Stock Image"
                />
            )}
            <p className="homepage-image-detail1">{address}</p>
            <p className="homepage-image-detail2">
                {bedrooms} Bed {bathroom} Bath
            </p>
        </div>
    );
};

export default AddressBlock;
