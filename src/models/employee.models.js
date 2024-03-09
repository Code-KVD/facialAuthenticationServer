import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
    trim: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  referenceImage: {
    type: String, // Storing the path to the image file or URL if hosted externally
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;