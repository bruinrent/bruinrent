import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa/index.esm.js";
import { useSpring, animated } from "@react-spring/web";
import "./FilterButtonReviews.css";
import CheckBox from "./screens/Checkbox.js";
import { Rating, ThinStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

const FilterReviews = ({ onFilterChange, onSearch }) => {
  const [isReviewsDownOpen, setisReviewsDownOpen] = useState(false);
  const [isReviewFilterSel, setIsReviewFilterSel] = useState(false);
  const [price1, setPrice1] = useState("");
  const [price2, setPrice2] = useState("");

  const [rating, setRating] = useState(1);

  const ratingStarStyle = {
    itemShapes: ThinStar,
    activeFillColor: "#00BFF6",
    inactiveFillColor: "#D9D9D9",
  };

  useEffect(() => {
    onFilterChange(price1, price2);
  }, [price1, price2, onFilterChange]);

  const handleFilterClick = (e) => {
    e.preventDefault(); // Prevents the default behavior of the button
    setisReviewsDownOpen(!isReviewsDownOpen);
  };

  const onRatingChange = () => {};

  const handleFilter = () => {
    // console.log(`Searching for ${beds} beds and ${baths} baths`);
    onSearch();
    onFilterChange(price1, price2);
    setisReviewsDownOpen(false);
  };

  const dropdownSpring = useSpring({
    from: { opacity: 0, height: 0 },
    to: {
      opacity: isReviewsDownOpen ? 1 : 0,
      height: isReviewsDownOpen ? "auto" : 0,
    },
    config: { mass: 5, tension: 2000, friction: 200, duration: 300 },
  });

  return (
    <div className="container">
      <button
        className={`map-page-reviews-filter ${
          isReviewsDownOpen ? "active" : ""
        }`}
        onClick={handleFilterClick}
      >
        Ratings & Reviews
        <FaChevronDown
          style={{
            marginLeft: "5px",
            verticalAlign: "middle",
          }}
        />
      </button>
      <animated.div
        style={{
          ...dropdownSpring,
          // position: "absolute",
          zIndex: 9999,
        }}
        className="dropdown-reviews"
        // onClick={(e) => e.stopPropagation()} // Prevents the click event from reaching the parent button
      >
        {/* <input
          className="input-reviews"
          placeholder="Min"
          value={price1}
          onChange={(e) => setPrice1(e.target.value)}
        />

        <text>to</text>

        <input
          className="input-reviews"
          placeholder="Max"
          value={price2}
          onChange={(e) => setPrice2(e.target.value)}
        />

        <button className="search-button" onClick={handleSearch}>
          Search
        </button> */}
        <Rating
          style={{ width: 250, height: isReviewsDownOpen ? "auto" : 0 }}
          value={rating}
          onChange={setRating}
          itemStyles={ratingStarStyle}
        />
        <div className="filter-reviews-selection">
          <CheckBox
            checked={isReviewFilterSel}
            onChange={() => setIsReviewFilterSel(!isReviewFilterSel)}
          />
          <h2>Show Properties with Written Reviews</h2>
        </div>
        <button id="filter-reviews-button" onClick={() => handleFilter()}>
          Apply
        </button>
      </animated.div>
    </div>
  );
};

export default FilterReviews;
