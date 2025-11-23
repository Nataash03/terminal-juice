const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, 
    ref: 'User'     
  },
  
  // Array item yang dibeli
  items: [
    {
      id: { type: String, required: true }, 
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
    default: '', 
  },

  // Status pesanan
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Processing', 'Ready', 'Completed', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true }); 

module.exports = mongoose.model('Order', orderSchema);