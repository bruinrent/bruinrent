import React from "react";
import PropTypes from "prop-types";
import "./ResizableBox.css"; // Import your styling

const BoxTemplate = ({ children }) => {
    return <div className="resizablebox-template">{children}</div>;
};

BoxTemplate.propTypes = {
    children: PropTypes.node.isRequired,
};

export default BoxTemplate;
