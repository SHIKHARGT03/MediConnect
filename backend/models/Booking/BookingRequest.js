import mongoose from "mongoose";

const bookingRequestSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    type: {
      type: String,
      enum: ["appointment", "labTest"],
      required: true,
    },
    doctorName: {
      type: String,
      default: null,
    },
    testName: {
      type: String,
      default: null,
    },
    department: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD required)"],
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const BookingRequest = mongoose.model("BookingRequest", bookingRequestSchema);
export default BookingRequest;
