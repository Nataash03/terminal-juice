const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register User
const registerUser = async (req, res) => {
  // Ambil username juga dari body
  const { fullName, username, email, password } = req.body;

  try {
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Mohon isi semua field' });
    }

    // Cek duplikasi email ATAU username
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email atau Username sudah terdaftar' });
    }

    // Create User
    const user = await User.create({
      fullName,
      username, // Sekarang ini akan tersimpan karena Schema sudah diperbaiki
      email,
      password, // Password akan di-hash otomatis oleh middleware di User.js
    });

    if (user) {
      // --- PERBAIKAN FORMAT RESPON ---
      res.status(201).json({
        success: true, // PENTING untuk frontend
        user: {
          _id: user.id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Data user tidak valid' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login User
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // --- PERBAIKAN FORMAT RESPON ---
      res.json({
        success: true, // PENTING untuk frontend
        user: {
          _id: user.id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Email atau password salah' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Profile
const getUserProfile = async (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      user: {
        _id: req.user._id,
        fullName: req.user.fullName,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        address: req.user.address
      }
    });
  } else {
    res.status(404).json({ success: false, message: 'User tidak ditemukan' });
  }
};

// @desc    Upgrade to Seller
// @desc    Upgrade to Seller
const upgradeToSeller = async (req, res) => {
  try {
    const { secretCode } = req.body; // Ambil kode rahasia dari frontend
    const userId = req.user ? req.user._id : req.body.userId;
    
    // Cek Kode Rahasia
    if (secretCode !== process.env.SELLER_UPGRADE_CODE) {
        // Jika kode salah, langsung tolak dengan status 403 (Forbidden)
        return res.status(403).json({ success: false, message: 'Kode verifikasi Seller salah.' });
    }
    
    const user = await User.findByIdAndUpdate(
        userId, 
        { role: 'seller' }, 
        { new: true }
    ).select('-password');

    if (user) {
      res.json({
        success: true,
        message: 'Berhasil menjadi Seller!',
        user: user
      });
    } else {
      res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  upgradeToSeller,
};