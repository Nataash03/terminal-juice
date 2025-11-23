'use client'; 

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import ProductCard from '../components/ProductCard'; 
import ProductDetailModal, { ProductForModal } from '../components/ProductDetailModal';
import styles from './ShopPage.module.css'; 

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// --- DEFINISI TIPE ---
interface CartItem { id: string; name: string; price: number; quantity: number; imageSrc: string; }
interface PopulatedCategory { _id: string; name: string; slug: string; }

interface BackendProduct {
    _id: string; name: string; price: number; category: PopulatedCategory; images: string[];
    slug: string; stock: number; isActive: boolean; tags: string[]; description: string;
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

  // FETCH DATA & LOAD CART
  useEffect(() => {
    const initPage = async () => {
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
    initPage();

    const storedCart = localStorage.getItem('cart');
    if (storedCart) setCart(JSON.parse(storedCart));
    setIsCartLoaded(true); 
  }, []);

  // SIMPAN CART
  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isCartLoaded]);

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter);
    if (filter !== 'Other') setActiveSubFilter('All');
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

  const handleCloseModal = () => { setSelectedProduct(null); };

  const handleAddToCart = (product: ProductForModal, quantity: number) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id);
      let updatedCart;
      if (existingItemIndex >= 0) {
        updatedCart = [...prevCart]; updatedCart[existingItemIndex].quantity += quantity;
      } else {
        const newItem: CartItem = { id: product.id, name: product.name, price: product.price, quantity: quantity, imageSrc: product.imageSrc };
        updatedCart = [...prevCart, newItem];
      }
      return updatedCart;
    });
    handleCloseModal();
  };

  const handleOrderNow = (product: ProductForModal, quantity: number) => {
    handleAddToCart(product, quantity);
    setTimeout(() => { router.push('/payment'); }, 100);
  };

  const handleGoToCheckout = () => {
    if (cart?.length > 0) { router.push('/cart'); }
  };

  const filteredProducts = products.filter((product) => {
    const categoryName = product.category?.name?.toUpperCase(); 
    
    if (!categoryName) return false; 
    
    // 1. Definisikan Produk Utama (Jus)
    const isMainJuice = categoryName === 'FRUIT JUICE';

    // 2. Filter Best Seller 
    if (activeFilter === 'Best Seller') {
      return product.tags && product.tags.includes('best_seller');
    }
    
    // 3. ALL MENU CHECK (Hanya tampilkan produk JUS utama)
    if (activeFilter === 'All Menu') {
      return isMainJuice; 
    }
    
    // 4. OTHER CHECK (Hanya tampilkan produk NON-JUS)
    if (activeFilter === 'Other') {
      
      // Jika subfilter 'All' (dari Other) diklik, tampilkan SEMUA yang BUKAN JUS UTAMA
      if (activeSubFilter === 'All') return !isMainJuice; 
      
      // Jika subfilter spesifik diklik - gunakan EXACT match
      if (activeSubFilter === 'Mineral Water') {
        return categoryName === 'MINERAL WATER';
      }
      
      if (activeSubFilter === 'Fruit') {
        return categoryName === 'FRUIT';
      }
      
      if (activeSubFilter === 'Snacks') {
        return categoryName === 'SNACKS';
      }
      
      return false; 
    }
    
    return true; 
  });

  if (loading) return <div className={styles.loadingMessage}>Loading products...</div>;
  if (error) return <div className={styles.errorMessage}>{error}</div>;

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

        {/* STRUKTUR GRID & EMPTY STATE */}
        <div className={styles.productGrid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={(e) => handleProductCardClick(e, product)} 
                className={styles.clickableCard}
              >
                <ProductCard
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  imageSrc={(product.images && product.images.length > 0) ? product.images[0] : '/images/placeholder-jus.jpg'}
                  bgColor={'#f0f0f0'}
                />
              </div>
            ))
          ) : (
            <div className={styles.emptyStateMessage}> 
              Tidak ada produk ditemukan.
              <p className={styles.emptyStateSubtext}>Coba ganti filter kategori!</p>
            </div>
          )}
        </div>
        
        {/* SLIDER CONTROLS */}
        {filteredProducts.length > 0 && (
          <div className={styles.sliderControls}>
            
            <button 
                className={styles.exploreMoreButton}
                onClick={() => handleFilterClick('All Menu')}
            >
                Explore More
            </button>
            
          </div>
        )}
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
            className={styles.floatingCheckoutButton} 
        >
            <span>🛒 Checkout</span>
            <span className={styles.cartItemCount}>
                {totalItems}
            </span>
        </div>
      )}
    </div>
  );
};

export default ShopPage;