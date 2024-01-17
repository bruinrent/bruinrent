const admin = require("firebase-admin");

// Initialize Firebase Admin SDK with your service account key
const serviceAccount = require("/Users/vikrampuliyadi/Downloads/bruinrent-116e4-firebase-adminsdk-pcymb-ba487ddcc9.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Get a reference to the Firestore collection
const db = admin.firestore();
const collectionRef = db.collection("listings");

async function revertImages() {
    try {
        // Get all documents in the 'listings' collection
        const snapshot = await collectionRef.get();

        // Iterate through each document
        snapshot.forEach(async (doc) => {
            // Check if the document has 'imageUrls' field
            const data = doc.data();
            if (data.imageUrls && Array.isArray(data.imageUrls)) {
                // Remove the "_680x680" suffix from each URL
                const updatedImageUrls = data.imageUrls.map((url) => {
                    // Replace the "_680x680" with an empty string
                    const updatedUrl = url.replace(/_680x680\./, ".");

                    // Log the update
                    console.log(`Original URL: ${url}`);
                    console.log(`Updated URL: ${updatedUrl}`);

                    return updatedUrl;
                });

                // Uncomment the following line when you are ready to apply the update
                await doc.ref.update({ imageUrls: updatedImageUrls });
                console.log(
                    `Updated image URLs for document with ID: ${doc.id}`
                );
            }
        });

        console.log("Finished updating image URLs.");
    } catch (error) {
        console.error("Error updating image URLs:", error);
    }
}

// Call the function to remove the suffix from all image URLs
revertImages();
