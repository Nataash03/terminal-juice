import React from 'react';
import styles from './FlavoursPage.module.css';
import { getProducts, JuiceProduct } from '../services/product.service';
import JuiceSliderItem from '../components/JuiceSliderItem'; 

// Data untuk Benefits
const benefitsData = [
  { name: 'Antioxidants', imagePath: '/images/antioxidants.webp', color: '#ffc0cb' }, // Pink
  { name: 'Electrolytes', imagePath: '/images/electrolytes.png', color: '#b0e0e6' }, // Blue
  { name: 'Prebiotic', imagePath: '/images/prebiotic.png', color: '#c0f0c0' },    // Green
  { name: 'Immunity', imagePath: '/images/immunity.png', color: '#fffacd' },     // Yellow
  { name: 'Detox', imagePath: '/images/detox.png', color: '#d0f0c0' },      // Light Green
];

export default async function FlavoursPage() {
  // Ambil data produk dari service
  const products: JuiceProduct[] = await getProducts(); 

  const currentSlide = {
    title: (
      <>
        Indulge in <span className={styles.highlightItalic}>the fresh taste</span> of fruits
      </>
    ),
    subtitle: (
      <>
        Our <span className={styles.boldItalic}>juices</span> are crafted to{' '}
        <span className={styles.boldItalic}>energize</span> your day and{' '}
        <span className={styles.boldItalic}>satisfy</span> your{' '}
        <span className={styles.boldItalic}>cravings</span>
      </>
    ),
    buttonText: 'Shop Now →',
    buttonLink: '/shop',
  };


  return (
    <div className={styles.flavoursPageContainer}>
      <section className={styles.flavourBanner}>
        <div className={styles.bannerContent}>
          <h1 className={styles.bannerTitle}>
            {currentSlide.title}
          </h1>
          <p className={styles.bannerText}>
            {currentSlide.subtitle}
          </p>
          <a href={currentSlide.buttonLink} className={styles.shopNowButton}>
            {currentSlide.buttonText}
          </a>
        </div>
        
        <div className={styles.bannerVisual}>
        <img 
            src="/images/flavours.png" 
            alt="Main Juice Visual" 
            className={`${styles.assetBase} ${styles.mainVisual}`}
        />
        </div>
      </section>

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
                  src={benefit.imagePath} 
                  alt={benefit.name}
                  className={styles.benefitImage}
                />
              </div>
              <p className={styles.benefitName}>{benefit.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.juiceSliderSection}>
        <h2 className={styles.catalogueTitle}>All Our Delicious Juices</h2> 
        
        {/* Container untuk Horizontal Scroll */}
        <div className={styles.juiceSliderContainer}> 
          {products.map((product) => (
            <JuiceSliderItem
              key={product.id}
              id={product.id}
              name={product.name}
              imageSrc={product.imageSrc}
              bgColor={product.bgColor || '#ECFCCA'} 
            />
          ))}
        </div>
      </section>
      
    </div>
  );
}