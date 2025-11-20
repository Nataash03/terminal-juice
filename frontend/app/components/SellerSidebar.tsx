// components/SellerSidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from '../app/dashboard/Dashboard.module.css';

const SellerSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className={styles.sidebarCard}>
      <div className={styles.avatarCircle}></div>
      <h3>Seller Dashboard</h3>
      <p style={{ color: '#888', fontSize:'0.9rem' }}>Store Manager</p>

      <div className={styles.menuList}>
        <Link 
           href="/dashboard/seller" 
           className={`${styles.menuItem} ${pathname === '/dashboard/seller' ? styles.activeMenu : ''}`}
        >
           📊 Dashboard Stats
        </Link>

        <Link 
           href="/dashboard/seller/products" 
           className={`${styles.menuItem} ${pathname.includes('/products') ? styles.activeMenu : ''}`}
        >
           📦 My Products
        </Link>

        <button className={styles.menuItem} onClick={handleLogout} style={{color:'red'}}>
           🚪 Log Out
        </button>
      </div>
    </div>
  );
};

export default SellerSidebar;