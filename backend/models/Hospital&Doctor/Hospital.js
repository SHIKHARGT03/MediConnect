// models/Hospital.js
import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  hasLab: {
    type: Boolean,
    default: false
  },
  departments: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    default: ""
  },
  contact: {
    type: String,
    default: ""
  }
  
}, { timestamps: true });

const Hospital = mongoose.model('Hospital', hospitalSchema);
export default Hospital;
