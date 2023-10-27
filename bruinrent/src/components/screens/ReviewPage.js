import React, { useState } from "react";
import "./ReviewPage.css";
import Header from "../Header.jsx";
// import RatingStars from "../RatingStars";
import RatingStars from "../RatingStars.js";
//import { star} from "react-star-ratings";

const ReviewPage = ({ addReview }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (review.trim() !== "") {
            addReview(review);
            setReview("");
        }
    };

    return (
        <div className="review-page-container">
            <Header />

            <div className="rating-details">
                <text className="leave-review-text">Leave a Review</text>
                <div className="write-review-container">
                    <text className="title-text">Address</text>
                    <textarea
                        className="address-review-text"
                        type="address"
                        // value={addressDesc}
                        // onChange={(e) => setAddressDesc(e.target.value)}
                        //onChange={onSearch}
                    />
                    <text className="title-text">Write a Review</text>
                    <textarea
                        className="review-text"
                        type="review"
                        // value={addressDesc}
                        // onChange={(e) => setAddressDesc(e.target.value)}
                        //onChange={onSearch}
                    />
                </div>
                <RatingStars id="overall" title="Overall Rating" />
                <RatingStars id="cleanliness" title="Cleanliness" />
                <RatingStars id="social" title="Social" />
                <RatingStars id="landlord" title="Landlord" />
                <RatingStars id="location" title="Location" />
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                }}
            >
                <button className="upload-button" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default ReviewPage;
