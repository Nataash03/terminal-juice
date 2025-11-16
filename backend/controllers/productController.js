const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      // 💡 TAMBAHKAN .populate('category', 'name slug') DI SINI!
      .populate('category', 'name slug') 
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug description');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by category',
      error: error.message
    });
  }
};

// @desc    Create new product (Sign Up)
// @route   POST /api/products
// @access  Private (Seller only)
exports.createProduct = async (req, res) => {
  // Ambil semua data yang dikirim dari frontend form
  const { name, slug, description, price, stock, images } = req.body;
  
  // 🚨 Validasi dasar
  if (!name || !slug || !price) {
    return res.status(400).json({
      success: false,
      message: 'Name, slug, price are required fields.'
    });
  }

  try {
    // Cek apakah slug sudah ada (karena harus unique)
    const slugExists = await Product.findOne({ slug });
    if (slugExists) {
        return res.status(400).json({ success: false, message: 'Product slug already exists. Please choose a different name.' });
    }

    const product = new Product({
        name, 
        slug, 
        price, 
        stock, 
        description: description || 'No description provided.',
        // Menggunakan array images yang dikirim dari form (URL teks)
        images: images || ['/images/placeholder.jpg'] 
    });
    
    const savedProduct = await product.save();
    
    // Populate category info setelah save (penting untuk frontend)
    await savedProduct.populate('category', 'name slug');
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct
    });
  } catch (error) {
    // Menangkap error validasi Mongoose lainnya (misalnya, Category ID salah format)
    res.status(400).json({
      success: false,
      message: 'Failed to create product due to validation error.',
      error: error.message
    });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Update jika ada nilai baru yang dikirim
    if (req.body.name) {
        product.name = req.body.name;
    }
    
    // Jika tidak ada perubahan nama produk, JANGAN set product.slug
    if (req.body.slug && req.body.slug !== product.slug) {
        product.slug = req.body.slug;
    }
    
    // Price dan Stock: Wajib konversi ke Number, lalu update
    if (req.body.price !== undefined) {
        product.price = Number(req.body.price);
    }
    if (req.body.stock !== undefined) {
        product.stock = Number(req.body.stock);
    }

    if (req.body.images) product.images = req.body.images;
    if (req.body.description) product.description = req.body.description;
    if (req.body.category) product.category = req.body.category;
    
    // SIMPAN
    const updatedProduct = await product.save();

    await updatedProduct.populate('category', 'name slug');

    res.json({ success: true, message: 'Product updated successfully', data: updatedProduct });

  } catch (error) {
    // 🚨 Tambahkan logging untuk melihat error sebenarnya
    console.error("Update Product Failed:", error.message); 
    
    // Penanganan khusus untuk Duplicate Key Error
    if (error.code === 11000) {
        return res.status(400).json({ success: false, message: 'Gagal update: Slug sudah digunakan produk lain.' });
    }
    
    res.status(400).json({ success: false, message: 'Failed to update product (Validation Error)', error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

