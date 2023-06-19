import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import Homepage from './components/screens/homepage.js'
import Waitlist from './components/screens/waitlist.js'
import ThankYou from './components/screens/thankyou';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


function App() {

  const [thankYou, setThankYou] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const isEmailValid = (email) => {
    const emailRegex = /^[A-Z0-9+_.-]+@(ucla\.edu|g\.ucla\.edu)$/i;
    return emailRegex.test(email);
  }

  const handleSubmit = (email) => {
    if (!isEmailValid(email)) {
      console.log("invalid email");
      setErrorMsg(true);
    }
    else{
      setThankYou(true);
      console.log('submitted');
    }
    
  };


  return thankYou ? <ThankYou /> : <Waitlist handleSubmit={handleSubmit} errorMsg={errorMsg}/>;
  //return <Homepage />

}

export default App;
