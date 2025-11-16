// File: routes/productRoutes.js

const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

// Import middleware
const { protect, seller } = require('../middleware/authMiddleware');

// 1. ROUTE KHUSUS ADMIN (Seller Dashboard)
router.get('/admin', protect, seller, productController.getAllProducts); 

// 2. Route Berdasarkan Kategori (Spesifik)
// 🚨 PERBAIKAN: Tambahkan productController.
router.get('/category/:categoryId', productController.getProductsByCategory); 

// 3. Route Utama (Root)
router.route('/')
    .get(productController.getAllProducts)    // GET /api/products (Public - Shop All)
    .post(protect, seller, productController.createProduct);   // POST /api/products (Private)

// 4. Route Berdasarkan ID (Parameter - HARUS DI PALING BAWAH)
router.route('/:id')
    // 🚨 PERBAIKAN: Tambahkan productController.
    .get(productController.getProductById)    // GET /api/products/:id (Public - Detail)
    .put(protect, seller, productController.updateProduct)     // PUT /api/products/:id (Private)
    .delete(protect, seller, productController.deleteProduct); // DELETE /api/products/:id (Private)

module.exports = router;