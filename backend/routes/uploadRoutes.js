const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { protect } = require('../middleware/authMiddleware'); 

const router = express.Router();

// 1. Konfigurasi Cloudinary (Ambil dari .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Setup Multer (Gunakan MemoryStorage)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Helper: Validasi Tipe File 
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(file.originalname.toLowerCase().split('.').pop());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only! (jpg, jpeg, png, webp)'));
  }
}

// 3. Helper: Upload dari RAM ke Cloudinary via Stream
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: "terminal-juice", 
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    // Mengalirkan data dari Buffer (RAM) ke Cloudinary
    streamifier.createReadStream(buffer).pipe(cld_upload_stream);
  });
};

// 4. Endpoint Utama (POST /api/upload)
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Proses Upload ke Cloud
    const result = await uploadFromBuffer(req.file.buffer);

    // Sukses! Kembalikan URL Gambar ke Frontend
    res.json({
      success: true,
      message: 'Image uploaded to Cloudinary!',
      filePath: result.secure_url, 
    });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ 
        success: false, 
        message: 'Upload failed: ' + (error.message || error) 
    });
  }
});

module.exports = router;