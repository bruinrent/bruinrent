import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa/index.esm.js";
import { useSpring, animated } from "@react-spring/web";
import "./FilterButtonPrice.css";

const FilterPrice = () => {
    const [isPricedownOpen, setIsPricedownOpen] = useState(false);
    const [price1, setPrice1] = useState("");
    const [price2, setPrice2] = useState("");

    const handleFilterClick = (e) => {
        e.preventDefault(); // Prevents the default behavior of the button
        setIsPricedownOpen(!isPricedownOpen);
    };

    const handleSearch = () => {
        // console.log(`Searching for ${beds} beds and ${baths} baths`);
        setIsPricedownOpen(false);
    };

    const dropdownSpring = useSpring({
        from: { opacity: 0, height: 0 },
        to: {
            opacity: isPricedownOpen ? 1 : 0,
            height: isPricedownOpen ? "auto" : 0,
        },
        config: { mass: 5, tension: 2000, friction: 200, duration: 300 },
    });

    return (
        <div className="container">
            <button
                className={`map-page-price-filter ${
                    isPricedownOpen ? "active" : ""
                }`}
                onClick={handleFilterClick}
            >
                Price
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
                className="dropdown-price"
                // onClick={(e) => e.stopPropagation()} // Prevents the click event from reaching the parent button
            >
                <input
                    className="input-price"
                    placeholder="Min"
                    value={price1}
                    onChange={(e) => setPrice1(e.target.value)}
                />

                <text>to</text>

                <input
                    className="input-price"
                    placeholder="Max"
                    value={price2}
                    onChange={(e) => setPrice2(e.target.value)}
                />

                <button className="search-button" onClick={handleSearch}>
                    Search
                </button>
            </animated.div>
        </div>
    );
};

export default FilterPrice;
