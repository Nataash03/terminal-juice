// 1. Load dotenv (WAJIB PALING ATAS)
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 2. Load Semua Route (Setelah dotenv selesai)
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes'); 
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const subscribeRoutes = require('./routes/subscribeRoutes');

// 3. Inisialisasi
const app = express();
const PORT = process.env.PORT || 5001; // Ganti 3000 ke 5001 agar tidak konflik dengan Frontend
const MONGO_URI = process.env.MONGO_URI;


// 4. Middleware
app.use(cors());
app.use(express.json());


// 5. Koneksi ke MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Koneksi ke MongoDB Berhasil!');
    } catch (error) {
        console.error('❌ Koneksi ke MongoDB Gagal:', error.message);
        process.exit(1);
    }
};

// 6. Definisikan Route 
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/subscribe', subscribeRoutes);


// 7. Jalankan Koneksi dan Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
});