// File: routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /api/users/register (Sign Up)
router.post('/register', userController.registerUser); 

// POST /api/users/login (Sign In)
router.post('/login', userController.authUser); 

module.exports = router;