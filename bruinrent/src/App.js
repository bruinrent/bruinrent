import logo from "./logo.svg";
import React, { useState } from "react";
import "./App.css";
import Homepage from "./components/screens/homepage.js";
import Waitlist from "./components/screens/waitlist.js";
import ThankYou from "./components/screens/thankyou.js";
import UnderConstruction from "./components/screens/underConstruction.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";

function App() {
    const [thankYou, setThankYou] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);

    const isEmailValid = (email) => {
        const emailRegex = /^[A-Z0-9+_.-]+@(ucla\.edu|g\.ucla\.edu)$/i;
        return emailRegex.test(email);
    };

    const handleSubmit = (email) => {
        if (!isEmailValid(email)) {
            console.log("invalid email");
            setErrorMsg(true);
        } else {
            setThankYou(true);
            console.log("submitted");
        }
    };

    //  return thankYou ? <ThankYou /> : <Waitlist handleSubmit={handleSubmit} errorMsg={errorMsg}/>;
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Homepage />} />
                <Route path="/Waitlist" element={<Waitlist />} />
                <Route path="/Construction" element={<UnderConstruction />} />
            </Routes>
        </Router>
    );
}

export default App;
