import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import Homepage from './components/screens/homepage.js'
import Waitlist from './components/screens/waitlist.js'
import ThankYou from './components/screens/thankyou';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


function App() {

  const [thankYou, setThankYou] = useState(false);

  const handleSubmit = () => {
    setThankYou(true);
    console.log('submitted')
  };


  //return thankYou ? <ThankYou /> : <Waitlist handleSubmit={handleSubmit} />;
  return <Waitlist />

}

export default App;
