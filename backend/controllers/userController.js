// backend/controllers/userController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// --- Helper: Fungsi bikin Token JWT ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token berlaku 30 hari
  });
};

// @desc    Register User Baru
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  // 1. Ambil semua data termasuk fullName
  const { fullName, username, email, password } = req.body;

  try {
    // 2. Cek kelengkapan data
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: 'Mohon isi semua field (Full Name, Username, Email, Password)' });
    }

    // 3. Cek apakah email sudah terdaftar?
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // 4. Enkripsi Password (Hashing)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Buat User Baru
    const user = await User.create({
      fullName, // ✅ Pastikan ini masuk ke database
      username,
      email,
      password: hashedPassword,
      // Role otomatis 'user' dari default Schema, jadi tidak perlu ditulis
    });

    // 6. Kirim Respon Sukses & Token
    if (user) {
      res.status(201).json({
        _id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role, 
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Data user tidak valid' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login User (Auth)
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Cari user berdasarkan email
    const user = await User.findOne({ email });

    // 2. Cek password cocok gak?
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email atau password salah' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ambil Profil User
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  // req.user didapat dari middleware protect
  if (req.user) {
    res.json({
      _id: req.user._id,
      fullName: req.user.fullName,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
    });
  } else {
    res.status(404).json({ message: 'User tidak ditemukan' });
  }
};

// @desc    Upgrade user biasa jadi Seller
// @route   PUT /api/users/upgrade-to-seller
// @access  Private
const upgradeToSeller = async (req, res) => {
  try {
    // Ambil ID dari token (req.user) ATAU dari body (kalau testing manual tanpa token)
    const userId = req.user ? req.user._id : req.body.userId;

    const user = await User.findByIdAndUpdate(
        userId, 
        { role: 'seller' }, 
        { new: true } // Return data baru setelah update
    );

    if (user) {
      res.json({
        success: true,
        message: 'Berhasil menjadi Seller!',
        user: {
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            role: user.role // Sekarang jadi 'seller'
        }
      });
    } else {
      res.status(404).json({ message: 'User tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  upgradeToSeller,
};