const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    // --- PERBAIKAN: Menambahkan field Username ---
    username: {
        type: String,
        required: true,
        unique: true, // Username juga harus unik
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    role: {
        type: String,
        enum: ['user', 'seller'],
        default: 'user',
    },
    // Tambahan opsional untuk profil lengkap nanti
    phone: { type: String, default: '' },
    address: { type: String, default: '' }
}, { timestamps: true });

// Middleware Hash Password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);