const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendOTPEmail = require('../utils/sendEmail');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Store OTPs temporarily in memory
const otpStore = {};

// @POST /api/auth/send-otp
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

    await sendOTPEmail(email, otp);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, otp } = req.body;

    // Verify OTP
    const record = otpStore[email];
    if (!record) return res.status(400).json({ message: 'OTP not sent. Please request OTP first.' });
    if (Date.now() > record.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }
    if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone, address });
    delete otpStore[email];

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    if (req.body.password) user.password = req.body.password;
    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      role: updated.role,
      token: generateToken(updated._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { sendOTP, register, login, getProfile, updateProfile };