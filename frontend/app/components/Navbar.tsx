'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; 
import styles from './Navbar.module.css';
import { usePathname } from 'next/navigation';

// Ambil URL dari env
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

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
  const pathname = usePathname();
  
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
      // Kita cek cookie token dulu untuk memastikan sesi valid
      const token = Cookies.get('token');
      const storedUser = localStorage.getItem('user'); // Kita pakai localStorage hanya untuk display nama/email

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Sinkronisasi role dari cookie jika ada perbedaan (misal habis upgrade)
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

    // Event listener biar kalau login di tab lain, sini ikut update
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // 2. Handler Logout
  const handleLogout = () => {
      // Hapus Cookies 
      Cookies.remove('token');
      Cookies.remove('user_role');
      
      // Hapus LocalStorage
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      localStorage.removeItem('lastOrder');

      setUser(null);
      setMenuOpen(false);
      
      // Redirect ke halaman Auth
      router.push('/auth'); 
      router.refresh(); // Refresh agar state di server component reset
  };

  // 3. Handler Upgrade to Seller
  const handleBecomeSeller = async () => {
    if (!user) return;
    
    // Minta Email Verif
    const verificationEmail = prompt("Masukkan EMAIL Anda untuk menerima Kode Verifikasi Seller:");
    
    if (!verificationEmail) {
        alert("Verifikasi dibatalkan.");
        return;
    }
    
    // Simulasi Kirim Secret Code
    alert(`Kode rahasia telah dikirimkan ke ${verificationEmail}. Cek inbox Anda (Kode rahasia: T_Juice_05)`);

    // Input Secret Code
    const secretCode = prompt("Masukkan KODE VERIFIKASI yang Anda terima di email:");
    
    if (!secretCode) {
        alert("Verifikasi dibatalkan.");
        return; 
    }

    const token = Cookies.get('token');

    try {
      const res = await fetch(`${baseUrl}/api/users/upgrade-to-seller`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        // Mengirim kode rahasia ke Backend untuk diverif
        body: JSON.stringify({ 
            userId: user._id,
            secretCode: secretCode // backend verif kode ini
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Selamat! Toko berhasil dibuka 🎉");
        
        // A. Update State & LocalStorage
        const updatedUser = { ...user, role: 'seller' as const };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        Cookies.set('user_role', 'seller');
        setUser(updatedUser);
        setMenuOpen(false);
        
        // B. Redirect
        router.push('/dashboard/se'); 
      } else {
        alert("Gagal: " + (data.message || "Kode verifikasi salah.")); 
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

        {/* Navigasi Desktop */}
        <nav className={styles.nav}>
                <Link 
                    href="/shop" 
                    className={`${styles.navLink} ${isActive('/shop') ? styles.activeLink : ''}`}
                >
                    Shop All
                </Link>
                <Link 
                    href="/flavours" 
                    className={`${styles.navLink} ${isActive('/flavours') ? styles.activeLink : ''}`}
                >
                    Flavours
                </Link>
                <Link 
                    href="/about" 
                    className={`${styles.navLink} ${isActive('/about') ? styles.activeLink : ''}`}
                >
                    About Us
                </Link>
                <Link 
                    href="/mission" 
                    className={`${styles.navLink} ${isActive('/mission') ? styles.activeLink : ''}`}
                >
                    Our Mission 
                </Link>

          
          {/* Menu Desktop Pintar */}
          {user && user.role === 'seller' && (
             <Link href="/dashboard/se" className={styles.navLink} style={{color:'#d63384', fontWeight:'bold'}}>Seller Dashboard</Link>
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
          {user && ( 
                    <Link href="/cart" className={styles.iconButton} aria-label="Cart">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 0 0 0 2-2V6l-3-4z"/>
                          <line x1="3" y1="6" x2="21" y2="6"/>
                          <path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                    </Link>
                )}

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

          {/* Menu Publik Dipindahkan ke Sini */}
          <Link href="/shop" className={`${styles.dropdownLink} ${isActive('/shop') ? styles.activeLink : ''}`} onClick={toggleMenu}>Shop All</Link>
          <Link href="/flavours" className={`${styles.dropdownLink} ${isActive('/flavours') ? styles.activeLink : ''}`} onClick={toggleMenu}>Flavours</Link>
          <Link href="/about" className={`${styles.dropdownLink} ${isActive('/about') ? styles.activeLink : ''}`} onClick={toggleMenu}>About Us</Link>
          <Link href="/mission" className={`${styles.dropdownLink} ${isActive('/mission') ? styles.activeLink : ''}`} onClick={toggleMenu}>Our Mission</Link>
          <hr style={{margin: '8px 0'}}/>
          
          {/* Salam Pembuka */}
          {user && (
             <div style={{padding: '10px 20px', fontWeight: 'bold', color: '#888', fontSize: '0.9rem'}}>
                Hi, {user.username} ({user.role})
             </div>
          )}

          {/* 1. MENU UNTUK SELLER */}
          {user && user.role === 'seller' && (
            <>
              <Link href="/dashboard/se" className={styles.dropdownLink} onClick={toggleMenu}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"/>
                      <rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                  Seller Dashboard
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
                My Profile
              </Link>

              {/* TOMBOL UPGRADE TO SELLER */}
              <button 
                 onClick={handleBecomeSeller}
                 className={styles.dropdownLink}
                 style={{ color: '#d63384', fontWeight: 'bold' }}
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

          {/* 4. TOMBOL SIGN IN (Muncul kalau belum login) */}
          {!user && (
            <Link href="/auth" className={styles.dropdownLink} onClick={toggleMenu}> 
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
