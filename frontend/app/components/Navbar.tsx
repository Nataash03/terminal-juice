'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

// --- Tipe Data User ---
interface UserData {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'seller';
}

const Navbar: React.FC = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // State User
  const [user, setUser] = useState<UserData | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Cek Login Live (Sync antar tab & saat load)
  useEffect(() => {
    setIsMounted(true);
    
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Event listener biar kalau login di tab lain, sini ikut update
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // 2. Handler Logout
  const handleLogout = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('cart');
      setUser(null);
      setMenuOpen(false);
      window.location.href = '/login'; 
  };

  // 3. Handler Buka Toko (Upgrade to Seller)
  const handleBecomeSeller = async () => {
    if (!user) return;
    if (!confirm("Apakah kamu yakin ingin membuka toko dan menjadi Seller?")) return;

    try {
      const res = await fetch('http://localhost:5001/api/users/upgrade-to-seller', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id })
      });

      const data = await res.json();

      if (data.success) {
        alert("Selamat! Toko berhasil dibuka 🎉");
        
        // Update LocalStorage dengan data baru (role: seller)
        const updatedUser = { ...user, role: 'seller' };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser as UserData);
        
        setMenuOpen(false);
        router.push('/dashboard/seller'); 
      } else {
        alert("Gagal: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Koneksi error.");
    }
  };

  // Prevent hydration mismatch
  if (!isMounted) return null;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          terminal juice.
        </Link>

        {/* Navigation Menu Desktop */}
        <nav className={styles.nav}>
          <Link href="/shop" className={styles.navLink}>Shop All</Link>
          <Link href="/flavours" className={styles.navLink}>Flavours</Link>
          <Link href="/about" className={styles.navLink}>About Us</Link>
          
          {/* Menu Desktop Pintar */}
          {user && user.role === 'seller' && (
             <Link href="/dashboard/seller" className={styles.navLink} style={{color:'#FF9800', fontWeight:'bold'}}>Dashboard</Link>
          )}
          {user && user.role === 'user' && (
             <Link href="/dashboard" className={styles.navLink}>My Profile</Link>
          )}
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

          {/* Cart Icon */}
          <Link href="/cart" className={styles.iconButton} aria-label="Cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </Link>

          {/* Hamburger Menu */}
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

      {/* --- DROPDOWN MENU (MOBILE) --- */}
      {menuOpen && (
        <div className={styles.dropdownMenu}>
          
          {/* Salam Pembuka */}
          {user && (
             <div style={{padding: '10px 20px', fontWeight: 'bold', color: '#888', fontSize: '0.9rem'}}>
                Hi, {user.username} ({user.role})
             </div>
          )}

          {/* 1. MENU UNTUK SELLER */}
          {user && user.role === 'seller' && (
            <>
              <Link href="/dashboard/seller" className={styles.dropdownLink} onClick={toggleMenu}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"/>
                      <rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                  Seller Dashboard
              </Link>
              <Link href="/dashboard/seller/products" className={styles.dropdownLink} onClick={toggleMenu}>
                  📦 My Products
              </Link>
            </>
          )}

          {/* 2. MENU UNTUK BUYER (USER BIASA) */}
          {user && user.role === 'user' && (
            <>
              <Link href="/dashboard" className={styles.dropdownLink} onClick={toggleMenu}> 
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 0 0 0-4-4H8a4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                My Profile / Orders
              </Link>

              {/* TOMBOL UPGRADE TO SELLER */}
              <button 
                 onClick={handleBecomeSeller}
                 className={styles.dropdownLink}
                 style={{ color: '#FF9800', fontWeight: 'bold' }}
              >
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 21h18v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8z"></path>
                    <path d="M12 3L2 11h20L12 3z"></path>
                 </svg>
                 Buka Toko (Seller)
              </button>
            </>
          )}
          
          {/* 3. TOMBOL LOGOUT (Muncul kalau user login) */}
          {user && (
              <button 
                  onClick={handleLogout} 
                  className={styles.dropdownLink}
                  style={{color: 'red'}}
              >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
              </button>
          )}

          {/* 4. TOMBOL LOGIN (Muncul kalau belum login) */}
          {!user && (
            <Link href="/login" className={styles.dropdownLink} onClick={toggleMenu}> 
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;