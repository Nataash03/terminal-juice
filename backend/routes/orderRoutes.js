const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Notification = require('../models/Notification'); 
const { protect } = require('../middleware/authMiddleware');
const Product = require('../models/Product');

// 1. POST /api/orders (Membuat Order Baru + Kirim Notifikasi Awal)
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Keranjang kosong' });
    }

    // Simpan Order ke Database
    const newOrder = new Order({
      user: req.user._id, 
      items,
      totalAmount,
      paymentMethod,
      notes, 
      status: paymentMethod === 'QRIS' ? 'Paid' : 'Pending'
    });

    const savedOrder = await newOrder.save();

    // OTOMATIS BUAT NOTIFIKASI
    if (req.user._id) {
        // Notif Payment Successful
        await Notification.create({
            user: req.user._id,
            title: 'Payment Successful', 
            message: `Payment of Rp ${totalAmount.toLocaleString('id-ID')} for order #${savedOrder._id.toString().slice(-6).toUpperCase()} has been received.`,
            type: 'success',
            isRead: false
        });

        // Notif Order Process
        await Notification.create({
            user: req.user._id,
            title: 'Your Order is being processed', 
            message: `Order #${savedOrder._id.toString().slice(-6).toUpperCase()} is in the kitchen.`,
            type: 'process',
            isRead: false
        });
    }

    res.status(201).json({ success: true, message: 'Order berhasil dibuat!', data: savedOrder });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Gagal membuat order: ' + error.message });
  }
});

// 2. GET /api/orders (Mengambil Riwayat Order User Login)
router.get('/', protect, async (req, res) => {
  try {
    let query = { user: req.user._id };
    if (req.user.role === 'seller') {
        // Seller melihat semua order yang valid (punya user ID)
        query = {}; 
    }
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Gagal ambil data' });
  }
});

// 3. PUT /api/orders/:id/status (Seller Update Status Order)
router.put('/:id/status', protect, async (req, res) => {
  try {
      const { status } = req.body;
      const orderId = req.params.id;

      const updatedOrder = await Order.findByIdAndUpdate(
          orderId, 
          { status: status }, 
          { new: true }
      );

      if (!updatedOrder) {
          return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });
      }

      // LOGIKA NOTIFIKASI
      if (updatedOrder.user) { 
          if (status === 'Ready') {
              await Notification.create({
                  user: updatedOrder.user, 
                  title: 'Your Order is Ready! 🥤',
                  message: `Order #${updatedOrder._id.toString().slice(-6).toUpperCase()} is ready!`,
                  type: 'ready',
                  isRead: false
              });
          }

          if (status === 'Completed') {
               await Notification.create({
                  user: updatedOrder.user,
                  title: 'Order Completed',
                  message: `Thank you for purchasing Order #${updatedOrder._id.toString().slice(-6).toUpperCase()}.`,
                  type: 'success',
                  isRead: false
              });
          }
      } 

      res.json({
          success: true,
          message: `Status updated to ${status}`,
          data: updatedOrder
      });

  } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ success: false, message: 'Gagal update status: ' + error.message });
  }
});

// 4. GET /api/orders/stats (Mengambil Statistik Penjualan Real-Time)
router.get('/stats', protect, async (req, res) => {
  try {
      if (req.user.role !== 'seller') {
          return res.status(403).json({ success: false, message: 'Akses ditolak.' });
      }

      // Hitung Total Sales 
      const totalSalesResult = await Order.aggregate([
          { 
              $match: { 
                  status: { $nin: ['Cancelled'] } 
              } 
          }, 
          {
              $group: {
                  _id: null,
                  totalSales: { $sum: "$totalAmount" }
              }
          }
      ]);

      // Hitung Total Orders 
      const totalOrders = await Order.countDocuments({});

      const totalProducts = await Product.countDocuments({});

      const totalSales = totalSalesResult.length > 0 ? totalSalesResult[0].totalSales : 0;

      res.json({
          success: true,
          data: {
              totalSales: totalSales,
              totalOrders: totalOrders,
              totalProducts: totalProducts
          }
      });

  } catch (error) {
      console.error('Stats Error:', error);
      res.status(500).json({ success: false, message: 'Gagal mengambil data statistik.' });
  }
});

// 5. GET /api/orders/top-selling (Mengambil Produk Terlaris berdasarkan Quantity)
router.get('/top-selling', protect, async (req, res) => {
  try {
      if (req.user.role !== 'seller') {
          return res.status(403).json({ success: false, message: 'Akses ditolak.' });
      }

      const topProducts = await Order.aggregate([
          { $unwind: "$items" },
          {
              $group: {
                  _id: "$items.id", 
                  totalQuantitySold: { $sum: "$items.quantity" }
              }
          },
          
          { $sort: { totalQuantitySold: -1 } },
          
          { $limit: 3 },
          
          {
              $lookup: {
                  from: "products", 
                  localField: "_id",
                  foreignField: "category", 
                  as: "productDetails"
              }
          },
          
          { $unwind: "$productDetails" },
          {
              $project: {
                  _id: 0,
                  productId: "$_id",
                  name: "$productDetails.name",
                  image: { $arrayElemAt: ["$productDetails.images", 0] }, 
                  totalSold: "$totalQuantitySold"
              }
          }
      ]);

      res.json({ success: true, data: topProducts });

  } catch (error) {
      console.error('Top Selling Error:', error);
      res.status(500).json({ success: false, message: 'Gagal mengambil data produk terlaris.' });
  }
});

module.exports = router;