import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/auth/userModel.js';
import generateToken from '../../utils/generateToken.js';


// @desc    Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields (name, email, password, role) are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const token = generateToken(newUser._id, newUser.role);

    return res.status(201).json({
      patientId: newUser._id, // ✅ Added for frontend
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token,
    });

  } catch (error) {
    console.error("🔥 Error during registration:", error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Login user
export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ message: 'User not found. Please sign up.' });
    }

    console.log("✅ User found:", user.email);
    console.log("➡️  Role sent:", role, " | Role in DB:", user.role);

    if (user.role !== role) {
      console.log("❌ Role mismatch");
      return res.status(403).json({ message: `Access denied. This user is not a ${role}.` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔐 Password match result:", isMatch);

    if (!isMatch) {
      console.log("❌ Invalid password");
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken(user._id, user.role);
    console.log("✅ Token generated");

    res.status(200).json({
      patientId: user._id, // ✅ Added for frontend
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("🔥 Server error during login:", error);
    res.status(500).json({ message: 'Server error during login' });
  }
};


// @desc    Logout user
// @route   POST /api/auth/logout
export const logoutUser = (req, res) => {
  res.status(200).json({ message: 'User logged out successfully (clear token on frontend)' });
};