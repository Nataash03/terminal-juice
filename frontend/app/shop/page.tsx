'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { getProducts, JuiceProduct } from '../services/product.service';
import styles from './ShopPage.module.css';

type FilterType = 'Best Seller' | 'All Menu' | 'Other';
type SubFilterType = 'All' | 'Mineral Water' | 'Fruit' | 'Snacks';

type ProductWithDetails = JuiceProduct & {
  description: string;
  stock: number;
};

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<JuiceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('Best Seller');
  const [activeSubFilter, setActiveSubFilter] = useState<SubFilterType>('All');
  const [selectedProduct, setSelectedProduct] = useState<ProductWithDetails | null>(null);

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

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter);
    if (filter !== 'Other') {
      setActiveSubFilter('All');
    }
  };

  const handleSubFilterClick = (subFilter: SubFilterType) => {
    setActiveSubFilter(subFilter);
  };

  const handleProductCardClick = (product: JuiceProduct) => {
    const fullProductDetail: ProductWithDetails = {
      ...product,
      description: "Jus ini adalah jus yang isinya itu ada dua buah hasil mix dari buah pisang dan buah mangga",
      stock: 45,
    };
    setSelectedProduct(fullProductDetail);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product: ProductWithDetails, quantity: number) => {
    console.log(`[ACTION] Menambahkan ${quantity}x ${product.name} ke Keranjang!`);
    handleCloseModal();
  };

  const filteredProducts = products.filter((product) => {
    if (activeFilter === 'Best Seller') {
      return product.tags.includes('best_seller');
    }

    if (activeFilter === 'All Menu') {
      return product.category === 'Juice';
    }

    if (activeFilter === 'Other') {
      if (product.category === 'Juice') {
        return false;
      }

      if (activeSubFilter === 'All') {
        return true;
      }

      return product.category === activeSubFilter;
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
    'All',
    'Mineral Water',
    'Fruit',
    'Snacks',
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
              className={`${styles.filterButton} ${
                activeFilter === 'Best Seller' ? styles.active : ''
              }`}
              onClick={() => handleFilterClick('Best Seller')}
            >
              Best Seller
            </button>
            <button
              className={`${styles.filterButton} ${
                activeFilter === 'All Menu' ? styles.active : ''
              }`}
              onClick={() => handleFilterClick('All Menu')}
            >
              All Menu
            </button>
            <button
              className={`${styles.filterButton} ${
                activeFilter === 'Other' ? styles.active : ''
              }`}
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
                  className={`${styles.subFilterButton} ${
                    activeSubFilter === subFilter ? styles.active : ''
                  }`}
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
              key={product.id}
              onClick={() => handleProductCardClick(product)}
              style={{ cursor: 'pointer' }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                imageSrc={product.imageSrc}
                bgColor={product.bgColor || '#f0f0f0'}
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
            Tidak ada produk yang ditemukan di kategori "{activeFilter}
            {activeFilter === 'Other' && activeSubFilter !== 'All'
              ? ` > ${activeSubFilter}`
              : ''}
            ".
          </div>
        )}

        <div className={styles.sliderControls}>
          <button className={styles.arrowButton} aria-label="Previous">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className={styles.exploreMoreButton}>Explore More</button>
          <button className={styles.arrowButton} aria-label="Next">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
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