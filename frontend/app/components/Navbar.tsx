'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

// --- IMPLEMENTASI AUTHENTIKASI LIVE ---
const useAuthLive = () => {
    // State untuk menyimpan status login dan role
    const [authStatus, setAuthStatus] = useState({
        isLoggedIn: false,
        userRole: 'buyer' as 'buyer' | 'seller',
    });

    // 🚨 useEffect untuk membaca Local Storage saat komponen dimuat
    useEffect(() => {
        // Karena kode ini berjalan di browser, kita bisa mengakses window/localStorage
        const token = localStorage.getItem('userToken');
        const role = localStorage.getItem('userRole');

        if (token && role) {
            setAuthStatus({
                isLoggedIn: true,
                userRole: role as 'buyer' | 'seller',
            });
        } else {
            setAuthStatus({
                isLoggedIn: false,
                userRole: 'buyer',
            });
        }

        // 💡 Tambahkan listener untuk event storage (optional, untuk sync antar tab)
        const handleStorageChange = () => {
            const newToken = localStorage.getItem('userToken');
            const newRole = localStorage.getItem('userRole');
            if (newToken && newRole) {
                setAuthStatus({ isLoggedIn: true, userRole: newRole as 'buyer' | 'seller' });
            } else {
                setAuthStatus({ isLoggedIn: false, userRole: 'buyer' });
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return authStatus;
};
// --- AKHIR IMPLEMENTASI AUTHENTIKASI LIVE ---


const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Ambil status autentikasi dari hook LIVE
  const { isLoggedIn, userRole } = useAuthLive(); 

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Tentukan Link untuk Sign In / Profile
  const authLink = isLoggedIn ? "/profile" : "/login"; 
  const authText = isLoggedIn ? "Profile" : "Sign In / Profile";
  
  // Handler Logout
  const handleLogout = () => {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRole');
      setMenuOpen(false);
      // Force reload atau redirect untuk update status
      window.location.href = '/'; 
  }


  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          terminal juice.
        </Link>

        {/* Navigation Menu (Tidak ada perubahan) */}
        <nav className={styles.nav}>
          <Link href="/shop" className={styles.navLink}>Shop All</Link>
          <Link href="/flavours" className={styles.navLink}>Flavours</Link>
          <Link href="/about" className={styles.navLink}>About Us</Link>
          <Link href="/mission" className={styles.navLink}>Our Mission</Link>
        </nav>

        {/* Right Side Actions (Tidak ada perubahan) */}
        <div className={styles.actions}>
          {/* Search Icon */}
          <button className={styles.iconButton} aria-label="Search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          {/* Cart Icon */}
          <Link href="/cart" className={styles.iconButton} aria-label="Cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </Link>

          {/* Hamburger Menu (untuk Dropdown) */}
          <button 
            className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`}
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className={styles.dropdownMenu}>
          
          {/* 1. SELLER DASHBOARD: Tampil hanya jika role='seller' */}
          {isLoggedIn && userRole === 'seller' && (
              <Link href="/dashboard" className={styles.dropdownLink} onClick={toggleMenu}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"/>
                      <rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                  Seller Dashboard
              </Link>
          )}

          {/* 2. KONDISI JIKA ROLE ADALAH BUYER (Hanya tampilkan Profile & Logout) */}
          {isLoggedIn && userRole === 'buyer' && (
          <>
            <Link href="/profile" className={styles.dropdownLink} onClick={toggleMenu}> 
                {/* ... SVG ... */}
                Profile
            </Link>
            <button 
                onClick={handleLogout} 
                className={`${styles.dropdownLink} ${styles.logoutButton}`}
            >
                {/* ... Logout Text ... */}
                Logout
            </button>
        </>
    )}
          
          {/* 3. LOGOUT BUTTON (Tampil jika sudah login) */}
          {isLoggedIn && (
              <button 
                  onClick={handleLogout} 
                  className={`${styles.dropdownLink} ${styles.logoutButton}`} // Tambahkan styling jika perlu
              >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
              </button>
          )}
          
        </div>
      )}
    </header>
  );
};

export default Navbar;