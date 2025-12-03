const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true,
  },
  author: {
    type: String, // Nama user
    required: true,
  },
  role: {
    type: String,
    default: 'Verified Buyer', 
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);