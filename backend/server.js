// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth/authRoutes.js";
import hospitalRoutes from "./routes/Hospital&Doctor/hospitalRoutes.js";
import doctorRoutes from "./routes/Hospital&Doctor/doctorRoutes.js";
import bookingRoutes from "./routes/Booking/bookingRoutes.js";
import prescriptionRoutes from "./routes/Prescription/prescriptionRoutes.js";
import mlPredictRoutes from "./routes/MLPredict/MLPredictRoute.js";


import { initSocket } from "./socket/index.js";

dotenv.config();
connectDB();

const app = express();

/**
 * --------------------
 * Middleware
 * --------------------
 */
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow all localhost ports
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/**
 * --------------------
 * Routes
 * --------------------
 */
app.use("/api/auth", authRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/prescription", prescriptionRoutes);
app.use("/api/ml", mlPredictRoutes);


// Health check
app.get("/", (req, res) => {
  res.send("MediConnect backend is running ✅");
});

/**
 * --------------------
 * HTTP + Socket Server
 * --------------------
 */
const PORT = process.env.PORT || 5000;

// Create raw HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Start listening
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO ready for connections`);
});
