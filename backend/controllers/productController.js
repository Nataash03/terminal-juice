const Product = require('../models/Product');
const { determineCategory } = require('../config/categoryMap'); 
const slugify = require('slugify'); 

// @desc    Ambil semua produk
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).populate('category').populate('seller');
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Ambil satu produk by ID (Buat Form Edit)
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
                                .populate('category')
                                .populate('seller'); 

    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }
  } catch (error) {
    if (error.name === 'CastError') {
        return res.status(400).json({ success: false, message: 'ID Produk tidak valid.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Tambah Produk Baru
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, images } = req.body;
    
    // 1. Validasi Dasar
    if (!name || !price || !stock) {
      return res.status(400).json({ success: false, message: 'Nama, harga, dan stok wajib diisi.' });
    }

    // 2. Buat Slug Otomatis
    const productSlug = slugify(name, { lower: true, strict: true });

    // 3. Tentukan Kategori ID Otomatis
    const categoryId = determineCategory(name); 

    const product = new Product({
      name,
      description,
      price,
      stock,
      images, 
      category: categoryId, 
      seller: req.user._id,  
      isActive: true, 
      slug: productSlug, 
    });

    const createdProduct = await product.save();
    res.status(201).json({ success: true, data: createdProduct });
  } catch (error) {
    console.error('Product Creation Error:', error);
    res.status(500).json({ success: false, message: 'Gagal membuat produk: ' + error.message });
  }
};

// @desc    Update Produk
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, images } = req.body;
    
    // Siapkan objek update, hanya update yang ada di body
    const updateFields = { name, description, price, stock, images };
    
    if (name) {
        updateFields.slug = slugify(name, { lower: true, strict: true });
    }
    
    const product = await Product.findByIdAndUpdate(
        req.params.id, 
        updateFields, 
        { new: true, runValidators: true } 
    );

    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }
  } catch (error) {
    console.error('Product Update Error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengupdate produk: ' + error.message });
  }
};

// @desc    Hapus Produk
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });

    if (result.deletedCount > 0) {
      res.json({ success: true, message: 'Produk berhasil dihapus' });
    } else {
      res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export semua fungsi
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};