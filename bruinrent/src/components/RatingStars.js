import React, { useState } from "react";
import { FaStar } from "react-icons/fa/index.esm.js";
import "./RatingStars.css";

const RatingStars = ({ title, id }) => {
    const defaultColor = "#00A7E1"; // Define defaultColor
    const ratedColor = "blue"; // Define ratedColor
    // const initialRating = rating || 0; // Set a default value if rating is not provided

    const [rating, setCurrentRating] = useState(0);

    const handleStarClick = (selectedRating) => {
        setCurrentRating(selectedRating);
        console.log(`Rating for ${id}: ${selectedRating}`);
    };

    return (
        <div
            className="star-rating"
            style={{
                "--star-default": defaultColor,
                "--star-rated": ratedColor,
            }}
        >
            <h2 className="title-text">{title}</h2>
            {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;

                return (
                    <label key={i} className="star">
                        <input
                            type="radio"
                            name={`rating-${id}`}
                            value={ratingValue}
                            checked={ratingValue === rating}
                            onChange={() => handleStarClick(ratingValue)}
                        />

                        <i
                            className={
                                ratingValue <= rating
                                    ? "fas fa-star rated"
                                    : "far fa-star"
                            }
                            style={{
                                color:
                                    ratingValue <= rating
                                        ? ratedColor
                                        : defaultColor,
                            }}
                        />
                    </label>
                );
            })}
            <div className="star-label">
                <p style={{ marginRight: 190 }}>Lowest</p> <p>Highest</p>
            </div>
        </div>
    );
};

export default RatingStars;
