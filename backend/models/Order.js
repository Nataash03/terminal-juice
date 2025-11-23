const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // Wajib ada user-nya
    ref: 'User'     // Referensi ke tabel User
  },
  
  // Array item yang dibeli
  items: [
    {
      id: { type: String, required: true }, // ID produk
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      imageSrc: { type: String }
    }
  ],

  // Total harga
  totalAmount: {
    type: Number,
    required: true
  },

  // Metode pembayaran
  paymentMethod: {
    type: String,
    required: true,
    enum: ['QRIS', 'Cash']
  },

  notes: {
    type: String,
    default: '', // Boleh kosong
  },

  // Status pesanan
  status: {
    type: String,
    // Daftar status yang diizinkan. Pastikan 'Ready' ada di sini!
    enum: ['Pending', 'Paid', 'Processing', 'Ready', 'Completed', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true }); // Opsi ini otomatis membuat field createdAt dan updatedAt

module.exports = mongoose.model('Order', orderSchema);