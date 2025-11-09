// frontend/app/page.tsx
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import styles from './page.module.css';

// Data produk untuk tampilan
const dummyProducts = [
  { 
    id: 1, 
    name: 'Juice Melon', 
    price: 15000, 
    imageSrc: '/images/juice melon.png', 
    bgColor: '#B8E6F5' 
  },
  { 
    id: 2, 
    name: 'Juice Alpukat', 
    price: 20000, 
    imageSrc: '/images/juice alpukat.png', 
    bgColor: '#A8D5A8' 
  },
  { 
    id: 3, 
    name: 'Juice Mix 2 in 1', 
    price: 15000, 
    imageSrc: '/images/juice mix 2 in 1.png', 
    bgColor: '#F5C8E8' 
  },
  { 
    id: 4, 
    name: 'Juice Mangga', 
    price: 20000, 
    imageSrc: '/images/juice mangga.png', 
    bgColor: '#FFCC99' 
  },
  { 
    id: 5, 
    name: 'Juice Semangka', 
    price: 15000, 
    imageSrc: '/images/juice semangka.png', 
    bgColor: '#FF9999' 
  },
];

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      <HeroSection />
      
      <section className={styles.productRangeSection}>
        <div className={styles.rangeHeader}>
          <h2 className={styles.rangeTitle}>
            <span className={styles.discoverItalic}>Discover</span> our range -
          </h2>
          <div className={styles.filterButtons}>
            <button className={`${styles.filterButton} ${styles.active}`}>
              Best Seller
            </button>
            <button className={styles.filterButton}>
              Single Order
            </button>
            <button className={styles.filterButton}>
              History Order
            </button>
          </div>
        </div>

        <div className={styles.productList}>
          {dummyProducts.map(product => (
            <ProductCard 
              key={product.id}
              name={product.name}
              price={product.price}
              imageSrc={product.imageSrc}
              bgColor={product.bgColor}
            />
          ))}
        </div>

        <div className={styles.sliderControls}>
          <button className={styles.arrowButton} aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button className={styles.arrowButton} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}