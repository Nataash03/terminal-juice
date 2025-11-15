'use client'; 

import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard'; 
import ProductDetailModal, { ProductForModal } from '../components/ProductDetailModal';
// ⚠️ Kita hapus impor service lama karena fetch dilakukan di sini
// import { getProducts, JuiceProduct } from '../services/product.service'; 
import styles from './ShopPage.module.css'; 

// 🚨 URL API BACKEND KAMU (Pastikan server Node.js berjalan di sini)
const API_URL = 'http://localhost:5001/api/products'; 

// --- DEFINISI TIPE BARU (Berdasarkan Schema MongoDB kamu) ---
interface BackendProduct {
    _id: string; // ID unik dari MongoDB
    name: string;
    price: number;
    category: string; // Asumsi ini adalah ObjectId Category yang dibutuhkan
    images: string[]; // Array of image URLs
    slug: string;
    stock: number;
    isActive: boolean;
    tags: string[]; // Asumsi kamu tetap butuh field tags untuk filtering
    // ... Tambahkan field lain dari schema jika diperlukan
}

// Definisikan tipe untuk Filter Utama dan Sub-Filter (TIDAK DIUBAH)
type FilterType = 'Best Seller' | 'All Menu' | 'Other';
type SubFilterType = 'All' | 'Mineral Water' | 'Fruit' | 'Snacks'; 
type SelectedProductState = ProductForModal | null;

const ShopPage: React.FC = () => {
  // Ganti tipe state products menjadi BackendProduct
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State filter tetap sama
  const [activeFilter, setActiveFilter] = useState<FilterType>('Best Seller');
  const [activeSubFilter, setActiveSubFilter] = useState<SubFilterType>('All');
  const [selectedProduct, setSelectedProduct] = useState<SelectedProductState>(null);

  // 1. LOGIKA FETCH DATA DARI API BACKEND
  useEffect(() => {
    const fetchProductsFromApi = async () => {
      try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        // Asumsi API kamu mengembalikan { success: true, data: [...] }
        const fetchedProducts: BackendProduct[] = result.data || []; 
        
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Failed to fetch products from backend. Check API URL or CORS.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsFromApi();
  }, []); // Hanya dijalankan saat mount

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter);
    if (filter !== 'Other') {
      setActiveSubFilter('All');
    }
  };

  const handleSubFilterClick = (subFilter: SubFilterType) => {
    setActiveSubFilter(subFilter);
  };

  // Handler yang dipanggil saat Card diklik
  const handleProductCardClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>, 
    product: BackendProduct // 👈 Ganti tipe parameter
  ) => {
    event.stopPropagation();
    
    // Objek detail produk yang dicasting ke ProductForModal
    const fullProductDetail: ProductForModal = {
      // 🚨 PERBAIKAN: Gunakan product._id, bukan product.id (dari MongoDB)
      id: product._id, 
      name: product.name,
      price: product.price,
      // 🚨 PERBAIKAN: Ambil URL gambar pertama dari array images
      imageSrc: product.images[0] || '/images/placeholder-jus.jpg',
      
      // --- Data dari Backend ---
      description: product.description, // Ambil dari backend
      stock: product.stock,             // Ambil dari backend
      // --- Data Lain ---
      category: product.category, 
      tags: product.tags,
    };
    setSelectedProduct(fullProductDetail);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  // Handler untuk Add To Cart
  const handleAddToCart = (product: ProductForModal, quantity: number) => {
    console.log(`[ACTION] Menambahkan ${quantity}x ${product.name} ke Keranjang!`);
    handleCloseModal();
  };

  // Logika filter produk (Menggunakan data 'products' dari API)
  const filteredProducts = products.filter((product) => {
    if (activeFilter === 'Best Seller') {
      // Asumsi: tags adalah array di BackendProduct
      return product.tags && product.tags.includes('best_seller');
    }
    if (activeFilter === 'All Menu') {
      // Asumsi: Semua jus punya kategori 'Juice'
      return true; // Tampilkan semua produk yang terambil dari API
    }
    if (activeFilter === 'Other') {
      // Logika filtering kategori lanjutan (gunakan product.category dari backend)
      if (product.category === 'Juice') return false;
      if (activeSubFilter === 'All') return true;
      
      // Catatan: Jika category di backend adalah ObjectId,
      // logika filtering ini harus dicocokkan dengan nama kategori (String) di frontend.
      return product.category === activeSubFilter; 
    }
    return true; // Default: tampilkan semua
  });

  // ... (if loading, if error) ...
  if (loading) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '100px', textAlign: 'center', color: 'red' }}>
        {error}
      </div>
    );
  }

  const otherSubCategories: SubFilterType[] = [
    'All', 'Mineral Water', 'Fruit', 'Snacks',
  ];

  return (
    <div className={styles.shopPageContainer}>
      <section className={styles.productRangeSection}>
        <div className={styles.rangeHeader}>
          <h2 className={styles.rangeTitle}>
            <span className={styles.discoverItalic}>Discover</span> our range -
          </h2>
          
          {/* ... (Filter Buttons JSX tetap sama) ... */}
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${activeFilter === 'Best Seller' ? styles.active : ''}`}
              onClick={() => handleFilterClick('Best Seller')}
            >
              Best Seller
            </button>
            <button
              className={`${styles.filterButton} ${activeFilter === 'All Menu' ? styles.active : ''}`}
              onClick={() => handleFilterClick('All Menu')}
            >
              All Menu
            </button>
            <button
              className={`${styles.filterButton} ${activeFilter === 'Other' ? styles.active : ''}`}
              onClick={() => handleFilterClick('Other')}
            >
              Other
            </button>
          </div>

          {activeFilter === 'Other' && (
            <div className={styles.submenuContainer}>
              {otherSubCategories.map((subFilter) => (
                <button
                  key={subFilter}
                  className={`${styles.subFilterButton} ${activeSubFilter === subFilter ? styles.active : ''}`}
                  onClick={() => handleSubFilterClick(subFilter)}
                >
                  {subFilter}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid Produk */}
        <div className={styles.productGrid}>
          {/* 🚨 LOOP MENGGUNAKAN DATA LIVE DARI API */}
          {filteredProducts.map((product) => (
            <div
              key={product._id} // 👈 GUNAKAN _ID DARI MONGODB
              onClick={(e) => handleProductCardClick(e, product)} 
              style={{ cursor: 'pointer' }}
            >
              <ProductCard
                id={product._id} // 👈 GUNAKAN _ID
                name={product.name}
                price={product.price}
                imageSrc={product.images[0]} // 👈 AMBIL URL PERTAMA DARI ARRAY
                bgColor={'#f0f0f0'} // Asumsi warna default, kamu bisa tambahkan field bgColor di backend
              />
            </div>
          ))}
        </div>

        {/* ... (filteredProducts.length === 0 & Slider Controls JSX) ... */}
        {filteredProducts.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              marginTop: '40px',
              fontSize: '1.2em',
              color: '#666',
            }}
          >
            Tidak ada produk yang ditemukan di kategori "{activeFilter}
            {activeFilter === 'Other' && activeSubFilter !== 'All'
              ? ` > ${activeSubFilter}`
              : ''}
            ".
          </div>
        )}

        {/* ... (Slider Controls JSX) ... */}
        <div className={styles.sliderControls}>
          <button className={styles.arrowButton} aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className={styles.exploreMoreButton}>Explore More</button>
          <button className={styles.arrowButton} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </section>

      {/* Komponen Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onAddToCart={handleAddToCart}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ShopPage;