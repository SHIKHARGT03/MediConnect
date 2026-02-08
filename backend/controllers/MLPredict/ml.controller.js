import MLPrediction from "../../models/MLPredict/mlprediction.js";
import { predictDisease } from "../../services/ml.service.js";

import cloudinary from "../../config/cloudinary.js";

export const runMLPrediction = async (req, res) => {
  try {
    const { disease } = req.params;
    const { features, bookingId } = req.body;
    const hospitalId = req.user?.hospitalId || req.user?._id;
    if (!disease) {
      return res.status(400).json({ message: "Disease is required" });
    }
    if (!hospitalId) {
      return res.status(401).json({ message: "Hospital not authenticated" });
    }

    // Special handling for brain stroke (CNN image)
    if (disease === "brain_stroke") {
      // Accept file upload (PNG, DICOM, etc.)
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required for brain stroke prediction" });
      }
      // Upload to Cloudinary
      let uploadResult;
      try {
        uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "mediconnect/brain_stroke",
          resource_type: "auto",
        });
      } catch (err) {
        return res.status(500).json({ message: "Failed to upload image to Cloudinary", error: err.message });
      }
      // Save pending prediction
      const prediction = new MLPrediction({
        hospitalId,
        disease,
        features: { imageUrl: uploadResult.secure_url },
        imageUrl: uploadResult.secure_url,
        bookingId: bookingId || null,
        status: "pending",
      });
      await prediction.save();
      try {
        // Call ML service with image URL
        const mlResult = await predictDisease(disease, { imageUrl: uploadResult.secure_url });
        prediction.result = mlResult.prediction;
        // Convert confidence from percent (0-100) to float (0-1)
        prediction.confidence = mlResult.confidence > 1 ? mlResult.confidence / 100 : mlResult.confidence;
        prediction.modelUsed = "cnn";
        prediction.status = "completed";
        await prediction.save();
        return res.status(200).json({
          message: "Prediction completed successfully",
          predictionId: prediction.predictionId,
          disease,
          result: prediction.result,
          confidence: prediction.confidence,
          modelUsed: prediction.modelUsed,
          imageUrl: prediction.imageUrl,
        });
      } catch (mlError) {
        prediction.status = "failed";
        prediction.errorMessage = mlError.message;
        await prediction.save();
        return res.status(503).json({ message: "ML prediction failed", error: mlError.message });
      }
    }

    // Default: tabular disease (diabetes, heart, etc.)
    if (!features || typeof features !== "object") {
      return res.status(400).json({ message: "Valid features object is required" });
    }
    const prediction = new MLPrediction({
      hospitalId,
      disease,
      features,
      bookingId: bookingId || null,
      status: "pending",
    });
    await prediction.save();
    try {
      const mlResult = await predictDisease(disease, features);
      prediction.result = mlResult.prediction === 1 ? "High" : "Low";
      prediction.confidence = mlResult.confidence;
      prediction.modelUsed = "xgboost";
      prediction.status = "completed";
      await prediction.save();
      return res.status(200).json({
        message: "Prediction completed successfully",
        predictionId: prediction.predictionId,
        disease,
        result: prediction.result,
        confidence: prediction.confidence,
        modelUsed: prediction.modelUsed,
      });
    } catch (mlError) {
      prediction.status = "failed";
      prediction.errorMessage = mlError.message;
      await prediction.save();
      return res.status(503).json({ message: "ML prediction failed", error: mlError.message });
    }
  } catch (error) {
    console.error("Error running ML prediction:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
