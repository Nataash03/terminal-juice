'use client'; 

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import ProductCard from '../components/ProductCard'; 
import ProductDetailModal, { ProductForModal } from '../components/ProductDetailModal';
import styles from './ShopPage.module.css'; 

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageSrc: string;
}

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
  const router = useRouter(); 

  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeFilter, setActiveFilter] = useState<FilterType>('Best Seller');
  const [activeSubFilter, setActiveSubFilter] = useState<SubFilterType>('All');
  
  const [selectedProduct, setSelectedProduct] = useState<SelectedProductState>(null);
  
  // State untuk Cart & Loading Flag
  const [cart, setCart] = useState<CartItem[]>([]); 
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // 1. useEffect FETCH DATA & LOAD CART
  useEffect(() => {
    const initPage = async () => {
      // A. Fetch Products
      try {
        const response = await fetch(`${baseUrl}/api/products`);
        
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        
        setProducts(result.data || []); 
      } catch (err) {
        setError('Failed to fetch products from backend.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Jalankan Fetch
    initPage();

    // B. Load Cart dari LocalStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    // C. Tandai bahwa loading selesai
    setIsCartLoaded(true); 
  }, []);

  // 2. useEffect SIMPAN CART
  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isCartLoaded]);

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
      imageSrc: (product.images && product.images.length > 0) ? product.images[0] : '/images/placeholder-jus.jpg',
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
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id);
      
      let updatedCart;
      if (existingItemIndex >= 0) {
        updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          imageSrc: product.imageSrc
        };
        updatedCart = [...prevCart, newItem];
      }
      return updatedCart;
    });
    handleCloseModal();
  };

  // Logic Order Now
  const handleOrderNow = (product: ProductForModal, quantity: number) => {
    handleAddToCart(product, quantity);
    setTimeout(() => {
      router.push('/payment'); 
    }, 100);
  };

  const handleGoToCheckout = () => {
    if (cart?.length > 0) {
      router.push('/cart');
    }
  };

  const filteredProducts = products.filter((product) => {
    const categoryName = product.category && typeof product.category === 'object' 
        ? product.category.name 
        : String(product.category);
    
    if (activeFilter === 'Best Seller') return product.tags && product.tags.includes('best_seller');
    if (activeFilter === 'All Menu') return categoryName === 'Fruit Juice';
    if (activeFilter === 'Other') {
      if (activeSubFilter === 'All') return categoryName !== 'Fruit Juice';
      return categoryName === activeSubFilter;
    }
    return true; 
  });

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading products...</div>;
  if (error) return <div style={{ padding: '100px', textAlign: 'center', color: 'red' }}>{error}</div>;

  // Data Sub-Filter Statis Asli Anda
  const otherSubCategories: SubFilterType[] = ['All', 'Mineral Water', 'Fruit', 'Snacks'];
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

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

          {/* Submenu Kategori Statis Asli */}
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
                // Safety check untuk images
                imageSrc={(product.images && product.images.length > 0) ? product.images[0] : '/images/placeholder-jus.jpg'}
                bgColor={'#f0f0f0'}
              />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '1.2em', color: '#666' }}>
            Tidak ada produk ditemukan.
          </div>
        )}

        <div className={styles.sliderControls}>
          <button className={styles.arrowButton}>&lt;</button>
          <button className={styles.exploreMoreButton}>Explore More</button>
          <button className={styles.arrowButton}>&gt;</button>
        </div>
      </section>

      <ProductDetailModal
        product={selectedProduct}
        onAddToCart={handleAddToCart}
        onOrderNow={handleOrderNow} 
        onClose={handleCloseModal}
      />

      {/* TOMBOL CHECKOUT MELAYANG */}
      {totalItems > 0 && (
        <div 
            onClick={handleGoToCheckout} 
            style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '50px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'transform 0.2s'
            }}
        >
            <span>🛒 Checkout</span>
            <span style={{ 
                backgroundColor: 'white', 
                color: '#4CAF50', 
                borderRadius: '50%', 
                padding: '2px 8px', 
                fontSize: '0.9rem' 
            }}>
                {totalItems}
            </span>
        </div>
      )}
    </div>
  );
};

export default ShopPage;