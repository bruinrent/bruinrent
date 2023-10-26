import React, { useState } from "react";
import "./ReviewPage.css";
import Header from "../Header.jsx";

const ReviewPage = ({ addReview }) => {
    const [review, setReview] = useState("");

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

            <div className="review-details">
                <text className="leave-review-text">Leave a Review</text>
            </div>
        </div>
    );
};

export default ReviewPage;
