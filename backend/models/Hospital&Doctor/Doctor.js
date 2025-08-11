// models/Doctor.js
import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  degrees: {
    type: [String],
    default: []
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  languages: {
    type: [String], 
    required: true
  },  
  bio: {
    type: String,
    default: ""
  }
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
