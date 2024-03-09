// src/config/awsConfig.js
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

export const generateExternalImageId = (originalName) => {
    // Sanitize the original name to create a safe ExternalImageId
    return `${Date.now().toString()}-${originalName.replace(/[^a-zA-Z0-9_.\-:]/g, "_")}`;
};

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    key: function (req, file, cb) {
      const imageId = generateExternalImageId(file.originalname);
      req.imageId = imageId; // Save the imageId in the request for later use
      cb(null, `${imageId}`);
    },
  }),
});
