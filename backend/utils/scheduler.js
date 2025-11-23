const cron = require('node-cron');
const { updateBestSellers } = require('../services/bestSellerService');

/**
 * Setup scheduler untuk update best seller otomatis
 */
const setupBestSellerScheduler = () => {
  
  // Jalankan setiap hari jam 02:00 WIB (saat traffic rendah)
  // Format: '0 2 * * *' = menit jam hari bulan hari_minggu
  cron.schedule('0 2 * * *', async () => {
    console.log('⏰ Running scheduled best seller update...');
    try {
      await updateBestSellers(3, 7); 
      console.log('✅ Scheduled best seller update completed');
    } catch (error) {
      console.error('❌ Scheduled best seller update failed:', error);
    }
  }, {
    timezone: "Asia/Jakarta" // Sesuaikan timezone
  });
  
  console.log('📅 Best Seller scheduler initialized (runs daily at 02:00 WIB)');
};

module.exports = { setupBestSellerScheduler };