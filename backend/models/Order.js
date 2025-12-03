const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  items: [
    {
      id: { type: String }, 
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      imageSrc: { type: String }
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  
  // [FIX] Sesuai frontend kamu: 'note' (tunggal)
  note: { 
    type: String,
    default: '' 
  },

  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Processing', 'Ready', 'Completed', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true }); 

module.exports = mongoose.model('Order', orderSchema);