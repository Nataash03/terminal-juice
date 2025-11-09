// frontend/app/components/HeroSection.tsx
import React from 'react';
import styles from './HeroSection.module.css';

const HeroSection: React.FC = () => {
  return (
    <section className={styles.heroContainer}>
      <div className={styles.content}>
        <h1 className={styles.mainTitle}>
          Savour <span className={styles.highlightItalic}>the juicy essence</span> of fruit in every sip.
        </h1>
        <p className={styles.tagline}>
          Taste nature's best in every drop with real fruit and vibrant flavour
        </p>
        <a href="/shop" className={styles.sipFreshButton}>
          Sip Fresh →
        </a>
      </div>

      <div className={styles.imageWrapper}>
        <img 
          src="/images/splash-screen.jpeg" 
          alt="Pineapple splash" 
          className={styles.pineappleImage}
        />
        <div className={styles.qualityBadge}>
          <div className={styles.percentage}>100%</div>
          <div className={styles.badgeText}>
            Natural ingredients<br />used in flavour
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;