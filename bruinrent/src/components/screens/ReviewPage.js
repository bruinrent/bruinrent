import React, { useEffect, useState } from "react";
import "./ReviewPage.css";
import Header from "../Header.jsx";
// import RatingStars from "../RatingStars";
import { useNavigate } from "react-router-dom";

import RatingStars from "../RatingStars.js";
import { collection, addDoc } from "firebase/firestore";
import { app, firestore } from "../../firebase.js";
import { async } from "@firebase/util";
import { useAuthContext } from '../AuthContext.js';
import addressToLongLat from "../addressToLongLat.js";


//import { star} from "react-star-ratings";

const ReviewPage = ({ addReview }) => {
    const navigate = useNavigate();
    const [rating, setRating] = useState({
        overall: 0,
        cleanliness: 0,
        social: 0,
        landlord: 0,
        location: 0,
    });
    const { user } = useAuthContext();
    const [review, setReview] = useState("");
    const [address, setAddress] = useState("");

    // const [firstName, setFirstName] = useState("");
    // const [lastName, setLastName] = useState("");
    // const [email, setEmail] = useState("");
    // useEffect(() => {
    //     if (user == null) {
    //         alert("Sign in with google in the top bar before leaving a review! :)");
    //     }   
    // }, [])

    // const [phone, setPhone] = useState("");
    useEffect(() => {
        if (user != null) {
            console.log("USER ID: " + user.uid);
        }   
    }, [user])

    const handleRatingChange = (category, newRating) => {
        // Update the rating for the specific category
        setRating((prevRating) => ({
            ...prevRating,
            [category]: newRating,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const longLat = await addressToLongLat(address);
        const latLong = [longLat[1], longLat[0]];
        const formData = {
            address: address,
            latLong: latLong,
            review: review,
            rating: rating,
        };

        const collectionRef = collection(firestore, `users/${user.uid}/reviews`);

        try {
            const docRef = await addDoc(collectionRef, formData);
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }

        navigate("/");

        console.log(formData);
    };

    return (

        <div className="review-page-container">
            <Header />
            {user===null ? (<span className="leave-review-text" style={{alignSelf:'center',width:'100%', display:'inline-block'}}>Complete signing in to leave a review!</span>):(
            <div>
            <div className="rating-details">
                <text className="leave-review-text">Leave a Review</text>
                <div className="write-review-container">
                    <text className="title-text">Address</text>
                    <textarea
                        className="address-review-text"
                        type="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        // value={addressDesc}
                        // onChange={(e) => setAddressDesc(e.target.value)}
                        //onChange={onSearch}
                    />
                    <text className="title-text">Write a Review</text>
                    <textarea
                        className="review-text"
                        type="review"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        // value={addressDesc}
                        // onChange={(e) => setAddressDesc(e.target.value)}
                        //onChange={onSearch}
                    />
                </div>
                <RatingStars
                    id="overall"
                    title="Overall Rating"
                    onRatingChange={(newRating) =>
                        handleRatingChange("overall", newRating)
                    }
                />
                <RatingStars
                    id="cleanliness"
                    title="Cleanliness"
                    onRatingChange={(newRating) =>
                        handleRatingChange("cleanliness", newRating)
                    }
                />
                <RatingStars
                    id="social"
                    title="Social"
                    onRatingChange={(newRating) =>
                        handleRatingChange("social", newRating)
                    }
                />
                <RatingStars
                    id="landlord"
                    title="Landlord"
                    onRatingChange={(newRating) =>
                        handleRatingChange("landlord", newRating)
                    }
                />
                <RatingStars
                    id="location"
                    title="Location"
                    onRatingChange={(newRating) =>
                        handleRatingChange("location", newRating)
                    }
                />
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                }}
            >
                <button className="upload-button" onClick={handleSubmit}>
                    Submit
                </button>

            </div>
            </div>
            )}
        </div>

    );
};

export default ReviewPage;
