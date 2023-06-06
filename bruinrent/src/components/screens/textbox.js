import React, { useState } from "react";
import "./waitlist.css";

function TextBox(props) {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = () => {
        // Perform any action you want when the button is clicked
        console.log("Button Clicked");
    };

    return (
        <div>
            {/* <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="waitlist-input"
                placeholder="joebruin@gmail.com"
            /> */}
            <input
                type="text"
                {...props} // Spread the props to the input element
                className="waitlist-input"
            />
        </div>
    );
}

export default TextBox;
