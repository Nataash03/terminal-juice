// frontend/app/dashboard/seller/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import styles from './SellerDashboard.module.css';

// Data untuk top selling products
const topSellingProducts = [
  {
    id: 1,
    name: 'Juice Mix 2 in 1',
    imageSrc: '/images/juice-mix-2in1.png',
    salesPercentage: 75,
  },
  {
    id: 2,
    name: 'Juice Melon',
    imageSrc: '/images/juice-melon.png',
    salesPercentage: 90,
  },
  {
    id: 3,
    name: 'Juice Alpukat',
    imageSrc: '/images/juice-alpukat.png',
    salesPercentage: 60,
  },
];

export default function SellerDashboardPage() {
  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.profileSection}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              {/* Placeholder avatar */}
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="40" fill="url(#gradient)" />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="80" y2="80">
                    <stop offset="0%" stopColor="#FFE5D9" />
                    <stop offset="100%" stopColor="#FFC4D6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        <nav className={styles.navMenu}>
          <Link href="/dashboard/seller" className={`${styles.navItem} ${styles.active}`}>
            Dashboard
          </Link>
          <Link href="/dashboard/seller/products" className={styles.navItem}>
            My Products
          </Link>
          <Link href="/dashboard/seller/notifications" className={styles.navItem}>
            Notification
          </Link>
          <button className={styles.logoutButton}>
            Log Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>
          <span className={styles.titleItalic}>Sales</span> Dashboard
        </h1>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>Rp 100.000.000</div>
            <div className={styles.statLabel}>Total Penjualan</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statValue}>50</div>
            <div className={styles.statLabel}>Total Orders</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statValue}>55</div>
            <div className={styles.statLabel}>Jumlah Produk</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statValue}>+20%</div>
            <div className={styles.statLabel}>Growth</div>
          </div>
        </div>

        {/* Top Selling Products */}
        <section className={styles.topSellingSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleItalic}>Top selling</span> products
          </h2>

          <div className={styles.productsList}>
            {topSellingProducts.map((product) => (
              <div key={product.id} className={styles.productItem}>
                <div className={styles.productInfo}>
                  <img 
                    src={product.imageSrc} 
                    alt={product.name}
                    className={styles.productImage}
                  />
                  <span className={styles.productName}>{product.name}</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${product.salesPercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button className={styles.seeOthersButton}>
            see others
          </button>
        </section>
      </main>
    </div>
  );
}