"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import styles from '../Sidebar.module.css'; 

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const getInitials = (name: string) => {
      if (!name) return ""; 
      const names = name.split(' ');
      let initials = names[0].substring(0, 1).toUpperCase();
      if (names.length > 1) {
          initials += names[names.length - 1].substring(0, 1).toUpperCase();
      }
      return initials;
  };

  const loadUserFromStorage = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
          try {
              setUser(JSON.parse(storedUser));
          } catch (e) { console.error(e); }
      }
  };

  useEffect(() => {
    loadUserFromStorage();
    window.addEventListener('storage', loadUserFromStorage);
    return () => window.removeEventListener('storage', loadUserFromStorage);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token'); 
    Cookies.remove('user_role'); 
    localStorage.clear();
    router.push('/auth');
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        {/* Avatar Inisial */}
        <div className={styles.avatar} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 'bold', color: '#D63384', border: '4px solid #fff'}}>
             {getInitials(user?.username || user?.fullName)}
        </div>

        <nav className={styles.nav}>
          <Link 
            href="/dashboard" 
            className={`${styles.menuItem} ${pathname === '/dashboard' ? styles.active : ''}`}
          >
            My Profile
          </Link>

          <Link 
            href="/dashboard/orders" 
            className={`${styles.menuItem} ${pathname === '/dashboard/orders' ? styles.active : ''}`}
          >
            My Orders
          </Link>

          <Link 
            href="/dashboard/notification" 
            className={`${styles.menuItem} ${pathname === '/dashboard/notification' ? styles.active : ''}`}
          >
            Notification
          </Link>
        </nav>
        
        <button onClick={handleLogout} className={styles.logoutBtn}>Log Out</button>
      </aside>
      
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}