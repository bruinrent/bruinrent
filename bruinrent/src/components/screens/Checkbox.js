import React, { useState } from "react";
import "./Checkbox.css"; // Import the CSS file for styling

const CheckBox = () => {
    const [filled, setFilled] = useState(false);

    const handleClick = () => {
        setFilled(!filled);
    };

    const boxClasses = `check-box ${filled ? "filled" : ""}`;

    return <div className={boxClasses} onClick={handleClick}></div>;
};

export default CheckBox;
