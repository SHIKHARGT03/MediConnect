import express from 'express';
import {
  createBookingRequest,
  getAllBookingRequests,
  getBookingsForHospital,
  getBookingsForPatient,
  updateBookingStatus
} from '../../controllers/Booking/bookingController.js';

const router = express.Router();

// Create new booking
router.post('/', createBookingRequest);

// Get all bookings
router.get('/', getAllBookingRequests);

// Get bookings for hospital
router.get('/hospital/:id', getBookingsForHospital);

// Get bookings for patient
router.get('/patient/:id', getBookingsForPatient);

// Update booking status (accept/reject)
router.put('/:id/status', updateBookingStatus);

export default router;
