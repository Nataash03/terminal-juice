// File: routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Import seluruh controller
const { protect } = require('../middleware/authMiddleware');

// --- Public Routes (Tidak butuh login) ---

// POST /api/users/register (Sign Up)
router.post('/register', userController.registerUser); 

// POST /api/users/login (Sign In)
router.post('/login', userController.authUser); 

// --- Private Routes (Membutuhkan Token/Login dengan middleware 'protect') ---

// GET /api/users/profile
router.get('/profile', protect, userController.getUserProfile);

// 🌟 RUTE BARU: PUT /api/users/upgrade-to-seller
// Digunakan untuk mengubah role pengguna dari 'buyer' menjadi 'seller'
router.put('/upgrade-to-seller', protect, userController.upgradeToSeller);

module.exports = router;