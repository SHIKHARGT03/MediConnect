import BookingRequest from "../../models/Booking/BookingRequest.js";
import User from "../../models/auth/userModel.js";

/**
 * @desc    Create a new booking request
 * @route   POST /api/bookings
 * @access  Public (or Protected if using auth)
 */
export const createBookingRequest = async (req, res) => {
  try {
    // You must have authentication middleware that sets req.user._id
    // If not, fallback to patientId from body (for now)
    let patientId = null;
    if (req.user && req.user._id) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      patientId = user.patientId; // Always use the generated patientId
    } else if (req.body.patientId) {
      // fallback for unauthenticated requests (not recommended)
      const user = await User.findOne({ patientId: req.body.patientId });
      patientId = user ? user.patientId : null;
    }

    if (!patientId) {
      return res.status(400).json({ message: "Missing or invalid patientId" });
    }

    const {
      hospitalId,
      type,
      doctorName,
      testName,
      department,
      date,
      time,
    } = req.body;

    // Validate required fields
    if (!hospitalId || !type || !department || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res
        .status(400)
        .json({ message: "Invalid date format (YYYY-MM-DD required)" });
    }

    const newBooking = new BookingRequest({
      patientId, // always the generated one
      hospitalId,
      type,
      doctorName: doctorName || null,
      testName: testName || null,
      department,
      date,
      time,
      status: "pending",
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking request created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Get all booking requests (admin/debug)
 * @route   GET /api/bookings
 * @access  Admin
 */
export const getAllBookingRequests = async (req, res) => {
  try {
    const bookings = await BookingRequest.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get bookings by hospital ID
 * @route   GET /api/bookings/hospital/:hospitalId
 * @access  Hospital Dashboard
 */
export const getBookingsForHospital = async (req, res) => {
  try {
    const bookings = await BookingRequest.find({
      hospitalId: req.params.hospitalId,
    }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching hospital bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get bookings by patient ID
 * @route   GET /api/bookings/patient/:patientId
 * @access  Visitor Dashboard
 */
export const getBookingsForPatient = async (req, res) => {
  try {
    const bookings = await BookingRequest.find({
      patientId: req.params.patientId,
    }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching patient bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Update booking status (pending → accepted/rejected)
 * @route   PUT /api/bookings/:id/status
 * @access  Hospital Dashboard
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await BookingRequest.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = req.body.status || booking.status;
    await booking.save();

    res.json({
      message: "Booking status updated",
      booking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
