"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import styles from '../../Sidebar.module.css'; 

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token'); Cookies.remove('user_role'); localStorage.clear();
    router.push('/auth');
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.avatar}></div>
        <nav className={styles.nav}>
          <Link href="/dashboard/seller/se" className={`${styles.menuItem} ${pathname === '/dashboard/se' ? styles.active : ''}`}>
            Dashboard
          </Link>
          
          <Link href="/dashboard/seller/se/incoming" className={`${styles.menuItem} ${pathname.includes('/incoming') ? styles.active : ''}`}>
            Incoming Orders
          </Link>

          <Link href="/dashboard/seller/se/orders" className={`${styles.menuItem} ${pathname.includes('/orders') ? styles.active : ''}`}>
            My Products
          </Link>
        </nav>
        <button onClick={handleLogout} className={styles.logoutBtn}>Log Out</button>
      </aside>
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}