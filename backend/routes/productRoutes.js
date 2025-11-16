// File: routes/productRoutes.js

const express = require('express');
const router = express.Router();
const { 
    getAllProducts, 
    getProductById,
    getProductsByCategory,
    createProduct, 
    updateProduct,
    deleteProduct
} = require('../controllers/productController'); // 👈 Import SEMUA fungsi
const { protect, seller } = require('../middleware/authMiddleware');

// Route Utama (Semua Produk & Tambah Produk)
router.route('/')
    .get(getAllProducts)    // GET /api/products
    .post(createProduct);   // POST /api/products

// Route Berdasarkan ID (Ambil, Update, Hapus 1 Produk)
router.route('/:id')
    .get(getProductById)    // GET /api/products/:id
    .put(updateProduct)     // PUT /api/products/:id
    .delete(deleteProduct); // DELETE /api/products/:id

// Route Berdasarkan Kategori
router.get('/category/:categoryId', getProductsByCategory); // GET /api/products/category/:categoryId
router.post('/', protect, seller, productController.createProduct);

module.exports = router;