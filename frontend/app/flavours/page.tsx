// frontend/app/flavours/page.tsx
import React from 'react';
import styles from './FlavoursPage.module.css';
import { getProducts, JuiceProduct } from '../services/product.service';
// Hapus import ProductCard karena kita hanya menggunakan JuiceSliderItem
// import ProductCard from '../components/ProductCard'; 
import JuiceSliderItem from '../components/JuiceSliderItem'; // <-- Pertahankan ini

// Data untuk Manfaat (Benefits)
const benefitsData = [
  // Asumsi: Anda memiliki gambar di public/images/benefits/
  { name: 'Antioxidants', imagePath: '/images/antioxidants.webp', color: '#ffc0cb' }, // Pink
  { name: 'Electrolytes', imagePath: '/images/electrolytes.png', color: '#b0e0e6' }, // Blue
  { name: 'Prebiotic', imagePath: '/images/prebiotic.png', color: '#c0f0c0' },    // Green
  { name: 'Immunity', imagePath: '/images/immunity.png', color: '#fffacd' },     // Yellow
  { name: 'Detox', imagePath: '/images/detox.png', color: '#d0f0c0' },      // Light Green
];

export default async function FlavoursPage() {
  // Ambil data produk dari service
  const products: JuiceProduct[] = await getProducts(); 

  // Konten Banner Section tetap menggunakan slide pertama saja untuk saat ini
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
    imageSrc: '/images/juice-bottle-pink.png',
    imageAlt: 'Fresh juice',
  };


  return (
    <div className={styles.flavoursPageContainer}>
      {/* Banner Section - Tetap Sama */}
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
        
        {/* Konten Visual Banner - Tetap Sama */}
        <div className={styles.bannerVisual}>
          <img 
            src="/images/juice-bottle-design.png" 
            alt="Juice product design elements" 
            className={styles.bannerImage}
            style={{ 
              maxWidth: '600px',
              position: 'absolute',
              right: '-100px',
              top: '-50px',
              transform: 'scale(1.2)'
            }}
          />
        </div>
      </section>

      {/* Benefits Section - Tetap Sama */}
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

      {/* Product Catalogue / Juice Slider (REVISI) */}
      {/* Menggunakan JuiceSliderItem untuk menampilkan daftar produk di section ini */}
      <section className={styles.juiceSliderSection}>
        {/* Menggunakan judul yang Anda sebutkan: All Our Delicious Juices */}
        <h2 className={styles.catalogueTitle}>All Our Delicious Juices</h2> 
        
        {/* Container untuk Horizontal Scroll */}
        <div className={styles.juiceSliderContainer}> 
          {products.map((product) => (
            <JuiceSliderItem
              key={product.id}
              id={product.id}
              name={product.name}
              imageSrc={product.imageSrc}
              bgColor={product.bgColor || '#f0f0f0'} 
            />
          ))}
        </div>
      </section>
      
      {/* HAPUS: Section Product Catalogue (Grid Kartu Penuh) yang ada sebelumnya */}
    </div>
  );
}