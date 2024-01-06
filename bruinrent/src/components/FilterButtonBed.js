import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa/index.esm.js";
import { useSpring, animated } from "@react-spring/web";
import "./FilterButtonBed.css";

const FilterBed = () => {
    const [isBeddownOpen, setIsBeddownOpen] = useState(false);
    const [beds, setBeds] = useState("");
    const [baths, setBaths] = useState("");

    const handleFilterClick = (e) => {
        // e.preventDefault(); // Prevents the default behavior of the button
        setIsBeddownOpen(!isBeddownOpen);
    };

    const handleSearch = () => {
        console.log(`Searching for ${beds} beds and ${baths} baths`);
        setIsBeddownOpen(false);
    };

    const dropdownSpring = useSpring({
        from: { opacity: 0, height: 0 },
        to: {
            opacity: isBeddownOpen ? 1 : 0,
            height: isBeddownOpen ? "auto" : 0,
        },
        config: { mass: 5, tension: 2000, friction: 200, duration: 300 },
    });

    return (
        <div className="container">
            <button
                className={`map-page-bed-filter1 ${
                    isBeddownOpen ? "active" : ""
                }`}
                onClick={handleFilterClick}
            >
                Bed and Bath
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
                    position: "absolute",
                    zIndex: 9999,
                }}
                className="dropdown-bed"
                // onClick={(e) => e.stopPropagation()} // Prevents the click event from reaching the parent button
            >
                <input
                    className="input-bed"
                    placeholder="Beds"
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                />
                <input
                    className="input-bed"
                    placeholder="Baths"
                    value={baths}
                    onChange={(e) => setBaths(e.target.value)}
                />

                <button className="search-button" onClick={handleSearch}>
                    Search
                </button>
            </animated.div>
        </div>
    );
};

export default FilterBed;
