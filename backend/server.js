// 1. Load dependencies
require('dotenv').config(); // Untuk memuat variabel dari .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes'); // Import User Routes

// 2. Inisialisasi Aplikasi Express
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// 3. Middleware (untuk saat ini, kita hanya butuh untuk parsing JSON)
app.use(express.json());
app.use(cors());

// 4. Koneksi ke MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Koneksi ke MongoDB Berhasil!');
    } catch (error) {
        console.error('❌ Koneksi ke MongoDB Gagal:', error.message);
        // Hentikan proses jika gagal
        process.exit(1);
    }
};

// 5. Definisikan Route Sederhana (untuk pengujian server)
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// 6. Jalankan Koneksi dan Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
});