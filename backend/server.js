// 1. Load dotenv 
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 2. Load Semua Route
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes'); 
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const subscribeRoutes = require('./routes/subscribeRoutes');
const { setupBestSellerScheduler } = require('./utils/scheduler');
const { manualUpdateBestSellers } = require('./services/bestSellerService');
const reviewRoutes = require('./routes/reviewRoutes'); 

// 3. Inisialisasi
const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;
const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');

// 4. Middleware
app.use(cors({
  origin: frontendUrl, 
  credentials: true 
}));
app.use(express.json());

// 5. Definisikan Route 
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/reviews', reviewRoutes);

// Route Best Seller 
app.post('/api/admin/update-best-sellers', manualUpdateBestSellers);

// 6. Koneksi ke MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Koneksi ke MongoDB Berhasil!');
  } catch (error) {
    console.error('❌ Koneksi ke MongoDB Gagal:', error.message);
    process.exit(1);
  }
};

// 7. Jalankan Koneksi dan Server
connectDB().then(() => {
  setupBestSellerScheduler();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  });
});