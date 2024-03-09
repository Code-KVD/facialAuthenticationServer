import express from 'express';
import Employee from '../models/employee.models.js'; // Adjust the path as necessary
import { upload, generateExternalImageId } from '../config/awsConfig.js';
import { indexFace } from '../services/rekognitionService.js';

const router = express.Router();


// POST route to create a new employee
router.post('/employees', upload.single('image'), async (req, res) => {
    try {
      const { employeeName, employeeId, department } = req.body;
      const referenceImage = req.file.location; // S3 URL of the uploaded image
      const imageId = req.imageId; // Use the imageId generated during upload
  
      const newEmployee = new Employee({
        employeeName,
        employeeId,
        department,
        referenceImage,
      });
  
      const savedEmployee = await newEmployee.save();
  
      // Index the face using the imageId
      await indexFace(process.env.S3_BUCKET_NAME, imageId, process.env.AWS_COLLECTION_ID);
  
      res.status(201).json(savedEmployee);
    } catch (error) {
      console.error('Error while creating a new employee:', error);
      res.status(400).json({ message: error.message });
    }
  });


router.get('/employees', async (req, res) => {
  try {
      const employees = await Employee.find();
      res.json(employees);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Route to fetch a single employee by ID
router.get('/employees/:id', async (req, res) => {
  try {
      // Ensure the ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).json({ message: 'Invalid employee ID' });
      }

      const employee = await Employee.findById(req.params.id);

      if (employee) {
          res.json(employee);
      } else {
          res.status(404).json({ message: 'Employee not found' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// PUT route to update an employee by ID
router.put('/employees/:id', async (req, res) => {
  try {
      const { employeeName, employeeId, department, referenceImage } = req.body;
      const employeeToUpdate = await Employee.findById(req.params.id);

      if (!employeeToUpdate) {
          return res.status(404).json({ message: 'Employee not found' });
      }

      // Update the employee's properties
      employeeToUpdate.employeeName = employeeName || employeeToUpdate.employeeName;
      employeeToUpdate.employeeId = employeeId || employeeToUpdate.employeeId;
      employeeToUpdate.department = department || employeeToUpdate.department;
      employeeToUpdate.referenceImage = referenceImage || employeeToUpdate.referenceImage;

      const updatedEmployee = await employeeToUpdate.save();
      res.json(updatedEmployee);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});


// DELETE route to delete an employee by ID
router.delete('/employees/:id', async (req, res) => {
  try {
      const employee = await Employee.findByIdAndDelete(req.params.id);
      if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
      }
      res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

export default router;
