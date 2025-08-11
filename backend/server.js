// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth/authRoutes.js';
import hospitalRoutes from './routes/Hospital&Doctor/hospitalRoutes.js';
import doctorRoutes from './routes/Hospital&Doctor/doctorRoutes.js';
import bookingRoutes from './routes/Booking/bookingRoutes.js';

dotenv.config();
connectDB(); // MongoDB connection

const app = express();

// ✅ Updated CORS setup with credentials
app.use(cors({
  origin: function (origin, callback) {
    // Allow any localhost origin, regardless of port
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/bookings', bookingRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('MediConnect backend is running ✅');
});

// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});


