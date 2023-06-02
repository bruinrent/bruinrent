import React, { useState } from 'react';
import './waitlist.css'

function TextBox() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    // Perform any action you want when the button is clicked
    console.log('Button Clicked');
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="waitlist-input"
        placeholder="joebruin@gmail.com"
      />
    </div>
  );
}

export default TextBox;