// frontend/app/dashboard/seller/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './sellerDashboard.module.css';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  growth: number;
}

export default function SellerDashboard() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // Mock data untuk statistik
  const stats: DashboardStats = {
    totalSales: 100000000,
    totalOrders: 50,
    totalProducts: 55,
    growth: 20,
  };

  const handleNavigation = (path: string, menuName: string) => {
    setActiveMenu(menuName);
    if (path !== '/dashboard/seller') {
      router.push(path);
    }
  };

  const handleLogout = () => {
    // Implementasi logout
    console.log('Logging out...');
    router.push('/');
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.profile}>
          <div className={styles.avatar}>
            <span>TJ</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${
              activeMenu === 'dashboard' ? styles.navItemActive : ''
            }`}
            onClick={() => handleNavigation('/dashboard/seller', 'dashboard')}
          >
            Dashboard
          </button>

          <button
            className={`${styles.navItem} ${
              activeMenu === 'products' ? styles.navItemActive : ''
            }`}
            onClick={() =>
              handleNavigation('/dashboard/seller/products', 'products')
            }
          >
            My Products
          </button>

          <button
            className={`${styles.navItem} ${
              activeMenu === 'notifications' ? styles.navItemActive : ''
            }`}
            onClick={() =>
              handleNavigation('/dashboard/seller/notifications', 'notifications')
            }
          >
            Notification
          </button>

          <button className={styles.navItem} onClick={handleLogout}>
            Log Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Sales Dashboard</h1>
        </header>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          {/* Total Penjualan */}
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              Rp
              <br />
              {stats.totalSales.toLocaleString('id-ID')}
            </div>
            <div className={styles.statLabel}>Total Penjualan</div>
          </div>

          {/* Total Orders */}
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.totalOrders}</div>
            <div className={styles.statLabel}>Total Orders</div>
          </div>

          {/* Jumlah Produk */}
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.totalProducts}</div>
            <div className={styles.statLabel}>Jumlah Produk</div>
          </div>

          {/* Growth */}
          <div className={styles.statCard}>
            <div className={styles.statValue}>+{stats.growth}%</div>
            <div className={styles.statLabel}>Growth</div>
          </div>
        </div>

        {/* Top Selling Products Section */}
        <section className={styles.topProducts}>
          <h2 className={styles.sectionTitle}>Top selling products</h2>
          <div className={styles.productsContent}>
            <div className={styles.productImageWrapper}>
              <img
                src="/images/juice-strawberry.png"
                alt="Top selling product"
                className={styles.productImage}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}