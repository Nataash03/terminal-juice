const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// --- 1. IMPORT SATPAM ---
const { protect } = require('../middleware/authMiddleware');

// Route Public
router.post('/register', userController.registerUser);
router.post('/login', userController.authUser);

// Route Private (Cek apakah 'protect' sudah ada di sini?)
router.get('/profile', protect, userController.getUserProfile);
router.put('/upgrade-to-seller', protect, userController.upgradeToSeller);

module.exports = router;