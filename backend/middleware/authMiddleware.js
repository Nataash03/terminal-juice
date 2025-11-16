// File: middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// Middleware untuk memverifikasi token dan mengidentifikasi user
const protect = async (req, res, next) => {
    let token;

    // 1. Cek token di header (Authorization: Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // 2. Verifikasi token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Ambil user tanpa password dan tambahkan ke req.user
            req.user = await User.findById(decoded.id).select('-password');
            
            // Lanjutkan ke controller
            next();

        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware untuk membatasi akses hanya untuk Seller
const seller = (req, res, next) => {
    // Cek user role yang sudah ditambahkan oleh middleware 'protect'
    if (req.user && req.user.role === 'seller') {
        next(); // Lanjutkan jika seller
    } else {
        res.status(403).json({ message: 'Not authorized as a seller' });
    }
};

module.exports = { protect, seller };