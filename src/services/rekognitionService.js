// rekognitionService.js
import AWS from 'aws-sdk';
import fs from 'fs/promises'; // Make sure to import fs from 'fs/promises'

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const rekognition = new AWS.Rekognition();

// Function to create a collection in AWS Rekognition
const createCollection = async (collectionId) => {
  const params = {
    CollectionId: collectionId,
  };

  try {
    // First, check if the collection already exists
    const listCollections = await rekognition.listCollections({}).promise();
    if (listCollections.CollectionIds.includes(collectionId)) {
      console.log(`Collection ${collectionId} already exists.`);
      return; // Stop here if the collection exists
    }

    // If it doesn't exist, create the collection
    await rekognition.createCollection(params).promise();
    console.log(`Collection ${collectionId} created successfully.`);
  } catch (error) {
    console.error(`Error with collection ${collectionId}:`, error);
  }
};

// Function to add or index a face to the collection
const indexFace = async (bucket, photo, collectionId) => {
  console.log("error!!!");
  const params = {
    CollectionId: collectionId,
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: photo
      }
    },
    ExternalImageId: photo,
    DetectionAttributes: ['ALL']
  };

  try {
    const response = await rekognition.indexFaces(params).promise();
    console.log(`Face indexed in collection ${collectionId}:`, response);
    return response;
  } catch (error) {
    console.error(`Error indexing face in collection ${collectionId}:`, error);
    throw error;
  }
};

export const authenticateFace = async (imageBuffer) => {
  const params = {
    CollectionId: `${process.env.AWS_COLLECTION_ID}`, // Replace with your actual collection ID
    Image: { Bytes: imageBuffer },
    MaxFaces: 1,
    FaceMatchThreshold: 70 // Adjust based on your requirements
  };

  try {
    const response = await rekognition.searchFacesByImage(params).promise();
    return response; // The response will include details of the matched faces
  } catch (error) {
    console.error('Error during face authentication:', error);
    throw error;
  }
};

// src/services/rekognitionService.js
export const searchFacesByImage = async (bucketName, imageName) => {
  const params = {
      CollectionId: process.env.AWS_COLLECTION_ID, // Ensure this is set in your environment
      Image: {
          S3Object: {
              Bucket: bucketName,
              Name: imageName
          },
      },
      MaxFaces: 1,
      FaceMatchThreshold: 70 // Adjust as needed
  };

  try {
      const response = await rekognition.searchFacesByImage(params).promise();
      return response; // Contains details of the matched faces, if any
  } catch (error) {
      console.error('Error searching faces by image:', error);
      throw error;
  }
};
// Export the additional functions
export {createCollection, indexFace };
