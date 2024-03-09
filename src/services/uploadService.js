import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the __dirname equivalent by using fileURLToPath and dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // The directory should exist or you should create it before attempting to upload files
    callback(null, path.join(__dirname, '../../public/temp')); // Adjust the path as needed, considering the new __dirname
  },
  filename: function (req, file, callback) {
    // Create a unique file name
    callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Initialize multer with the defined storage
const upload = multer({ storage: storage });

export default upload;
