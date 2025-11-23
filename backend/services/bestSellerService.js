const Order = require('../models/Order'); 
const Product = require('../models/Product'); 

/**
 * Update Best Seller berdasarkan total penjualan
 */
const updateBestSellers = async (topN = 3, dayRange = 7) => {
  try {
    console.log('🔄 Starting Best Seller update...');
    
    // Hitung tanggal cutoff (30 hari terakhir)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - dayRange);
    
    // Hitung total penjualan per produk
    const topProducts = await Order.aggregate([
      // Filter order yang sudah completed dalam periode tertentu
      { 
        $match: { 
          status: { $in: ['completed', 'paid', 'delivered'] }, 
          createdAt: { $gte: cutoffDate }
        } 
      },
      
      { $unwind: '$items' },
      
      { 
        $group: { 
          _id: '$items.productId', 
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      
      { $sort: { totalSold: -1 } },
      
      { $limit: topN }
    ]);
    
    console.log(`📊 Found ${topProducts.length} best selling products`);
    
    if (topProducts.length === 0) {
      console.log('⚠️  No sales data found in the last ' + dayRange + ' days');
      return {
        success: true,
        updatedCount: 0,
        topProducts: [],
        message: 'No sales data available'
      };
    }
    
    // 1. Hapus semua tag 'best_seller' dari semua produk
    await Product.updateMany(
      {}, 
      { $pull: { tags: 'best_seller' } }
    );
    
    console.log('🗑️  Cleared all best_seller tags');
    
    // 2. Tambahkan tag 'best_seller' ke top products
    const topProductIds = topProducts.map(p => p._id);
    
    await Product.updateMany(
      { _id: { $in: topProductIds } },
      { $addToSet: { tags: 'best_seller' } }
    );
    
    console.log(`✅ Updated ${topProductIds.length} products as best sellers`);
    
    // Log detail produk best seller
    topProducts.forEach((p, index) => {
      console.log(`   ${index + 1}. Product ${p._id}: ${p.totalSold} sold, Rp ${p.totalRevenue.toLocaleString('id-ID')}`);
    });
    
    return {
      success: true,
      updatedCount: topProducts.length,
      topProducts,
      message: `Successfully updated ${topProducts.length} best sellers`
    };
    
  } catch (error) {
    console.error('❌ Error updating best sellers:', error);
    throw error;
  }
};

/**
 * Manual trigger untuk testing atau admin panel
 */
const manualUpdateBestSellers = async (req, res) => {
  try {
    const topN = parseInt(req.query.topN) || 10;
    const dayRange = parseInt(req.query.dayRange) || 30;
    
    const result = await updateBestSellers(topN, dayRange);
    
    res.json({
      success: true,
      message: result.message,
      data: {
        updatedCount: result.updatedCount,
        topProducts: result.topProducts,
        dayRange,
        topN
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update best sellers',
      error: error.message
    });
  }
};

module.exports = { 
  updateBestSellers,
  manualUpdateBestSellers 
};