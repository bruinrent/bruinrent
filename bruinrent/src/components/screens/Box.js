import React from "react";
import PropTypes from "prop-types";
import "./Box.css"; // Import your styling

const BoxTemplate = ({ children }) => {
    return <div className="box-template">{children}</div>;
};

BoxTemplate.propTypes = {
    children: PropTypes.node.isRequired,
};

export default BoxTemplate;
