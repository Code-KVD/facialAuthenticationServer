// src/routes/rekognitionRoutes.js
import express from 'express';
import { upload } from '../config/awsConfig.js'; // Your S3 Multer upload config
import { searchFacesByImage } from '../services/rekognitionService.js'; // Make sure this function is ready

const router = express.Router();

router.post('/authenticate', upload.single('image'), async (req, res) => {
    try {
        // Assuming the image is uploaded to S3, we'll use the file's key for Rekognition
        const imageName = req.imageId; // The key/name of the file in S3 bucket
        const bucketName = process.env.S3_BUCKET_NAME; // The name of your S3 bucket

        const searchResults = await searchFacesByImage(bucketName, imageName); // Adjust the searchFacesByImage function to take bucketName and imageName

        if (searchResults.FaceMatches && searchResults.FaceMatches.length > 0) {
            const match = searchResults.FaceMatches[0];
            res.status(200).json({
                message: "Authentication successful",
                matchDetails: match
            });
        } else {
            res.status(404).json({ message: "Authentication failed. No matching face found." });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: "Error during authentication process." });
    }
});

export default router;
