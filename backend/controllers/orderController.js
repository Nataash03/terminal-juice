// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
      // PENTING: Harus ada { user: req.user._id } biar cuma ambil order milik dia sendiri
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
      
      res.json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  module.exports = {
    addOrderItems,
    getMyOrders, 
};