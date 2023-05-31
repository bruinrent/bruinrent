// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCVKeyCHX9Jlg9IAt2Z8MngV0_KAIWjP74",
    authDomain: "bruinrent-116e4.firebaseapp.com",
    projectId: "bruinrent-116e4",
    storageBucket: "bruinrent-116e4.appspot.com",
    messagingSenderId: "556510126336",
    appId: "1:556510126336:web:e3e87f41cfba59620d53e5",
    measurementId: "G-P5XK566DCB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
