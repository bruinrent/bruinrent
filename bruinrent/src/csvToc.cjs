const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("/Users/vikrampuliyadi/Downloads/bruinrent-116e4-firebase-adminsdk-pcymb-ba487ddcc9.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Access Firestore
const db = admin.firestore();

async function createCsvTocCollection() {
    try {
        const testCsvCollection = db.collection("test_csv"); // Accessing the Firestore collection using db
        const testCsvDocs = await testCsvCollection.get(); // Using .get() to retrieve documents

        const csvTocData = {};
        testCsvDocs.forEach((doc) => {
            const data = doc.data();
            csvTocData[doc.id] = {
                address: data.address || "",
                rent1: data.rent1 || "",
                bedrooms: data.bedrooms || "",
                bathroom: data.baths || "",
                latLong: data.latLong || "",
                imageUrls: data.imageUrls ? [data.imageUrls[0]] : [],
            };
        });

        const csvTocCollection = db.collection("reference").doc("csv-toc"); // Accessing the "csv-toc" document in "reference" collection
        await csvTocCollection.set(csvTocData); // Setting the document data

        console.log("CSV TOC collection created successfully.");
    } catch (error) {
        console.error("Error creating CSV TOC collection:", error);
    }
}

// Call the function to create the CSV TOC collection
createCsvTocCollection();
