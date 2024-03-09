// It is the first step as soon as we run the program all the evironment variables should be available for every file.
import dotenv from "dotenv";
import AWS from "aws-sdk";
// give the full file name with extension to import connectDB.
import connectDB from "./db/index.js";
import app from "./app.js";
import { createCollection } from './services/rekognitionService.js';

dotenv.config({
    path : './env'
})

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const COLLECTION_ID = process.env.AWS_COLLECTION_ID;

connectDB().then(() => {
    // Attempt to create the collection after the database connection is established
    createCollection(COLLECTION_ID).then(() => {
        console.log(`Collection ${COLLECTION_ID} creation attempted (if it does not already exist).`);
        
        // Start the server after attempting to create the collection
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}.`);
        });
    }).catch(error => {
        console.error('Error creating collection:', error);
    });
}).catch(error => {
    console.error('Error connecting to the database:', error);
});