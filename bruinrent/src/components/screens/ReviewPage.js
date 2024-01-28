import React, { useEffect, useState } from "react";
import "./ReviewPage.css";
import Header from "../Header.jsx";
// import RatingStars from "../RatingStars";
import { useNavigate } from "react-router-dom";

import RatingStars from "../RatingStars.js";
import { collection, addDoc } from "firebase/firestore";
import { app, firestore } from "../../firebase.js";
import { async } from "@firebase/util";
import { useAuthContext } from "../AuthContext.js";
import addressToLongLat from "../addressToLongLat.js";

//import { star} from "react-star-ratings";

const ReviewPage = ({ addReview }) => {
    const navigate = useNavigate();
    const [rating, setRating] = useState({
        overall: 0,
        cleanliness: 0,
        noise: 0,
        landlord: 0,
        location: 0,
    });
    const [userInfo, setUserInfo] = useState({
        year: "freshman",
    });
    const { user } = useAuthContext();
    const [review, setReview] = useState("");
    const [address, setAddress] = useState("");
    const [apartmentName, setApartmentName] = useState("");
    const [totalMonthlyRent, setTotalMonthlyRent] = useState(null);
    const [residentName, setResidentName] = useState("");
    const [residentEmail, setResidentEmail] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [beds, setBeds] = useState(null);
    const [baths, setBaths] = useState(null);

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
    }, [user]);

    const handleRatingChange = (category, newRating) => {
        // Update the rating for the specific category
        setRating((prevRating) => ({
            ...prevRating,
            [category]: newRating,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const longLat = await addressToLongLat(address);

            const latLong = [longLat[1], longLat[0]];

            const formData = {
                address: address,
                latLong: latLong,
                review: review,
                rating: rating,
                userInfo: userInfo,
            };

            const collectionRef = collection(
                firestore,
                `users/${user.uid}/reviews`
            );

            const docRef = await addDoc(collectionRef, formData);

            console.log("Document written with ID: ", docRef.id);

            navigate("/");

            console.log(formData);
        } catch (error) {
            console.error("Error:", error.message);

            // alert("Error: Invalid address. Please enter a valid address.");
        }
    };

    // Currently never needs sign in. When sign in on site needed, change true to user === null
    return (
        <div className="review-page-container">
            <Header />
            {user === null ? (
                <span
                    className="leave-review-text"
                    style={{
                        alignSelf: "center",
                        width: "100%",
                        display: "inline-block",
                    }}
                >
                    Complete signing in to leave a review!
                </span>
            ) : (
                <div>
                    <div className="rating-details">
                        <text className="leave-review-text">
                            Leave a Review
                        </text>
                        <div className="write-review-container">
                            <text className="title-text">Address</text>
                            <textarea
                                className="address-review-text"
                                type="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <text className="title-text">Apartment Name</text>
                            <textarea
                                className="address-review-text"
                                type="apartmentName"
                                value={apartmentName}
                                onChange={(e) => setApartmentName(e.target.value)}
                            />
                            <text className="title-text">Apartment Info</text>
                                <label> Total Monthly Rent: 
                                    <input
                                        className="address-review-text"
                                        type="text"
                                        pattern="[0-9]*"
                                        value={totalMonthlyRent}
                                        onChange={(e) => setTotalMonthlyRent(e.target.value.replace(/[^0-9]/ig, ""))}
                                    />
                                </label>
                                <label> Beds
                                    <input
                                        className="address-review-text"
                                        type="text"
                                        pattern="[0-9]*"
                                        value={beds}
                                        onChange={(e) => setBeds(e.target.value.replace(/[^0-9]/ig, ""))}
                                    />
                                </label>
                                <label> Baths 
                                    <input
                                        className="address-review-text"
                                        type="text"
                                        pattern="[0-9]*"
                                        value={baths}
                                        onChange={(e) => setBaths(e.target.value.replace(/[^0-9]/ig, ""))}
                                    />
                                </label>
                            <text className="title-text">Resident Info</text>
                            <div className="resident-info-year">
                                <label for="resident-year">Your Year:</label>
                                <select
                                    name="resident-year"
                                    id="resident-year"
                                    onChange={(e) =>
                                        setUserInfo((prevInfo) => ({
                                            ...prevInfo,
                                            year: e.target.value,
                                        }))
                                    }
                                >
                                    <option value="freshman">Freshman</option>
                                    <option value="sophomore">Sophomore</option>
                                    <option value="junior">Junior</option>
                                    <option value="senior">Senior</option>
                                    <option value="super-senior">
                                        Super Senior
                                    </option>
                                </select>
                                <label for="resident-name">Your name</label>
                                <input
                                    className="address-review-text"
                                    type="text"
                                    value={residentName}
                                    onChange={(e) => setResidentName(e.target.value)}
                                />
                                <label for="resident-email">Email</label>
                                <input
                                    className="address-review-text"
                                    type="text"
                                    value={residentEmail}
                                    onChange={(e) => setResidentEmail(e.target.value)}
                                />
                                <label>
                                    Anonymous?
                                    <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={() => setIsAnonymous(!isAnonymous)}
                                    />
                                </label>
                            </div>
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
                            id="noise"
                            title="Noise"
                            onRatingChange={(newRating) =>
                                handleRatingChange("noise", newRating)
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
                        <button
                            className="upload-button"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewPage;
