const Order = require('../models/Order');
const Notification = require('../models/Notification'); 
const Product = require('../models/Product'); 

// 1. CREATE ORDER (Buat Pesanan Baru)
const addOrderItems = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, note } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Keranjang kosong' });
    }

    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      paymentMethod,
      note, 
      status: paymentMethod === 'QRIS' ? 'Paid' : 'Pending'
    });

    const savedOrder = await order.save();

    // Notifikasi
    if (req.user._id) {
        await Notification.create({
            user: req.user._id,
            title: 'Order Received', 
            message: `Order #${savedOrder._id.toString().slice(-6).toUpperCase()} berhasil dibuat.`,
            type: 'success',
            isRead: false
        });
    }

    res.status(201).json({ success: true, data: savedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET MY ORDERS (History User)
const getMyOrders = async (req, res) => {
    try {
      let query = { user: req.user._id };
      if (req.user.role === 'seller') {
          query = {}; 
      }
      const orders = await Order.find(query).sort({ createdAt: -1 });
      res.json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

// 3. UPDATE STATUS (Seller Update: Ready/Completed)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        // Kirim notif ke user
        if (order.user) {
             if (status === 'Ready') {
                await Notification.create({
                    user: order.user,
                    title: 'Order Ready 🔔',
                    message: `Pesanan #${order._id.toString().slice(-6).toUpperCase()} siap diambil/dikirim!`,
                    type: 'ready'
                });
             }
        }

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getOrderStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments().catch(() => 0); 
        
        const salesData = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        
        res.json({
            success: true,
            data: {
                totalSales: salesData[0]?.total || 0,
                totalOrders,
                totalProducts
            }
        });
    } catch (error) {
        res.json({ success: true, data: { totalSales: 0, totalOrders: 0, totalProducts: 0 } });
    }
};

const getTopSelling = async (req, res) => {
    try {
        const top = await Order.aggregate([
            { $unwind: "$items" },
            { $group: { _id: "$items.id", sold: { $sum: "$items.quantity" }, name: { $first: "$items.name" }, image: { $first: "$items.imageSrc" } } },
            { $sort: { sold: -1 } },
            { $limit: 3 }
        ]);
        
        // Map biar formatnya enak dibaca frontend
        const formattedTop = top.map(t => ({
            productId: t._id,
            name: t.name,
            image: t.image,
            totalSold: t.sold
        }));

        res.json({ success: true, data: formattedTop });
    } catch (error) {
        res.json({ success: true, data: [] }); 
    }
};

module.exports = {
    addOrderItems,
    getMyOrders,
    updateOrderStatus,
    getOrderStats,  
    getTopSelling   
};