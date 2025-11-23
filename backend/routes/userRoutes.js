const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

// Route Public
router.post('/register', userController.registerUser);
router.post('/login', userController.authUser);

// Route Private 
router.get('/profile', protect, userController.getUserProfile);
router.put('/upgrade-to-seller', protect, userController.upgradeToSeller);

module.exports = router;