import React, { useEffect, useState } from "react";
import "./ReviewPage.css";
import Header from "../Header.jsx";
// import RatingStars from "../RatingStars";
import { useNavigate } from "react-router-dom";

import RatingStars from "../RatingStars.js";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { app, firestore } from "../../firebase.js";
import { async } from "@firebase/util";
import { useAuthContext } from "../AuthContext.js";
import addressToLongLat from "../addressToLongLat.js";
import {
  getCurrentDateTime,
  processAndAddReview,
} from "../ReviewUploadUtil.js";

import Select from "react-select";

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
  const [totalMonthlyRent, setTotalMonthlyRent] = useState(undefined);
  const [residentName, setResidentName] = useState("");
  const [residentEmail, setResidentEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [beds, setBeds] = useState(undefined);
  const [baths, setBaths] = useState(undefined);
  const [addressOptions, setAddressOptions] = useState([]);
  const [selectedAddressOption, setSelectedAddressOption] = useState({});

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

  useEffect(() => {
    console.log(JSON.stringify(selectedAddressOption));
  }, [selectedAddressOption]);
  useEffect(() => {
    console.log("use effect");
    const fetchListings = async () => {
      const tocData = (
        await getDoc(doc(firestore, "reference", "listings-toc"))
      ).data();
      const listingsData = Object.entries(tocData).map(([id, data]) => ({
        value: id,
        label: data.address,
      }));

      setAddressOptions(listingsData);
    };
    fetchListings();
  }, []);

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
      const reviewDoc = doc(collection(firestore, "reviews"));
      const reviewDocID = reviewDoc.id;
      const dateTime = getCurrentDateTime();

      const reviewData = {
        SubmissionID: reviewDocID,
        RespondentID: "WebForm",
        SubmissionTime: dateTime,
        Name: residentName,
        Email: residentEmail,
        Year: userInfo,
        Anonymous: String(isAnonymous),
        Address: selectedAddressOption.label,
        ApartmentName: apartmentName,
        Bedrooms: String(beds),
        Bathrooms: String(baths),
        TotalRent: String(totalMonthlyRent),
        Review: review,
        ScoreOverall: rating.overall,
        ScoreLandlord: rating.landlord,
        ScoreCleanliness: rating.cleanliness,
        ScoreNoise: rating.noise,
        ScoreLocation: rating.location,
        parents: [selectedAddressOption.value],
      };
      // Update the parent to reference the review
      updateDoc(doc(firestore, "listings", selectedAddressOption.value), {
        reviews: arrayUnion(reviewDocID),
      });

      // Create the review document with its data
      setDoc(reviewDoc, reviewData);

      // console.log("Document written with ID: ", docRef.id);
      navigate("/");

      console.log(reviewData);
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
        <span id="complete-sign-in">
          Complete signing in to leave a review!
        </span>
      ) : (
        <div className="review-page-main-container">
          <h1 className="leave-review-text">Leave a Review</h1>
          <div className="review-page-section">
            <h2>Address</h2>
            <Select
              className="address-dropdown"
              options={addressOptions}
              onChange={setSelectedAddressOption}
              value={selectedAddressOption}
            />
          </div>
          <div className="review-page-section">
            <h2>Apartment Name</h2>
            <textarea
              type="apartmentName"
              value={apartmentName}
              onChange={(e) => setApartmentName(e.target.value)}
            />
          </div>
          <div className="review-page-section">
            <h2>Apartment Info</h2>
            <div className="review-page-input-details">
              <h3>Total Monthly Rent: </h3>
              <input
                type="number"
                step="0.01"
                value={totalMonthlyRent}
                onChange={(e) => setTotalMonthlyRent(e.target.value)}
              />
            </div>
            <div className="review-page-input-details">
              <h3>Beds: </h3>
              <input
                type="number"
                step="1"
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
              />
            </div>
            <div className="review-page-input-details">
              <h3>Baths</h3>
              <input
                type="number"
                step="1"
                value={baths}
                onChange={(e) => setBaths(e.target.value)}
              />
            </div>
          </div>
          <div className="review-page-section">
            <h2>Resident Info</h2>
            <div className="review-page-input-details">
              <h3>Your Year: </h3>
              <select
                name="resident-year"
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
                <option value="super-senior">Super Senior</option>
              </select>
            </div>
            <div className="review-page-input-details">
              <h3>Your Name: </h3>
              <input
                type="text"
                value={residentName}
                onChange={(e) => setResidentName(e.target.value)}
              />
            </div>
            <div className="review-page-input-details">
              <h3>Email: </h3>
              <input
                type="email"
                value={residentEmail}
                onChange={(e) => setResidentEmail(e.target.value)}
              />
            </div>
            <div className="review-page-input-details">
              <h3>Anonymous? </h3>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
              />
            </div>
          </div>
          <div className="review-page-section">
            <h2>Write a Review</h2>
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
