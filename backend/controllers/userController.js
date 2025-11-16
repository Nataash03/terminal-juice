// File: controllers/userController.js (Buat file ini)

const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Daftar nama yang otomatis menjadi 'seller'
const SELLER_NAMES = [
    "Natasya Agustine", 
    "Patricia Natania", 
    "Jessica Winola", 
    "Lyvia Reva Ruganda",
    "Admin"
];

// @desc    Register a new user (Sign Up)
// @route   POST /api/users/register
exports.registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;
    
    // Cek apakah user sudah ada
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    
    // 1. Tentukan Role
    let role = 'buyer'; // Default buyer
    if (SELLER_NAMES.includes(fullName)) {
        role = 'seller'; // Jika nama cocok, jadikan seller
    }

    try {
        const user = await User.create({ fullName, email, password, role }); // 🚨 Simpan role

        if (user) {
            res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role, // 🚨 Kirim role di response
                token: generateToken(user._id, user.role), // 🚨 Generate token dengan role
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
            role: user.role, // 🚨 Kirim role
            token: generateToken(user._id, user.role), // 🚨 Generate token dengan role
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
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
            phone: user.phone || '', // Tambahkan field opsional jika ada
            address: user.address || '', // Tambahkan field opsional jika ada
            role: user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// ... (Jangan lupa export)
// module.exports = { registerUser, authUser, getUserProfile };