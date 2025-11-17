// File: controllers/userController.js

const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// 🚫 Hapus atau pastikan tidak ada lagi SELLER_NAMES di sini.

// @desc    Register a new user (Sign Up)
// @route   POST /api/users/register
exports.registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;
    
    // Cek apakah user sudah ada
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    
    // 💡 PERUBAHAN UTAMA: Semua pengguna baru diinisialisasi sebagai 'buyer'
    const role = 'buyer'; 

    try {
        const user = await User.create({ fullName, email, password, role }); 

        if (user) {
            res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role, 
                token: generateToken(user._id, user.role), 
            });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid user data', error: error.message });
    }
};

// @desc    Auth user & get token (Sign In)
// @route   POST /api/users/login
exports.authUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role, 
            token: generateToken(user._id, user.role), 
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// 🌟 FITUR BARU: Upgrade Role ke Seller
// @desc    Upgrade user role from 'buyer' to 'seller'
// @route   PUT /api/users/upgrade-to-seller
// @access  Private (membutuhkan token)
exports.upgradeToSeller = async (req, res) => {
    // req.user didapatkan dari middleware 'protect'
    const user = await User.findById(req.user._id); 

    if (user) {
        // Hanya izinkan jika role saat ini adalah 'buyer'
        if (user.role === 'buyer') {
            user.role = 'seller'; // Ubah role
            const updatedUser = await user.save(); // Simpan perubahan ke database

            // Generate token baru dengan role 'seller'
            res.json({
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                role: updatedUser.role, // Sekarang 'seller'
                message: 'Role upgraded successfully to seller.',
                token: generateToken(updatedUser._id, updatedUser.role), 
            });
        } else {
            // Jika user sudah seller
            res.status(400).json({ message: 'User is already a seller.' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};


// @desc    Get user profile (Hanya bisa diakses oleh user yang sudah login)
// @route   GET /api/users/profile
// @access  Private (membutuhkan token)
exports.getUserProfile = async (req, res) => {
    // Data user sudah tersedia di req.user dari middleware 'protect'
    const user = await User.findById(req.user._id).select('-password'); 

    if (user) {
        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone || '', 
            address: user.address || '', 
            role: user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// Pastikan semua fungsi diexport
// module.exports = { registerUser, authUser, getUserProfile, upgradeToSeller };