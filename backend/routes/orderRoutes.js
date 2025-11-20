const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); 

// POST /api/orders (Nanti prefix '/api/orders' diatur di server.js)
router.post('/', async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod } = req.body;

    // Validasi
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Keranjang kosong' });
    }

    const newOrder = new Order({
      items,
      totalAmount,
      paymentMethod,
      status: paymentMethod === 'QRIS' ? 'Paid' : 'Pending'
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({ 
      success: true, 
      message: 'Order berhasil dibuat!', 
      data: savedOrder 
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal membuat order: ' + error.message 
    });
  }
});

module.exports = router;