// frontend/app/profile/page.tsx
'use client'; 

// Tambahkan useEffect
import React, { useState, useEffect } from 'react'; 
import Image from 'next/image';
import MyProfileDetails from '../components/Profile/MyProfileDetails';
import MyOrdersList from '../components/Profile/MyOrdersList';
import styles from './ProfilePage.module.css'; 

const STORAGE_KEY = 'profileActiveSection'; // Key untuk localStorage

const mockUserProfile = {
    name: "Pengguna UAS",
    email: "user@example.com",
    avatar: "/images/avatar.png", 
};

export default function ProfileLayoutPage() {
    
    // 1. Ambil state dari localStorage saat inisialisasi
    const [activeSection, setActiveSection] = useState(() => {
        if (typeof window !== 'undefined') {
            // Coba ambil nilai tersimpan, jika tidak ada, gunakan 'profile' sebagai default
            return localStorage.getItem(STORAGE_KEY) || 'profile'; 
        }
        return 'profile'; // Default saat Server-Side Rendering (SSR)
    });
    
    // 2. Simpan nilai state ke localStorage setiap kali activeSection berubah
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, activeSection);
        }
    }, [activeSection]); // Dipanggil setiap kali activeSection berubah

    const renderContent = () => {
        switch (activeSection) {
            case 'profile':
                return <MyProfileDetails />;
            case 'orders':
                return <MyOrdersList />;
            case 'notification':
                return (
                    <div className={styles.notificationContent}>
                        <h2 className={styles.contentTitle}>Notification</h2>
                        <p>No new notifications at the moment.</p>
                    </div>
                );
            default:
                return <MyProfileDetails />;
        }
    };
    
    // Fungsi untuk mendapatkan section key dari label
    const getSectionKey = (label: string) => label.toLowerCase().replace(' ', '');
    
    // Daftar menu untuk loop
    const menuItems = ['My Profile', 'My Orders', 'Notification', 'Log Out'];

    return (
        <div className={styles.pageContainer}> 
            <div className={styles.profileCard}>
                
                {/* --- Left Sidebar / Navigation --- */}
                <aside className={styles.profileSidebar}>
                    <div className={styles.avatarContainer}>
                         {/* Inisial Statis */}
                         <span className={styles.avatarText}>
                            {mockUserProfile.name.substring(0, 1)}
                         </span>
                    </div>
                    
                    <nav className={styles.sidebarNav}>
                        <ul>
                            {menuItems.map(item => {
                                const sectionKey = getSectionKey(item);
                                return (
                                    <li key={sectionKey}>
                                        <button
                                            onClick={() => {
                                                if (item === 'Log Out') {
                                                    alert('Logging out...');
                                                    // Hapus persistensi saat logout
                                                    localStorage.removeItem(STORAGE_KEY); 
                                                    // Tambahkan router.push('/login') di sini
                                                } else {
                                                    setActiveSection(sectionKey);
                                                }
                                            }}
                                            className={`${styles.navButton} ${activeSection === sectionKey ? styles.active : ''}`}
                                        >
                                            {item}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </aside>

                {/* --- Main Content Area --- */}
                <main className={styles.mainContent}>
                    {renderContent()}
                </main>

            </div>
        </div>
    );
}