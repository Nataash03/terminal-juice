// frontend/app/components/Navbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          terminal juice.
        </Link>

        {/* Navigation Menu */}
        <nav className={styles.nav}>
          <Link href="/shop" className={styles.navLink}>
            Shop All
          </Link>
          <Link href="/flavours" className={styles.navLink}>
            Flavours
          </Link>
          <Link href="/about" className={styles.navLink}>
            About Us
          </Link>
          <Link href="/mission" className={styles.navLink}>
            Our Mission
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className={styles.actions}>
          {/* Search Icon */}
          <button className={styles.iconButton} aria-label="Search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          {/* Cart Icon (Diubah menjadi Link) */}
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
          {/* Tautan ke Dashboard Seller */}
          <Link href="/dashboard/seller" className={styles.dropdownLink} onClick={toggleMenu}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Seller Dashboard
          </Link>

          {/* Tautan Login Buyer Standar */}
          <Link href="/login" className={styles.dropdownLink} onClick={toggleMenu}> 
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Sign In / Profile (Buyer)
          </Link>
          
          {/* Tautan Khusus Login Seller */}
          <Link href="/seller/login" className={styles.dropdownLink} onClick={toggleMenu}> 
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 15a4 4 0 0 0 4-4V5a4 4 0 0 0-8 0v6a4 4 0 0 0 4 4z"/>
              <path d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"/>
            </svg>
            Login as Seller
          </Link>
          
        </div>
      )}
    </header>
  );
};

export default Navbar;