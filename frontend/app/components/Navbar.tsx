'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie'; 
import styles from './Navbar.module.css';

// Tipe Data User
interface UserData {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'seller';
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  // State UI
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State User
  const [user, setUser] = useState<UserData | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const isActive = (href: string) => {
    return pathname === href || (pathname.startsWith(href) && href !== "/");
  };

  // 1. Cek Login Live
  useEffect(() => {
    setIsMounted(true);
    
    const checkUser = () => {
      const token = Cookies.get('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const cookieRole = Cookies.get('user_role');
          if (cookieRole && cookieRole !== parsedUser.role) {
             parsedUser.role = cookieRole;
          }
          setUser(parsedUser);
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Logic Search
  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setShowSearch(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
      Cookies.remove('token');
      Cookies.remove('user_role');
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      localStorage.removeItem('lastOrder');
      setUser(null);
      setMenuOpen(false);
      window.dispatchEvent(new Event('storage')); 
      router.push('/auth'); 
      router.refresh(); 
  };

  const handleBecomeSeller = async () => {
    if (!user) return;
    const verificationEmail = prompt("Masukkan EMAIL Anda untuk menerima Kode Verifikasi Seller:");
    if (!verificationEmail) return;
    
    alert(`Kode rahasia telah dikirimkan ke ${verificationEmail}. Cek inbox Anda (Kode rahasia: T_Juice_05)`);
    const secretCode = prompt("Masukkan KODE VERIFIKASI yang Anda terima:");
    if (!secretCode) return;

    const token = Cookies.get('token');
    try {
      const res = await fetch(`${baseUrl}/api/users/upgrade-to-seller`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ userId: user._id, secretCode: secretCode })
      });
      const data = await res.json();
      if (data.success) {
        alert("Selamat! Toko berhasil dibuka 🎉");
        const updatedUser = { ...user, role: 'seller' as const };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        Cookies.set('user_role', 'seller');
        setUser(updatedUser);
        setMenuOpen(false);
        window.dispatchEvent(new Event('storage')); 
        router.push('/dashboard/seller'); 
      } else {
        alert("Gagal: " + (data.message || "Kode verifikasi salah.")); 
      }
    } catch (error) {
      console.error(error);
      alert("Koneksi error.");
    }
  };

  if (!isMounted) return null;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          terminal juice.
        </Link>

        {/* Desktop */}
        <nav className={styles.nav}>
            <Link href="/shop" className={`${styles.navLink} ${isActive('/shop') ? styles.activeLink : ''}`}>Shop All</Link>
            <Link href="/flavours" className={`${styles.navLink} ${isActive('/flavours') ? styles.activeLink : ''}`}>Flavours</Link>
            <Link href="/about" className={`${styles.navLink} ${isActive('/about') ? styles.activeLink : ''}`}>About Us</Link>
            <Link href="/mission" className={`${styles.navLink} ${isActive('/mission') ? styles.activeLink : ''}`}>Our Mission</Link>

            {user ? (
              // Jika User Login
              <>
                {user.role === 'user' && (
                    <button 
                        onClick={handleBecomeSeller} 
                        className={styles.navLink}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#d63384', // Warna Pink
                            fontWeight: 'bold',
                            fontFamily: 'inherit',
                            fontSize: '16px'
                        }}
                    >
                        Buka Toko
                    </button>
                )}

                {/* Link Dashboard */}
                {user.role === 'seller' ? (
                  <Link href="/dashboard/se" className={styles.navLink} style={{color:'#d63384', fontWeight:'bold'}}>Seller Dashboard</Link>
                ) : (
                  <Link href="/dashboard" className={styles.navLink}>My Profile</Link>
                )}
              </>
            ) : (
              // Jika Belum Login
              <Link href="/auth" className={styles.navLink} style={{ fontWeight: 'bold' }}>Sign In</Link>
            )}
        </nav>

        {/* Actions (Search, Cart, Hamburger) */}
        <div className={styles.actions}>
          
          {/* Search Bar */}
          <div className={styles.searchWrapper} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {showSearch ? (
               <input 
                 type="text" 
                 placeholder="Search..." 
                 className={styles.searchInput} 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 onKeyDown={handleSearchKey}
                 autoFocus
                 onBlur={() => !searchQuery && setShowSearch(false)} 
               />
            ) : (
              <button onClick={() => setShowSearch(true)} className={styles.iconButton} aria-label="Search">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            )}
          </div>

          {/* Cart Icon */}
          {user && ( 
              <Link href="/cart" className={styles.iconButton} aria-label="Cart">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
              </Link>
          )}

          {/* Hamburger Button */}
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

      {/* Hamburger Menu*/}
      {menuOpen && (
        <div className={styles.dropdownMenu}>
          <Link href="/shop" className={styles.dropdownLink} onClick={toggleMenu}>Shop All</Link>
          <Link href="/flavours" className={styles.dropdownLink} onClick={toggleMenu}>Flavours</Link>
          <Link href="/about" className={styles.dropdownLink} onClick={toggleMenu}>About Us</Link>
          <Link href="/mission" className={styles.dropdownLink} onClick={toggleMenu}>Our Mission</Link>
          <hr style={{margin: '8px 0'}}/>
          
          {user ? (
             <>
               <div style={{padding: '10px 20px', fontWeight: 'bold', color: '#888', fontSize: '0.9rem'}}>
                  Hi, {user.username} ({user.role})
               </div>
               
               {user.role === 'seller' ? (
                  <Link href="/dashboard/se" className={styles.dropdownLink} onClick={toggleMenu}>Seller Dashboard</Link>
               ) : (
                  <>
                    <Link href="/dashboard/user" className={styles.dropdownLink} onClick={toggleMenu}>My Profile</Link>
                    {/* Tombol Buka Toko di Mobile */}
                    <button onClick={handleBecomeSeller} className={styles.dropdownLink} style={{ color: '#d63384' }}>Buka Toko (Seller)</button>
                  </>
               )}
               
               <button onClick={handleLogout} className={styles.dropdownLink} style={{color: 'red'}}>Logout</button>
             </>
          ) : (
            <Link href="/auth" className={styles.dropdownLink} onClick={toggleMenu}>Sign In</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;