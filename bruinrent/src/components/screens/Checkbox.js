import React, { useState } from "react";
import "./Checkbox.css"; // Import the CSS file for styling

const CheckBox = ({ label, checked, onChange }) => {
    const boxClasses = `check-box ${checked ? "filled" : ""}`;

    const labelStyles = {
        color: "#000",
        fontFamily: "Lato, sans-serif",
        fontSize: "13px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
    };

    return (
        <label className="check-box-label" style={labelStyles}>
            <div className={boxClasses} onClick={onChange}></div>
            {label}
        </label>
    );
};

export default CheckBox;
