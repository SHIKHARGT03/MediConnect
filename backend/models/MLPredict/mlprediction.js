import mongoose from "mongoose";
import crypto from "crypto";

const mlPredictionSchema = new mongoose.Schema(
  {
    // 🔑 Unique ID for this AI screening session
    predictionId: {
      type: String,
      unique: true,
      required: true,
    },

    // 🏥 Hospital running the prediction
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },

    // 🧠 Disease name (diabetes, heart, stroke, etc.)
    disease: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },


    // 📥 Input features sent to ML model
    // Flexible because each disease has different parameters
    features: {
      type: Object,
      required: true,
    },

    // 🖼️ Image URL (for brain stroke)
    imageUrl: {
      type: String,
      default: null,
    },

    // 📊 Prediction result (example: High / Low / 0 / 1)
    result: {
      type: String,
      default: null,
    },

    // 📈 Confidence score returned by model
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },

    // 🤖 Model used (xgboost, randomforest, cnn, etc.)
    modelUsed: {
      type: String,
      default: null,
    },

    // 🔗 Optional booking reference (appointment / video / lab)
    bookingId: {
      type: String,
      default: null,
    },

    // 🔄 Lifecycle status of prediction
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },

    // 🕒 Error message if ML fails
    errorMessage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// 🔑 Auto-generate predictionId before validation
mlPredictionSchema.pre("validate", function (next) {
  if (!this.predictionId) {
    this.predictionId = crypto.randomBytes(6).toString("hex");
  }
  next();
});

const MLPrediction = mongoose.model("MLPrediction", mlPredictionSchema);
export default MLPrediction;
