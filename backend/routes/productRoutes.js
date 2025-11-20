const express = require('express');
const router = express.Router();

// Import Controller (Pastikan path-nya benar)
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// --- DEFINISI ROUTE ---

// GET All & POST New
router.route('/')
  .get(getProducts)      // <-- Ini yang tadi error "undefined"
  .post(createProduct);

// GET One, PUT Update, DELETE Remove
router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;