const Product = require('../models/Product');

// @desc    Ambil semua produk
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Ambil satu produk by ID (Buat Form Edit)
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Tambah Produk Baru
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, images, category } = req.body;
    
    const product = new Product({
      name,
      description,
      price,
      stock,
      images, // Asumsi array string URL
      category // ID Category atau String
    });

    const createdProduct = await product.save();
    res.status(201).json({ success: true, data: createdProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Produk
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, images } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.stock = stock || product.stock;
      product.images = images || product.images;

      const updatedProduct = await product.save();
      res.json({ success: true, data: updatedProduct });
    } else {
      res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Hapus Produk
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ success: true, message: 'Produk berhasil dihapus' });
    } else {
      res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ JANGAN LUPA BAGIAN INI: Export semua fungsi
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};