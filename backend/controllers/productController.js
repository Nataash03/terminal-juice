const Product = require('../models/Product');
const { determineCategory } = require('../config/categoryMap'); 

// @desc    Ambil semua produk
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    // Gunakan populate untuk mengambil detail kategori (nama, slug, dll)
    const products = await Product.find({}).populate('category');
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Ambil satu produk by ID (Buat Form Edit)
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    // Gunakan populate juga untuk detail produk
    const product = await Product.findById(req.params.id).populate('category');
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
    const { name, description, price, stock, images } = req.body;
    
    // 1. Validasi Dasar
    if (!name || !price || !stock) {
      return res.status(400).json({ success: false, message: 'Nama, harga, dan stok wajib diisi.' });
    }

    // 2. Tentukan Kategori ID Otomatis
    const categoryId = determineCategory(name); 

    const product = new Product({
      name,
      description,
      price,
      stock,
      images, 
      category: categoryId, // ID KATEGORI OTOMATIS
      seller: req.user._id,  // SIMPAN ID SELLER DARI TOKEN
      isActive: true, // Default aktif
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
    
    // Gunakan findByIdAndUpdate untuk kemudahan dan menghindari error validasi
    const product = await Product.findByIdAndUpdate(
        req.params.id, 
        { name, description, price, stock, images },
        { new: true, runValidators: true } // Return data baru & jalankan validasi
    );

    if (product) {
      res.json({ success: true, data: product });
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
    // Menggunakan deleteOne untuk memastikan penghapusan
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
  cleanupOldProducts // <--- TAMBAHKAN INI DI EXPORT
};