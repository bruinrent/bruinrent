const fs = require("fs");
const csv = require("csv-parser");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("/Users/vikrampuliyadi/Downloads/bruinrent-116e4-firebase-adminsdk-pcymb-ba487ddcc9.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Access Firestore
const db = admin.firestore();

const filePath = "./reviews.csv"; // Update with your CSV file path

const initializeDocuments = async () => {
    try {
        // Read the CSV file to get unique addresses
        const uniqueAddresses = new Set();
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                const { "Apartment Address": address } = row;
                uniqueAddresses.add(address);
            })
            .on("end", async () => {
                // Initialize documents for each unique address
                for (const address of uniqueAddresses) {
                    const docRef = db.collection("test_csv").doc();
                    await docRef.set({
                        reviews: [],
                        address: address, // Add address field
                        addressDesc: "", // Initialize other fields to empty strings
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
                        latLong: [],
                        checkedApartmentFeatureLabels: [],
                        checkedBuildingFeatureLabels: [],
                        imageUrls: [
                            "https://firebasestorage.googleapis.com/v0/b/bruinrent-116e4.appspot.com/o/more%20images%2Fhousewbackground.png?alt=media&token=b7878b3f-836b-481a-ac63-008bc8007696",
                        ],
                    });
                    console.log(`Initialized document for ${address}`);
                }
                console.log("Finished initializing documents.");
                // Process the CSV file to update reviews
                processCSV();
            });
    } catch (error) {
        console.log("Error initializing documents.", error);
    }
};

const processCSV = async () => {
    try {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", async (row) => {
                const {
                    "Submission ID": submissionID,
                    "Apartment Address": address,
                } = row;

                const querySnapshot = await db
                    .collection("test_csv")
                    .where("address", "==", address)
                    .get();
                querySnapshot.forEach(async (doc) => {
                    await doc.ref.update({
                        reviews:
                            admin.firestore.FieldValue.arrayUnion(submissionID),
                    });
                    console.log(`Updated reviews for ${address}`);
                });
            })
            .on("end", () => {
                console.log("Finished processing the CSV file.");
            });
    } catch (error) {
        console.log("Error processing CSV file.", error);
    }
};
// Initialize documents first, then process the CSV file
initializeDocuments();
