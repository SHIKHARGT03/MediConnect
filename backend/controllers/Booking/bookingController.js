import BookingRequest from "../../models/Booking/BookingRequest.js";
import User from "../../models/auth/userModel.js";
import moment from "moment";

/**
 * @desc    Create a new booking request
 * @route   POST /api/bookings
 * @access  Public (or Protected if using auth)
 */
export const createBookingRequest = async (req, res) => {
  try {
    let patientId = null;

    if (req.user && req.user._id) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      patientId = user.patientId;
    } else if (req.body.patientId) {
      const user = await User.findOne({ patientId: req.body.patientId });
      patientId = user ? user.patientId : null;
    }

    if (!patientId) {
      return res.status(400).json({ message: "Missing or invalid patientId" });
    }

    const { hospitalId, type, doctorName, testName, department, date, time } =
      req.body;

    if (!hospitalId || !type || !department || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res
        .status(400)
        .json({ message: "Invalid date format (YYYY-MM-DD required)" });
    }

    const newBooking = new BookingRequest({
      patientId,
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
 * @desc    Get booking by bookingId
 * @route   GET /api/bookings/:bookingId
 * @access  Public (patient or hospital)
 */
export const getBookingById = async (req, res) => {
  try {
    const booking = await BookingRequest.findOne({
      bookingId: req.params.bookingId,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking by bookingId:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Update booking status (pending → accepted/rejected)
 * @route   PUT /api/bookings/:bookingId/status
 * @access  Hospital Dashboard
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await BookingRequest.findOne({
      bookingId: req.params.bookingId,
    });

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

/**
 * @desc    Get upcoming bookings for a patient
 * @route   GET /api/bookings/patient/:patientId/upcoming
 * @access  Visitor Dashboard
 */
export const getUpcomingBookingsForPatient = async (req, res) => {
  try {
    const today = moment().format("YYYY-MM-DD");
    const bookings = await BookingRequest.find({
      patientId: req.params.patientId,
      date: { $gte: today },
    }).sort({ date: 1, time: 1 });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching upcoming bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get past bookings for a patient
 * @route   GET /api/bookings/patient/:patientId/past
 * @access  Visitor Dashboard
 */
export const getPastBookingsForPatient = async (req, res) => {
  try {
    const today = moment().format("YYYY-MM-DD");
    const bookings = await BookingRequest.find({
      patientId: req.params.patientId,
      date: { $lt: today },
    }).sort({ date: -1, time: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching past bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Create a follow-up booking (same details +7 days)
 * @route   POST /api/bookings/:bookingId/followup
 * @access  Visitor Dashboard
 */
export const createFollowUpBooking = async (req, res) => {
  try {
    const booking = await BookingRequest.findOne({
      bookingId: req.params.bookingId,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ✅ Calculate next week's date safely
    const currentDate = moment(booking.date, "YYYY-MM-DD");
    if (!currentDate.isValid()) {
      return res.status(400).json({ message: "Invalid original booking date" });
    }

    const newDate = currentDate.add(7, "days").format("YYYY-MM-DD");

    const followUpBooking = new BookingRequest({
      patientId: booking.patientId,
      hospitalId: booking.hospitalId,
      type: booking.type,
      doctorName: booking.doctorName,
      testName: booking.testName,
      department: booking.department,
      date: newDate,
      time: booking.time,
      status: "pending",
    });

    await followUpBooking.save();

    res.status(201).json({
      message: "Follow-up booking created successfully",
      booking: followUpBooking,
    });
  } catch (error) {
    console.error("Error creating follow-up booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getHospitalScheduleOverview = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    // Use string dates for consistency (YYYY-MM-DD)
    const today = moment().format("YYYY-MM-DD");
    const oneWeekAgo = moment().subtract(7, "days").format("YYYY-MM-DD");

    // Count accepted appointments for today
    const todayCount = await BookingRequest.countDocuments({
      hospitalId,
      status: "accepted",
      date: today,
    });

    // Count accepted appointments from last 7 days (excluding today)
    const pastWeekCount = await BookingRequest.countDocuments({
      hospitalId,
      status: "accepted",
      date: { $gte: oneWeekAgo, $lt: today },
    });

    // Total scheduled (for hero display)
    const totalAccepted = await BookingRequest.countDocuments({
      hospitalId,
      status: "accepted",
    });

    res.status(200).json({
      todayCount,
      pastWeekCount,
      totalAccepted,
    });
  } catch (error) {
    console.error("Error fetching hospital overview:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getHospitalScheduleBookings = async (req, res) => {
  try {
    const hospitalId = req.params.hospitalId;
    const { type, department, dateRange, patientId } = req.query;

    let filter = {
      hospitalId,
      status: "accepted",
    };

    // Optional filters
    if (type && type !== "All") filter.type = type;
    if (department && department !== "All") filter.department = department;
    if (patientId) filter.patientId = patientId;

    // Date filters (use string comparison)
    const todayStr = moment().format("YYYY-MM-DD");
    if (dateRange === "Today" || !dateRange) {
      filter.date = { $gte: todayStr };
    } else if (dateRange === "Last7Days") {
      filter.date = { $gte: moment().subtract(7, "days").format("YYYY-MM-DD") };
    } else if (dateRange === "Last30Days") {
      filter.date = { $gte: moment().subtract(30, "days").format("YYYY-MM-DD") };
    } else if (dateRange === "Last3Months") {
      filter.date = { $gte: moment().subtract(90, "days").format("YYYY-MM-DD") };
    }

    const bookings = await BookingRequest.find(filter).sort({
      date: -1,
      time: 1,
    });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
