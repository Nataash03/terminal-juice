const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  // Array item yang dibeli
  items: [
    {
      id: { type: String, required: true }, // ID produk (bisa string/ObjectId)
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
  // Status pesanan
  status: {
    type: String,
    default: 'Pending', // Default-nya Pending dulu
    enum: ['Pending', 'Paid', 'Completed', 'Cancelled']
  },
  // Tanggal pesanan dibuat
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);