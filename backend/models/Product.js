// File: models/Product.js (Revisi)

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Product slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true // 👈 Peningkatan: Optimasi pencarian/URL
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false
  },
  images: [{ // Array of Strings untuk URL Gambar
    type: String
  }],
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Product', productSchema, 'products'); // 👈 Peningkatan: Menjamin nama collection 'products'