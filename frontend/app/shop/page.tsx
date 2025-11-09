// frontend/app/shop/page.tsx
'use client'; // Gunakan client component jika ada interaksi seperti filter/slider

import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard'; // Asumsi ProductCard sudah ada
import { getProducts, JuiceProduct } from '../services/product.service'; // Ambil data produk
import styles from './ShopPage.module.css'; // Asumsi CSS untuk halaman shop all sudah dibuat

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<JuiceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('Best Seller'); // State untuk filter

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div style={{padding: '100px', textAlign: 'center'}}>Loading products...</div>;
  }

  if (error) {
    return <div style={{padding: '100px', textAlign: 'center', color: 'red'}}>{error}</div>;
  }

  // Logika filter (contoh sederhana)
  const filteredProducts = products.filter(product => {
    if (activeFilter === 'Best Seller') {
      // Implementasi logika "Best Seller" di sini, misalnya berdasarkan rating/jumlah terjual
      return true; // Untuk sementara tampilkan semua
    }
    // Tambahkan logika untuk filter lain jika diperlukan
    return true; 
  });

  return (
    <div className={styles.shopPageContainer}>
      {/* Bagian "Discover our range" */}
      <section className={styles.productRangeSection}>
        <div className={styles.rangeHeader}>
          <h2 className={styles.rangeTitle}>
            <span className={styles.discoverItalic}>Discover</span> our range -
          </h2>
          <div className={styles.filterButtons}>
            <button 
              className={`${styles.filterButton} ${activeFilter === 'Best Seller' ? styles.active : ''}`}
              onClick={() => setActiveFilter('Best Seller')}
            >
              Best Seller
            </button>
            <button 
              className={`${styles.filterButton} ${activeFilter === 'Single Order' ? styles.active : ''}`}
              onClick={() => setActiveFilter('Single Order')}
            >
              Single Order
            </button>
            <button 
              className={`${styles.filterButton} ${activeFilter === 'History Order' ? styles.active : ''}`}
              onClick={() => setActiveFilter('History Order')}
            >
              History Order
            </button>
          </div>
        </div>

        {/* Grid Produk */}
        <div className={styles.productGrid}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              imageSrc={product.imageSrc}
              bgColor={product.bgColor || '#f0f0f0'}
            />
          ))}
        </div>

        {/* Slider Controls (jika Anda ingin slider, perlu implementasi JS lebih lanjut) */}
        {/* Untuk tampilan statis, ini bisa dihilangkan atau dibuat berfungsi dengan state index */}
        <div className={styles.sliderControls}>
          <button className={styles.arrowButton} aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          {/* Tombol Explore More hanya sebagai placeholder, bisa jadi link ke halaman lain */}
          <button className={styles.exploreMoreButton}>Explore More</button> 
          <button className={styles.arrowButton} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;