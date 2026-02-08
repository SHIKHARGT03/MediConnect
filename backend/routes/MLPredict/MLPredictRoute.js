import express from "express";
import { runMLPrediction } from "../../controllers/MLPredict/ml.controller.js";
import { protect } from "../../middleware/auth/authMiddleware.js";
import upload from "../../middleware/upload/fileUpload.js";

const router = express.Router();

/**
 * @route   POST /api/ml/:disease/predict
 * @desc    Run ML prediction for a disease
 * @access  Hospital (Protected)
 */
// Use multer only for brain_stroke
router.post("/:disease/predict", (req, res, next) => {
	if (req.params.disease === "brain_stroke") {
		upload.single("image")(req, res, (err) => {
			if (err) {
				return res.status(400).json({ message: err.message });
			}
			next();
		});
	} else {
		next();
	}
}, protect, runMLPrediction);

export default router;
