// File: utils/generateToken.js (Modifikasi)

const jwt = require('jsonwebtoken');

// 🚨 Tambahkan parameter role
const generateToken = (id, role) => { 
    // Masukkan ID dan ROLE ke dalam payload token
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { 
        expiresIn: '30d', 
    });
};

module.exports = generateToken;