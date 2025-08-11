import mongoose from 'mongoose';

const BookingRequestSchema = new mongoose.Schema({
  patientId: { type: String, required: true }, // <-- changed to String
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  testName: { type: String },
  department: { type: String },
  type: { type: String, enum: ['Appointment', 'LabTest'], required: true },
  date: { type: String, required: true },
  slot: { type: String, required: true }, // e.g. "10:00"
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const BookingRequest = mongoose.model('BookingRequest', BookingRequestSchema);
export default BookingRequest;
