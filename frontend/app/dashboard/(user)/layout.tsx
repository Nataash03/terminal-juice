"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import styles from '../Sidebar.module.css'; 

export default function UserLayout({ children }: { children: React.ReactNode }) {
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
          <Link href="/dashboard" className={`${styles.menuItem} ${pathname === '/dashboard' ? styles.active : ''}`}>My Profile</Link>
          <Link href="/dashboard/orders" className={`${styles.menuItem} ${pathname === '/dashboard/orders' ? styles.active : ''}`}>My Orders</Link>
          <Link href="/dashboard/notification" className={`${styles.menuItem} ${pathname === '/dashboard/notification' ? styles.active : ''}`}>Notification</Link>
        </nav>
        <button onClick={handleLogout} className={styles.logoutBtn}>Log Out</button>
      </aside>
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}