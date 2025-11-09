// frontend/app/flavours/page.tsx
import React from 'react';
import styles from './FlavoursPage.module.css';
import { getProducts, JuiceProduct } from '../services/product.service';
import ProductCard from '../components/ProductCard';

// Data untuk Manfaat (Benefits)
const benefitsData = [
  { name: 'Antioxidants', icon: '🍓', color: '#ffc0cb' }, // Pink
  { name: 'Electrolytes', icon: '🫐', color: '#b0e0e6' }, // Blue
  { name: 'Prebiotic', icon: '🥥', color: '#c0f0c0' },    // Green
  { name: 'Immunity', icon: '🍋', color: '#fffacd' },     // Yellow
  { name: 'Detox', icon: '🍏', color: '#d0f0c0' },      // Light 
];

export default async function FlavoursPage() {
  // Ambil data produk dari service
  const products: JuiceProduct[] = await getProducts(); 

  return (
    <div className={styles.flavoursPageContainer}>
      {/* Banner Section */}
      <section className={styles.flavourBanner}>
        <div className={styles.bannerContent}>
          <h1 className={styles.bannerTitle}>
            Indulge in <span className={styles.highlightItalic}>the fresh taste</span> of fruits
          </h1>
          <p className={styles.bannerText}>
            Our <span className={styles.boldItalic}>juices</span> are crafted to{' '}
            <span className={styles.boldItalic}>energize</span> your day and{' '}
            <span className={styles.boldItalic}>satisfy</span> your{' '}
            <span className={styles.boldItalic}>cravings</span>
          </p>
          <a href="/shop" className={styles.shopNowButton}>
            Shop Now →
          </a>
        </div>
        
        <div className={styles.bannerVisual}>
          <img 
            src="/images/juice-bottle-pink.png" 
            alt="Fresh juice" 
            className={styles.bannerImage}
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <h2 className={styles.benefitsTitle}>
          Huge Benefits{' '}
          <span className={styles.smiley}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" fill="#4169E1"/>
              <circle cx="14" cy="16" r="2" fill="white"/>
              <circle cx="26" cy="16" r="2" fill="white"/>
              <path d="M12 24c0 4 4 6 8 6s8-2 8-6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>{' '}
          inside<br />
          our detoxified <span className={styles.terminalItalic}>terminal juice.</span>
        </h2>

        <div className={styles.benefitsGrid}>
          {benefitsData.map((benefit, index) => (
            <div key={index} className={styles.benefitItem}>
              <div 
                className={styles.benefitCircle} 
                style={{ backgroundColor: benefit.color }}
              >
                <img 
                  src={benefit.icon} 
                  alt={benefit.name}
                  className={styles.benefitImage}
                />
              </div>
              <p className={styles.benefitName}>{benefit.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Catalogue */}
      <section className={styles.productCatalogue}>
        <h2 className={styles.catalogueTitle}>All Our Delicious Juices</h2>
        <div className={styles.productGrid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              imageSrc={product.imageSrc}
              bgColor={product.bgColor || '#f0f0f0'} 
            />
          ))}
        </div>
      </section>
    </div>
  );
}