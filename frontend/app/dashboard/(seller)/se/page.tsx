"use client";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import styles from './SellerDashboard.module.css';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

interface SalesStats { totalSales: number; totalOrders: number; totalProducts: number; }

interface TopProduct {
    productId: string;
    name: string;
    image: string;
    totalSold: number;
}

export default function SellerDashboard() {
  const [stats, setStats] = useState<SalesStats>({ totalSales: 0, totalOrders: 0, totalProducts: 0 });
  const [loading, setLoading] = useState(true);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  
  // --- STATE BARU UNTUK SYNC BEST SELLER ---
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Helper untuk format rupiah
  const formatRupiah = (amount: number) => {
    return 'Rp ' + (amount || 0).toLocaleString('id-ID', { minimumFractionDigits: 0 });
  };
  
  // Hitung angka penjualan tertinggi (untuk menentukan lebar progress bar)
  const maxSold = topProducts.length > 0 ? topProducts[0].totalSold : 1; 

  useEffect(() => {
    const fetchStats = async () => {
      const token = Cookies.get('token');
      if (!token) return;

      try {
        // Fetch Statistik Penjualan
        const statsResponse = await fetch(`${baseUrl}/api/orders/stats`, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        const statsResult = await statsResponse.json();
        if (statsResult.success) setStats(statsResult.data);
        
        // Fetch Top Selling Products
        const topResponse = await fetch(`${baseUrl}/api/orders/top-selling`, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        const topResult = await topResponse.json();
        if (topResult.success) setTopProducts(topResult.data);

      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  
  // --- HANDLER SYNC BEST SELLER ---
  const handleSyncBestSeller = async () => {
    const token = Cookies.get('token');
    if (!token) {
      setSyncMessage('❌ Unauthorized');
      return;
    }

    setSyncing(true);
    setSyncMessage('');

    try {
      const response = await fetch(`${baseUrl}/api/admin/update-best-sellers`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();

      if (result.success) {
        setSyncMessage(`✅ ${result.message} (${result.data.updatedCount} products)`);
        
        // Optional: Refresh data setelah sync
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setSyncMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncMessage('❌ Failed to sync best sellers');
    } finally {
      setSyncing(false);
    }
  };

  const productsCount = 55;
  const growth = '+20%';

  if (loading) return <div style={{ padding: 60, textAlign: 'center' }}>Loading Real-time Data...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 className={styles.title}>Sales Dashboard</h2>
        
        {/* TOMBOL SYNC BEST SELLER */}
        <button 
          onClick={handleSyncBestSeller}
          disabled={syncing}
          style={{
            padding: '10px 20px',
            backgroundColor: syncing ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: syncing ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          {syncing ? '⏳ Syncing...' : '🔄 Sync Best Seller'}
        </button>
      </div>
      
      {/* PESAN HASIL SYNC */}
      {syncMessage && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          backgroundColor: syncMessage.includes('✅') ? '#d4edda' : '#f8d7da',
          color: syncMessage.includes('✅') ? '#155724' : '#721c24',
          borderRadius: '6px',
          fontSize: '14px'
        }}>
          {syncMessage}
        </div>
      )}
      
      {/* Kartu Statistik */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.value}>{formatRupiah(stats.totalSales)}</div>
          <div className={styles.label}>Total Sales</div>
        </div>
        <div className={styles.card}>
          <div className={styles.value}>{stats.totalOrders}</div>
          <div className={styles.label}>Total Orders</div>
        </div>
        <div className={styles.card}>
          <div className={styles.value}>{stats.totalProducts}</div> 
          <div className={styles.label}>Jumlah Produk</div>
        </div>
        <div className={styles.card}>
          <div className={styles.value}>{growth}</div>
          <div className={styles.label}>Growth</div>
        </div>
      </div>
      
      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '30px 0' }} />

      <h2 className={styles.title}>Top selling products</h2>
      <div className={styles.productList}>
        {topProducts.map((product) => (
            <div key={product.productId} className={styles.productRow}>
                <img 
                    src={product.image || '/images/placeholder-jus.jpg'} 
                    alt={product.name} 
                    className={styles.prodImg} 
                    style={{ objectFit: 'cover' }}
                />
                
                <div className={styles.progressContainer}>
                  <span>{product.name} ({product.totalSold} sold)</span>
                  <div className={styles.progressBar}>
                    <div 
                        className={styles.progressFill} 
                        style={{width: `${(product.totalSold / maxSold) * 100}%`}}
                    ></div>
                  </div>
                </div>
            </div>
        ))}
        {topProducts.length === 0 && (
            <p style={{color:'#888', textAlign:'center', marginTop:20}}>Belum ada penjualan tercatat.</p>
        )}
      </div>
      
      <div style={{ marginTop: 20, fontSize: '13px', color: '#888' }}>
        💡 Tip: Klik "Sync Best Seller" untuk memperbarui produk Best Seller di halaman Shop berdasarkan data penjualan terbaru.
      </div>
    </div>
  );
}