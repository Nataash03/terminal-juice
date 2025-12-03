const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import Controller
const { 
    addOrderItems, 
    // Import fungsi lain juga: getMyOrders, updateOrderStatus, dll
    getMyOrders,
    updateOrderStatus,
    getOrderStats,
    getTopSelling
} = require('../controllers/orderController');

// 1. Jalur Utama (Create & Get)
router.route('/')
    .post(protect, addOrderItems) // <--- Ini akan panggil controller yang support 'note'
    .get(protect, getMyOrders);

// 2. Jalur Seller
router.get('/stats', protect, getOrderStats);
router.get('/top-selling', protect, getTopSelling);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;