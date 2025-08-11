import BookingRequest from '../../models/Booking/BookingRequest.js';

// Create booking
export const createBookingRequest = async (req, res) => {
  console.log("📩 Incoming booking request:", JSON.stringify(req.body, null, 2));

  try {
    const booking = new BookingRequest(req.body);
    await booking.save();
    console.log("✅ Booking saved successfully:", booking._id);
    res.status(201).json(booking);
  } catch (error) {
    console.error("❌ Booking save error:", error.message);

    if (error.name === "ValidationError") {
      const missingFields = Object.keys(error.errors);
      const details = missingFields.map(f => ({
        field: f,
        message: error.errors[f].message
      }));
      console.error("⚠️ Missing or invalid fields:", details);
      return res.status(400).json({
        error: 'Failed to create booking request',
        missingFields: details
      });
    }

    res.status(400).json({ error: 'Failed to create booking request' });
  }
};

// Get all bookings (admin/test)
export const getAllBookingRequests = async (req, res) => {
  try {
    const bookings = await BookingRequest.find()
      .populate('hospitalId', 'name')
      .populate('doctorId', 'name department');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all bookings' });
  }
};

// Get bookings for hospital
export const getBookingsForHospital = async (req, res) => {
  try {
    const bookings = await BookingRequest.find({ hospitalId: req.params.id })
      .populate('doctorId', 'name department');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hospital bookings' });
  }
};

// Get bookings for patient
export const getBookingsForPatient = async (req, res) => {
  try {
    const bookings = await BookingRequest.find({ patientId: req.params.id })
      .populate('hospitalId', 'name')
      .populate('doctorId', 'name department');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patient bookings' });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await BookingRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update booking status' });
  }
};
