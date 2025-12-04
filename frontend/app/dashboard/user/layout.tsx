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
  const [loading, setLoading] = useState(true); 

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
      const token = Cookies.get('token'); 

      if (!token) {
          router.push('/auth');
          return;
      }
      
      if (storedUser) {
          try {
              setUser(JSON.parse(storedUser));
          } catch (e) { console.error(e); }
      }
      
      setLoading(false); 
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

  if (loading) {
      return (
          <div style={{
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh', 
              fontSize: '20px'
          }}>
              Memeriksa sesi...
          </div>
      );
  }

  if (!user && !loading) {
      router.push('/auth');
      return null;
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        {/* Avatar Inisial */}
        <div className={styles.avatar} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 'bold', color: '#D63384', border: '4px solid #fff'}}>
             {getInitials(user?.username || user?.fullName)}
        </div>

        <nav className={styles.nav}>
          {/* My Profile */}
          <Link 
            href="/dashboard/user" 
            className={`${styles.menuItem} ${pathname === '/dashboard/user' ? styles.active : ''}`}
          >
            My Profile
          </Link>
          
          {/* Orders dan Notification */}
          <Link 
            href="/dashboard/user/orders" 
            className={`${styles.menuItem} ${pathname.startsWith('/dashboard/user/orders') ? styles.active : ''}`}
          >
            My Orders
          </Link>

          <Link 
            href="/dashboard/user/notification" 
            className={`${styles.menuItem} ${pathname === '/dashboard/user/notification' ? styles.active : ''}`}
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