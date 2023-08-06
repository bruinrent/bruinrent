import fs from "fs";
import Papa from "papaparse";
import { firestore } from "./firebase.js";
import { collection, addDoc } from "firebase/firestore";

const collectionName = "apartments"; // Change this to the desired collection name
const csvFilePath = "./apartments.csv";

const processData = (data) => {
    const { Address, Bedrooms } = data;
    // console.log("Data to be added:", data);
    return addDoc(collection(firestore, collectionName), { Address, Bedrooms });
    
};


fs.readFile(csvFilePath, "utf-8", (err, fileData) => {
    if (err) {
        console.error("Error reading the CSV file:", err);
        return;
    }

    Papa.parse(fileData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            const promises = results.data.map((row) => processData(row));

            Promise.all(promises)
                .then(() => {
                    console.log("All documents added successfully!");
                    process.exit(0); // Close the script after importing data
                })
                .catch((error) => {
                    console.error("Error adding documents: ", error);
                    process.exit(1);
                });
        },
        error: (error) => {
            console.error("Error parsing the CSV file:", error);
            process.exit(1);
        },
    });
});
