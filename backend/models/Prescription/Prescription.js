import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
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
    fileUrl: {
      type: String,
      required: true,
    },
    filePublicId: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["pdf", "jpg"],
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
