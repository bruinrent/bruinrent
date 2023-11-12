import logo from "./logo.svg";
import React, { useState } from "react";
import "./App.css";
import Homepage from "./components/screens/homepage.js";
import Waitlist from "./components/screens/waitlist.js";
import ThankYou from "./components/screens/thankyou.js";
import Apartment from "./components/screens/Apartment.js";
import UnderConstruction from "./components/screens/underConstruction.js";
import MapPage from "./components/screens/MapPage.js";
import ReviewPage from "./components/screens/ReviewPage.js";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Switch,
} from "react-router-dom";
import ListingPage from "./components/screens/ListingPage.js";
import { Navigate } from "react-router-dom";
import ApartmentPage from "./components/screens/Apartment.js";
import Account from './components/Account.jsx'
import { useAuthContext, AuthContextProvider } from "./components/AuthContext.js"

/** Testing pages
 *
 */
// import AddressBlock from "./components/screens/AddressBlock.js";
// import HomeBack from "./components/screens/homepagebackup.js";
// import text from "./components/screens/textbox.js";
// import homeBackCommit from "./components/screens/homebackup"; // Before commit

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
        <AuthContextProvider>
        <Router>
            <Routes>
                <Route exact path="/" element={<Homepage />} />
                <Route path="/Waitlist" element={<Waitlist />} />
                <Route path="/Construction" element={<UnderConstruction />} />
                <Route path="/MapPage" element={<MapPage />} />
                <Route path="/ListingPage" element={<ListingPage />} />
                <Route path="/apartment/:id" element={<Apartment />} />
                <Route path="/ReviewPage" element={<ReviewPage />} />
                <Route path="/account" element={<Account />} />
                {/* <Route path="/Apartment" element={<Apartment />} /> */}
            </Routes>
        </Router>
        </AuthContextProvider>
    );
}

export default App;
