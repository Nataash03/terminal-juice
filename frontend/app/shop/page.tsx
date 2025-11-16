'use client'; 

import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard'; 
import ProductDetailModal, { ProductForModal } from '../components/ProductDetailModal';
import styles from './ShopPage.module.css'; 

// 🚨 URL API BACKEND KAMU (Pastikan server Node.js berjalan di sini)
const API_URL = 'http://localhost:5001/api/products'; 

// --- DEFINISI TIPE BARU (Berdasarkan Schema MongoDB kamu) ---
interface PopulatedCategory {
  _id: string;
  name: string;
  slug: string;
}

interface BackendProduct {
    _id: string;
    name: string;
    price: number;
    category: PopulatedCategory;
    images: string[];
    slug: string;
    stock: number;
    isActive: boolean;
    tags: string[];
    description: string;
}

type FilterType = 'Best Seller' | 'All Menu' | 'Other';
type SubFilterType = 'All' | 'Mineral Water' | 'Fruit' | 'Snacks'; 
type SelectedProductState = ProductForModal | null;

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('Best Seller');
  const [activeSubFilter, setActiveSubFilter] = useState<SubFilterType>('All');
  const [selectedProduct, setSelectedProduct] = useState<SelectedProductState>(null);

  
  useEffect(() => {
    const fetchProductsFromApi = async () => {
      try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
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
  }, []);

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter);
    if (filter !== 'Other') {
      setActiveSubFilter('All');
    }
  };

  const handleSubFilterClick = (subFilter: SubFilterType) => {
    setActiveSubFilter(subFilter);
  };

  const handleProductCardClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>, 
    product: BackendProduct
  ) => {
    event.stopPropagation();
    
    const fullProductDetail: ProductForModal = {
      id: product._id, 
      name: product.name,
      price: product.price,
      imageSrc: product.images[0] || '/images/placeholder-jus.jpg',
      description: product.description,
      stock: product.stock,
      category: product.category?.name ?? 'Unknown',
      tags: product.tags,
    };
    setSelectedProduct(fullProductDetail);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product: ProductForModal, quantity: number) => {
    console.log(`[ACTION] Menambahkan ${quantity}x ${product.name} ke Keranjang!`);
    handleCloseModal();
  };

  const filteredProducts = products.filter((product) => {
    const categoryName = product.category && typeof product.category === 'object' 
        ? product.category.name 
        : String(product.category);
    
    if (activeFilter === 'Best Seller') {
      return product.tags && product.tags.includes('best_seller');
    }

    if (activeFilter === 'All Menu') {
      return categoryName === 'Fruit Juice';
    }

    if (activeFilter === 'Other') {
      if (activeSubFilter === 'All') {
          return categoryName !== 'Fruit Juice';
      }
      if (activeSubFilter !== 'All') {
          return categoryName === activeSubFilter; 
      }
    }
    return true; 
  });

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

        <div className={styles.productGrid}>
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={(e) => handleProductCardClick(e, product)} 
              style={{ cursor: 'pointer' }}
            >
              <ProductCard
                id={product._id}
                name={product.name}
                price={product.price}
                imageSrc={product.images[0]}
                bgColor={'#f0f0f0'}
              />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              marginTop: '40px',
              fontSize: '1.2em',
              color: '#666',
            }}
          >
            Tidak ada produk yang ditemukan di kategori &quot;{activeFilter}
            {activeFilter === 'Other' && activeSubFilter !== 'All'
              ? ` > ${activeSubFilter}`
              : ''}&quot;.
          </div>
        )}

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

      <ProductDetailModal
        product={selectedProduct}
        onAddToCart={handleAddToCart}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ShopPage;