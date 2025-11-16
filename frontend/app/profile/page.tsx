// File: frontend/app/profile/page.tsx

'use client'; 

import React, { useState, useEffect } from 'react'; 
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // 🚨 IMPORT INI UNTUK LOGOUT
import MyProfileDetails from '../components/Profile/MyProfileDetails';
import MyOrdersList from '../components/Profile/MyOrdersList';
import styles from './ProfilePage.module.css'; 

const STORAGE_KEY = 'profileActiveSection';
const PROFILE_API_URL = 'http://localhost:5001/api/users/profile'; // 🚨 URL API

// --- DEFINISI TIPE USER UNTUK STATE ---
interface UserProfile {
    fullName: string;
    email: string;
    phone?: string;
    address?: string;
    role: 'buyer' | 'seller';
}

export default function ProfileLayoutPage() {
    const router = useRouter(); // Inisialisasi router
    
    // 🚨 STATE UNTUK DATA USER LIVE
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [profileError, setProfileError] = useState<string | null>(null);
    
    // State untuk sidebar (tetap sama)
    const [activeSection, setActiveSection] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(STORAGE_KEY) || 'profile'; 
        }
        return 'profile';
    });
    
    // 🚨 useEffect 1: AMBIL DATA PROFIL DARI BACKEND
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('userToken');

            if (!token) {
                router.push('/login'); // Redirect jika tidak ada token
                return;
            }

            try {
                const response = await fetch(PROFILE_API_URL, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const result = await response.json();

                if (response.ok) {
                    setUser(result); // Set data user live
                } else {
                    throw new Error(result.message || 'Gagal mengambil data profil.');
                }

            } catch (err: any) {
                setProfileError("Gagal memuat profil: " + err.message);
                router.push('/login'); // Redirect jika token invalid
            } finally {
                setLoadingUser(false);
            }
        };

        fetchProfile();
    }, []);
    
    // useEffect 2: Simpan nilai state ke localStorage (tetap sama)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, activeSection);
        }
    }, [activeSection]);

    // 🚨 LOGIKA LOGOUT SEBENARNYA
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem(STORAGE_KEY); 
        router.push('/login'); // Arahkan ke halaman login
    };

    const renderContent = () => {
        // 🚨 TERUSKAN DATA USER LIVE KE MyProfileDetails
        switch (activeSection) {
            case 'profile':
                return <MyProfileDetails userData={user!} />; // 👈 PASS DATA USER
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
                return <MyProfileDetails userData={user!} />;
        }
    };
    
    // Fungsi untuk mendapatkan section key dari label
    const getSectionKey = (label: string) => label.toLowerCase().replace(' ', '');

    // Daftar menu untuk loop
    const menuItems = ['My Profile', 'My Orders', 'Notification', 'Log Out'];
    
    // --- PENANGANAN LOADING UTAMA ---
    if (loadingUser) {
        return <div className={styles.pageContainer}><p className="text-center">Memuat data profil...</p></div>;
    }
    
    // Jika user data gagal dimuat (token error, dll) dan bukan sedang loading
    if (profileError || !user) {
        return (
            <div className={styles.pageContainer}>
                <p className="text-center text-red-500">
                    {profileError || "Error: Data user tidak ditemukan. Silakan Login kembali."}
                </p>
            </div>
        );
    }

    // Gunakan user.fullName yang sebenarnya untuk inisial
    const initialName = user?.fullName || 'User'; 
    const avatarText = initialName.substring(0, 1).toUpperCase();


    return (
        <div className={styles.pageContainer}> 
            <div className={styles.profileCard}>
                
                {/* --- Left Sidebar / Navigation --- */}
                <aside className={styles.profileSidebar}>
                    <div className={styles.avatarContainer}>
                         {/* Inisial LIVE dari data backend */}
                         <span className={styles.avatarText}>
                            {avatarText}
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
                                                    handleLogout(); // Panggil handler logout yang benar
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