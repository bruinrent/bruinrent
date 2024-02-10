import React, { useState, useEffect } from "react";
import "./Apartment.css"; // Import the CSS file for component-specific styles
import apart1 from "../../assets/apart_1.png";
import apart2 from "../../assets/apart_2.png";
import BoxTemplate from "./ResizableBox.js";
import addressToLongLat from "../addressToLongLat.js";
import GoogleMap from "../GoogleMap.js";
import Header from "../Header.jsx";
import Box from "@mui/material/Box/index.js";
import Modal from "@mui/material/Modal/index.js";
import ApartmentReviewBlock from "./ApartmentReviewBlock.jsx";
import { Link } from "react-router-dom";
// firebase stuff
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../../firebase.js";
import { useParams } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { IoIosPhonePortrait } from "react-icons/io/index.esm.js";
import { MdOutlineEmail } from "react-icons/md/index.esm.js";
import { GrNext, GrPrevious } from "react-icons/gr/index.esm.js";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const ApartmentPage = () => {
  // Get the document ID from the URL parameter
  const [markers, setMarkers] = useState([]);
  const { id } = useParams();
  const [imageFiles, setImageFiles] = useState({});
  const [latLong, setLatLong] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    Count: 0,
    Overall: -1,
    Landlord: -1,
    Noise: -1,
    Location: -1,
    Cleanliness: -1,
  });

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [apartmentData, setApartmentData] = useState({
    address: "",
    addressDesc: "",
    size: "",
    bedrooms: "",
    rent1: "",
    rent2: "",
    units: "",
    baths: "",
    lease1: "",
    lease2: "",
    videoLink: "",
    parkingSinglePrice: "",
    parkingTandemPrice: "",
    parkingType: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    checkedApartmentFeatureLabels: [],
    checkedBuildingFeatureLabels: [],
    imageUrls: [],
    reviews: [],
  });

  useEffect(() => {
    // Function to fetch apartment data from Firebase and update state
    const fetchDataFromFirebase = async () => {
      try {
        // Assuming you have a reference to the document in Firestore
        const apartmentDocRef = doc(firestore, "listings", id);

        // Fetch the data from Firestore
        const docSnapshot = await getDoc(apartmentDocRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          // Update your component state with the fetched data
          setApartmentData(data);
          console.log("RAW DATA: " + JSON.stringify(data));
        } else {
          console.error("Document doesn't exist:");
        }
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
      }
    };

    fetchDataFromFirebase();
  }, [id]); // Include the ID in the dependency array to re-fetch data when the ID changes

  //Temporary, should NOT be calling API to get latlong, should be created when listing is made
  useEffect(() => {
    if (apartmentData.address) {
      addressToLongLat(apartmentData.address).then((result) => {
        console.log(`Result: ${result[0]}`);
        setLatLong([result[1], result[0]]);
        console.log(latLong);
      });
      console.log(latLong[0] + " || " + latLong[1]);
      //
    }
  }, [apartmentData.address]);

  useEffect(() => {
    if (apartmentData) {
      console.log("Apartment Data: " + JSON.stringify(apartmentData));
    }
  }, [apartmentData]);

  useEffect(() => {
    if (apartmentData.imageUrls) {
      const images = apartmentData.imageUrls.map((url) => ({
        original: url,
        thumbnail: url,
      }));
      setImageFiles(images);
      console.log("Image files: " + JSON.stringify(images));
      //
    }
  }, [apartmentData.imageUrls]);

  const average = (array) => array.reduce((a, b) => a + b) / array.length;

  useEffect(() => {
    const fetchData = async () => {
      if (apartmentData.reviews && apartmentData.reviews.length > 0) {
        console.log("reviewData: " + JSON.stringify(apartmentData.reviews));
        let r_count = 0;
        let r_value = [];
        let r_land = [];
        let r_noise = [];
        let r_clean = [];
        let r_location = [];

        const fetchReviewData = async (reviewID) => {
          try {
            console.log("Processing review: " + reviewID);
            const reviewDocRef = doc(firestore, "reviews", reviewID);
            const docSnapshot = await getDoc(reviewDocRef);

            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              console.log("RAW Review data: " + JSON.stringify(data));
              const reviewToAdd = {
                date: data.SubmissionTime,
                review: data.Review,
              };
              r_clean.push(parseInt(data.ScoreCleanliness));
              r_count++;
              r_land.push(parseInt(data.ScoreLandlord));
              r_noise.push(parseInt(data.ScoreNoise));
              r_location.push(parseInt(data.ScoreLocation));
              r_value.push(parseInt(data.ScoreOverall));
              console.log(r_clean);
              console.log(r_land);
              console.log(r_noise);
              console.log(r_location);
              console.log(r_value);

              console.log("Review to add: " + JSON.stringify(reviewToAdd));
              setReviewData((prevReviews) => [...prevReviews, reviewToAdd]);
            } else {
              console.error("Document doesn't exist:");
            }
          } catch (error) {
            console.error("Error fetching data from Firebase:", error);
          }
        };

        try {
          await Promise.all(
            apartmentData.reviews.map(async (reviewID) => {
              await fetchReviewData(reviewID);
            })
          );

          console.log("About to average");
          const finalScoreCleanliness = average(r_clean);
          const finalScoreLandlord = average(r_land);
          const finalScoreNoise = average(r_noise);
          const finalScoreLocation = average(r_location);
          const finalScoreValue = average(r_value);
          console.log("FinalLL" + finalScoreLandlord);
          setReviewStats({
            Count: r_count,
            Overall: parseFloat(finalScoreValue.toFixed(1)),
            Landlord: parseFloat(finalScoreLandlord.toFixed(1)),
            Noise: parseFloat(finalScoreNoise.toFixed(1)),
            Location: parseFloat(finalScoreLocation.toFixed(1)),
            Cleanliness: parseFloat(finalScoreCleanliness.toFixed(1)),
          });
        } catch (error) {
          console.error("Error processing reviews:", error);
        }
      }
    };

    fetchData();
  }, [apartmentData.reviews]);

  useEffect(() => {
    console.log("latlong updated, latlong: " + latLong);
    if (latLong.length === 2) {
      setMarkers([
        {
          lat: latLong[0],
          lng: latLong[1],
          text: apartmentData.address,
          id: id,
        },
      ]);
      const apartmentDocRef = doc(firestore, "listings", id);
      setDoc(
        apartmentDocRef,
        { latLong: [latLong[0], latLong[1]] },
        { merge: true }
      );
      console.log(id);
    }
  }, [latLong]);

  function sendEmail(recipient) {
    const emailLink = `mailto:${recipient}`;
    window.location.href = emailLink;
  }
  // Note: Not sure about the access/current backend state of:
  // Reviews (compiled ratings, individual review info, etc)
  // Note: Headers inside or outside boxes?

  // Test data for review block

  const NUM_REVIEWS_PER_PAGE = 3;
  const MAX_NUM_REVIEW_PAGES = Math.ceil(
    reviewData.length / NUM_REVIEWS_PER_PAGE
  );
  const [currReviewPage, setCurrReviewPage] = useState(1);

  class ShowAllCarousel extends React.Component {
    render() {
      return (
        <div>
          {apartmentData.imageUrls ? (
            <Carousel axis="horizontal">
              {apartmentData.imageUrls.map((src, index) => (
                <div>
                  <img key={index} src={src} alt={`Image ${index + 1}`} />
                </div>
              ))}
            </Carousel>
          ) : (
            <React.Fragment />
          )}
        </div>
      );
    }
  }

  return (
    <div>
      <Header />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ width: "100%" }}
      >
        <Box sx={modalStyle}>
          <ShowAllCarousel />
        </Box>
      </Modal>
      <div className="apartment-homepage-container">
        {/* Images Group at the top of Apartment Page */}
        {/* NOTE: Probably want to add aspect ratio when rescaling */}
        <div className="image-group">
          <div className="individual-img-container">
            {apartmentData.imageUrls[0] ? ( // Check if imageUrls[0] exists
              <img
                src={apartmentData.imageUrls[0]}
                alt="Main"
                className="big-image"
              />
            ) : (
              <img src={apart2} alt="Placeholder" className="big-image" />
            )}
          </div>

          <div className="small-image-container">
            <div className="individual-small-img-container">
              {apartmentData.imageUrls[1] ? ( // Check if imageUrls[0] exists
                <img src={apartmentData.imageUrls[1]} alt="Secondary" />
              ) : (
                <img src={apart1} alt="Placeholder" />
              )}
            </div>
            <div className="show-all-img-container">
              {apartmentData.imageUrls[2] ? ( // Check if imageUrls[0] exists
                <img
                  src={apartmentData.imageUrls[2]}
                  alt="Secondary"
                  className="filtered-image"
                />
              ) : (
                <img
                  src={apart1}
                  alt="Placeholder"
                  className="filtered-image"
                />
              )}
              <button className="show-all-button" onClick={handleOpen}>
                Show All Photos
              </button>
            </div>
          </div>
        </div>

        <div className="apartment-homepage-header">
          <p className="header-subtext">
            Rent: {`${apartmentData.rent1} - $${apartmentData.rent2}`}
          </p>
          <div className="big-Header">{apartmentData.address}</div>
          <div className="header-subtext">
            <span className="header-subtext" style={{ fontSize: "1.1rem" }}>
              Los Angeles, CA 90024
            </span>
            <span
              className="header-subtext"
              style={{
                fontSize: "1.1rem",
                paddingLeft: "0.5rem",
                fontStyle: "italic",
              }}
            >
              {" "}
              {apartmentData.bedrooms} bed | {apartmentData.baths} bath |{" "}
              {apartmentData.size} sqft
            </span>
          </div>
        </div>
        <div className="apartment-homepage-main">
          <div>
            <div className="info-block">
              <h1>About the Apartment</h1>
              <text>Lease: 9 - 12 months {"\n"}</text>
              <text>{apartmentData.addressDesc}</text>
            </div>
            <hr className="horizontal-line" />
            {apartmentData.units.length > 0 && (
              <>
                <div className="info-block">
                  <h1>Floor Plans</h1>
                  <table>
                    <tr>
                      <th># Bedrooms</th>
                      <th>Rent</th>
                      <th># Baths</th>
                      <th>Size</th>
                    </tr>
                    {apartmentData.units.map((unitInfo) => (
                      <tr>
                        <th>{unitInfo.bedrooms}</th>
                        <th>
                          {unitInfo.rent1 && unitInfo.rent2
                            ? `${unitInfo.rent1} - ${unitInfo.rent2}`
                            : `${unitInfo.rent1}`}
                        </th>
                        <th>{unitInfo.baths}</th>
                        {unitInfo.size !== "" && <th>{unitInfo.size}</th>}
                      </tr>
                    ))}
                  </table>
                </div>
                <hr className="horizontal-line" />
              </>
            )}
            <div className="info-block">
              <h1>Contact This Property</h1>
              {apartmentData.phone && (
                <text>
                  <IoIosPhonePortrait size={24} /> {apartmentData.phone}
                </text>
              )}
              {apartmentData.email && (
                <text>
                  <MdOutlineEmail size={24} /> {apartmentData.email}
                </text>
              )}
            </div>
            <hr className="horizontal-line" />
            <div className="apartment-homepage-main-details">
              <div className="info-block">
                <h1>Property Details</h1>
                <div className="details-container">
                  <h2>Main Features</h2>
                  <ul>
                    <li>Bath: {apartmentData.baths} </li>
                    <li>Bedrooms: {apartmentData.bedrooms} </li>
                  </ul>
                </div>

                <div className="details-container">
                  <h2>Building Features</h2>
                  <ul>
                    {apartmentData.checkedBuildingFeatureLabels.map(
                      (label, index) => (
                        <li key={index}>{label}</li>
                      )
                    )}
                  </ul>
                </div>

                <div className="details-container">
                  <h2>Apartment Features</h2>
                  <ul>
                    {apartmentData.checkedApartmentFeatureLabels.map(
                      (label, index) => (
                        <li key={index}>{label}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>
              <div>
                <div className="info-block">
                  <h1>Parking</h1>
                  <BoxTemplate>
                    <div className="content-container">
                      <h2>Parking type: {apartmentData.parkingType}</h2>
                      <ul className="main-features-list">
                        <li>
                          Single Price: {apartmentData.parkingSinglePrice}
                        </li>
                        <li>
                          Tandem Price: {apartmentData.parkingTandemPrice}
                        </li>
                      </ul>
                    </div>
                  </BoxTemplate>
                </div>
                <div className="info-block">
                  <h1>Utilities Included</h1>
                  <BoxTemplate>
                    <div className="content-container">
                      <ul className="main-features-list">
                        <li>Trash</li>
                        <li>Water</li>
                        <li>Electricity</li>
                      </ul>
                    </div>
                  </BoxTemplate>
                </div>
              </div>
            </div>
            <text>Walk to Bruin Plaza: 15-20 min</text>

            <hr className="horizontal-line" />
            <div className="info-block">
              <h1>Property Location</h1>
              <p id="location-address">
                {apartmentData.address}, Los Angeles, CA 90024
              </p>
              <div className="apartment-map-container">
                <GoogleMap markers={markers} mapHeight="50vh" />
              </div>
            </div>
            {/* <hr className="horizontal-line" />
            <div className="info-block">
              <h1>Transportation</h1> */}
            {/* </div>  */}
          </div>
          <div id="apartment-homepage-main-review">
            <div id="review-header" className="rating-block">
              <div className="rating">
                {reviewStats.Overall == -1 ? "?" : reviewStats.Overall}
              </div>
              <h1>
                {reviewStats.Count > 0 ? reviewStats.Count : "No"}{" "}
                {reviewStats.Count == 1 ? " Review" : " Reviews"}
              </h1>
            </div>
            <div id="detailed-ratings">
              {/* <div className="rating-block">
                <div className="rating">{reviewStats.Value}</div>
                <h2>Value</h2>
              </div> */}
              <div className="rating-block">
                <div className="rating">
                  {reviewStats.Landlord == -1
                    ? "?"
                    : String(reviewStats.Landlord)}
                </div>
                <h2>Landlord</h2>
              </div>
              <div className="rating-block">
                <div className="rating">
                  {reviewStats.Noise == -1 ? "?" : reviewStats.Noise}
                </div>
                <h2>Noise</h2>
              </div>
              <div className="rating-block">
                <div className="rating">
                  {reviewStats.Location == -1 ? "?" : reviewStats.Location}
                </div>
                <h2>Location</h2>
              </div>
              <div className="rating-block">
                <div className="rating">
                  {reviewStats.Cleanliness == -1
                    ? "?"
                    : reviewStats.Cleanliness}
                </div>
                <h2>Cleaniness</h2>
              </div>
            </div>
            <div id="written-reviews">
              {reviewData
                .slice(
                  NUM_REVIEWS_PER_PAGE * currReviewPage - NUM_REVIEWS_PER_PAGE,
                  NUM_REVIEWS_PER_PAGE * currReviewPage
                )
                .map((data) => (
                  <ApartmentReviewBlock
                    datePosted={data.date}
                    reviewDesc={data.review}
                  />
                ))}
            </div>
            <div id="review-pagination">
              <GrPrevious
                onClick={() => {
                  if (currReviewPage != 1) {
                    setCurrReviewPage(currReviewPage - 1);
                  }
                }}
                className="review-pagination-buttons"
              />
              <p>
                {currReviewPage} / {MAX_NUM_REVIEW_PAGES}
              </p>
              <GrNext
                onClick={() => {
                  if (currReviewPage < MAX_NUM_REVIEW_PAGES) {
                    setCurrReviewPage(currReviewPage + 1);
                  }
                }}
                className="review-pagination-buttons"
              />
            </div>
            <Link to="/ReviewPage">
              <button id="leave-review-button">Leave a Review</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentPage;
