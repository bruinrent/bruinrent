const admin = require("firebase-admin");

// Initialize Firebase Admin SDK with your service account key
const serviceAccount = require("/Users/vikrampuliyadi/Downloads/bruinrent-116e4-firebase-adminsdk-pcymb-ba487ddcc9.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Get a reference to the Firestore collection
const db = admin.firestore();
const collectionRef = db.collection("listings");

async function updateImageUrls() {
    try {
        // Get all documents in the 'listings' collection
        const snapshot = await collectionRef.get();

        // Iterate through each document
        snapshot.forEach(async (doc) => {
            // Get the data of the document
            const data = doc.data();

            // Check if the document has 'imageUrls' field
            if (data.imageUrls && Array.isArray(data.imageUrls)) {
                // Map over each URL and log the update before applying
                const updatedImageUrls = data.imageUrls.map((url) => {
                    // Extract the filename from the URL
                    const filename = url.split("/").pop();

                    // Insert '_680x680' before the file extension
                    const updatedFilename = filename.replace(
                        /\.(?=[^.]+$)/,
                        "_680x680."
                    );

                    // Replace the original filename with the updated filename
                    const updatedUrl = url.replace(filename, updatedFilename);

                    // Log the update
                    console.log(`Original URL: ${url}`);
                    console.log(`Updated URL: ${updatedUrl}`);

                    return updatedUrl;
                });

                // Optionally, you can log the changes for the entire document
                // console.log(`Original Document Data: ${JSON.stringify(data)}`);
                // console.log(
                //     `Updated Document Data: ${JSON.stringify({
                //         ...data,
                //         imageUrls: updatedImageUrls,
                //     })}`
                // );

                // Uncomment the following line when you are ready to apply the updates
                await doc.ref.update({ imageUrls: updatedImageUrls });
                console.log(
                    `Updated image URLs for document with ID: ${doc.id}`
                );
            }
        });

        console.log("Finished printing image URLs.");
    } catch (error) {
        console.error("Error printing image URLs:", error);
    }
}

// Call the function to print image URLs
updateImageUrls();
