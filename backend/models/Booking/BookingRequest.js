import mongoose from "mongoose";
import crypto from "crypto";

const bookingRequestSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
    },
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

// 🔑 Auto-generate bookingId before saving
bookingRequestSchema.pre("validate", function (next) {
  if (!this.bookingId) {
    this.bookingId = crypto.randomBytes(6).toString("hex"); // e.g. "a3f9c2d4e5b1"
  }
  next();
});

const BookingRequest = mongoose.model("BookingRequest", bookingRequestSchema);
export default BookingRequest;
