import {
    collection,
    getDocs,
    query,
    startAfter,
    limit,
    orderBy,
    setDoc,
    doc,
    getDoc,
    runTransaction
} from "firebase/firestore";
import { firestore } from "../firebase.js";
import { addressToLatLong } from "./addressToLongLat.js";

const processAndAddReview = async (jsonData) => {
const reviewsTocRef = doc(firestore, "reference", "reviews-toc");

    try {
        await runTransaction(firestore, async (transaction) => {
    console.log("process and add review call");
            const newOrphans = []
            const matching = []
            const duplicates = []
    
    const reviewsTocData = (await transaction.get(reviewsTocRef)).data();
    console.log("Reviews toc: " + JSON.stringify(reviewsTocData, null, 4));

    // Turn array of reviews to object of objects of reviews where submission id is key, and removed
    const objectOfObjectsNewReviews = jsonData.reduce((acc, obj) => {
        // Destructure obj into submission id and the rest
        const { SubmissionID, ...rest } = obj;
        acc[obj.SubmissionID] = rest;
        return acc;
    }, {});

    // Store keys of already existing reviews
    const reviewsTocKeysSet = new Set(Object.keys(reviewsTocData));

    const actualNewReviews = {};
    for (const key in objectOfObjectsNewReviews) {
        if (!reviewsTocKeysSet.has(key)) {
            actualNewReviews[key] = objectOfObjectsNewReviews[key];
            reviewsTocData[key] =
                objectOfObjectsNewReviews[key].SubmissionTime;
        } else {
            duplicates.push(key)
            console.log(
                "Duplicate found: " +
                    key +
                    ": " +
                    JSON.stringify(objectOfObjectsNewReviews[key], null, 4)
            );
        }
    }

    console.log(
        "Actual New Reviews: " + JSON.stringify(actualNewReviews, null, 4)
    );
    console.log(
        "Updated reviewsTocData: " + JSON.stringify(reviewsTocData, null, 4)
    );

    // Update reviewsToc with new data

    // Add all latlongs to new reviews, and add empty parents
    for (const key in actualNewReviews) {
        actualNewReviews[key].LatLong = await addressToLatLong(
            actualNewReviews[key].Address
        );
        actualNewReviews[key].parents = [];
    }
    console.log(
        "Actual New Reviews with latlong: " +
            JSON.stringify(actualNewReviews, null, 4)
    );

    // Fetch listingsToc
    const listingsTocData = (
        await transaction.get(doc(firestore, "reference", "listings-toc"))
    ).data();
    console.log(
        "Listings toc: " + JSON.stringify(listingsTocData, null, 4)
    );

    // Use map of listing latLong to ID
    const latLongToIdMap = new Map();

    for (const [id, listing] of Object.entries(listingsTocData)) {
        const latLong = JSON.stringify(listing.latLong);
        latLongToIdMap.set(latLong, id);
    }

    for (const [key, value] of latLongToIdMap) {
        console.log(`${key} => ${value}`);
    }

    // For each new review, check if it has a correponding apartment
    // If so, update parent to remember review, and review to remember parent
    // Either way, write review in as a new doc
    for (const reviewKey in actualNewReviews) {
        const thisReviewLatLongString = JSON.stringify(
            actualNewReviews[reviewKey].LatLong
        );
        if (latLongToIdMap.has(thisReviewLatLongString)) {
            const matchingListingID = latLongToIdMap.get(
                thisReviewLatLongString
            );
            // 1. If found existing listing in listings toc, add listing ID to reviews' parents list
            actualNewReviews[reviewKey].parents.push(matchingListingID);
            matching.push(reviewKey)

            // 2. If found existing listing, also add review ID to parent listing's reviews list in actual listing document
            // a) get listing's data
            const listingDocRef = doc(
                firestore,
                "listings",
                matchingListingID
            );
            const listingSnapshot = await transaction.get(listingDocRef);
            const listingData = listingSnapshot.data();
            // b) Edit data to add
            if (!("reviews" in listingData)) {
                listingData.reviews = [];
            }
            listingData.reviews.push(reviewKey);
            // c) write the data again
            console.log(
                "Will write the following to listing " +
                    matchingListingID +
                    ": " +
                    JSON.stringify(listingData, null, 4)
            );
            await transaction.set(listingDocRef, listingData);
        } else {
            //orphan review
            console.warn(`Orphan review! ${reviewKey}`)
            newOrphans.push(reviewKey)
        }
        // Write doc
        console.log(
            "Will write following data to review doc with id " +
                reviewKey +
                ": " +
                JSON.stringify(actualNewReviews[reviewKey], null, 4)
        );
        reviewsTocData.orphans = reviewsTocData.orphans.concat(newOrphans)
        await transaction.set(doc(firestore,"reviews",reviewKey), actualNewReviews[reviewKey]);
        await transaction.set(reviewsTocRef, reviewsTocData);
        console.log("-------------- REPORT -------------- ")
        console.log(`${matching.length} Matching: ${matching} \n ${newOrphans.length} Orphans: ${newOrphans}`)
        if (duplicates.length > 0) {console.log(`${duplicates.length} Duplicates: ${duplicates}`)}
    }

});
} catch (error) {
    console.error("Transaction failed: ", error);
}
};

const cleanInvalidCharacters = (jsonString) => {
    // Define a regular expression to match invalid characters
    const cleanedJsonString = jsonString
        .split("")
        .filter((char) => {
            const charCode = char.charCodeAt(0);
            return (
                charCode === 9 ||
                (charCode >= 32 && charCode <= 126) ||
                (charCode >= 160 && charCode <= 1114111)
            );
        })
        .join("");

    return cleanedJsonString;
};

const getCurrentDateTime = () => {
    const now = new Date();
  
    // Get individual components of the date and time
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    // Create the formatted string
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
    return formattedDateTime;
  };

export {getCurrentDateTime}
export {processAndAddReview};
export {cleanInvalidCharacters};
