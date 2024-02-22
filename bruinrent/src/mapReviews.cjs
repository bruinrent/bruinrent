const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("/Users/vikrampuliyadi/Downloads/bruinrent-116e4-firebase-adminsdk-pcymb-ba487ddcc9.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Access Firestore
const db = admin.firestore();

const fetchReviewsForSubmissionIDs = async () => {
    try {
        // Query all documents from the test_csv collection
        const snapshot = await db.collection("test_csv").get();

        // Iterate through each document
        snapshot.forEach(async (doc) => {
            const reviews = doc.data().reviews; // Get the array of submission IDs from the 'reviews' field
            if (!reviews || reviews.length === 0) {
                console.log("No reviews found for this document.");
                return;
            }

            // Iterate through each submission ID in the reviews array
            for (const submissionID of reviews) {
                try {
                    // Fetch the corresponding review from the reviews collection
                    const reviewDoc = await db
                        .collection("reviews")
                        .doc(submissionID)
                        .get();
                    if (reviewDoc.exists) {
                        const review = reviewDoc.data().Review; // Assuming 'review' is the field name for the review
                        console.log("Review:", review);
                    } else {
                        console.log(
                            `Review not found for submission ID: ${submissionID}`
                        );
                    }
                } catch (error) {
                    console.log("Error fetching review:", error);
                }
            }
        });
    } catch (error) {
        console.log("Error fetching documents:", error);
    }
};

// Call the function to fetch reviews for submission IDs
fetchReviewsForSubmissionIDs();
