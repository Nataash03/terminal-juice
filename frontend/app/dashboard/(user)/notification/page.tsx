"use client";
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import styles from './Notification.module.css';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Tipe Data Notifikasi
interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'ready' | 'process' | 'success' | 'info' | 'cancelled'; // Tambah tipe yang mungkin
  createdAt: string;
  isRead: boolean;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  // State untuk menampung filter yang aktif: 'All', 'Active', 'Completed'
  const [activeFilter, setActiveFilter] = useState('All'); 

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = Cookies.get('token');
    // Jika token hilang, gunakan dummy data untuk demo agar tampilan tidak kosong
    if (!token) {
        setNotifications([
            { _id: '1', title: 'Your Order is Ready!', message: 'Order #TJ-2024-001 is ready go pick it up in terminal juice!', type: 'ready', createdAt: '', isRead: false },
            { _id: '2', title: 'Your Order is being process', message: 'Order #TJ-2024-001 is in the kitchen please wait for a moment', type: 'process', createdAt: '', isRead: true },
            { _id: '3', title: 'Payment Successful', message: 'Payment of Rp 85.000 for order #TJ-2024-045 has been received successfully.', type: 'success', createdAt: '', isRead: true },
        ]);
        setLoading(false);
        return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setNotifications(data.data);
      } else {
         // Fallback ke dummy jika DB kosong
         setNotifications([
            { _id: '1', title: 'Your Order is Ready!', message: 'Order #TJ-2024-001 is ready go pick it up in terminal juice!', type: 'ready', createdAt: '', isRead: false },
            { _id: '2', title: 'Your Order is being process', message: 'Order #TJ-2024-001 is in the kitchen please wait for a moment', type: 'process', createdAt: '', isRead: true },
            { _id: '3', title: 'Payment Successful', message: 'Payment of Rp 85.000 for order #TJ-2024-045 has been received successfully.', type: 'success', createdAt: '', isRead: true },
        ]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk menentukan Icon & Style Kartu
  const getCardStyle = (type: string) => {
    switch (type) {
      case 'ready': return { cardClass: styles.cardHighlight, iconClass: styles.iconReady, icon: '🥤' };
      case 'process': return { cardClass: '', iconClass: styles.iconProcess, icon: '⏱️' };
      case 'success': return { cardClass: '', iconClass: styles.iconSuccess, icon: '✅' };
      default: return { cardClass: '', iconClass: '', icon: '🔔' };
    }
  };

  // --- LOGIKA FILTER FRONTEND ---
  const handleFilterChange = (filterType: string) => {
    setActiveFilter(filterType);
  };

  const filteredNotifications = notifications.filter(notif => {
    // Tipe notifikasi yang dianggap 'Active' (masih butuh perhatian user)
    const activeTypes = ['ready', 'process', 'info'];
    
    // Tipe notifikasi yang dianggap 'Completed' (sudah selesai/final)
    const completedTypes = ['success', 'cancelled'];
    
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Active') return activeTypes.includes(notif.type);
    if (activeFilter === 'Completed') return completedTypes.includes(notif.type);
    
    return true;
  });
  // -----------------------------


  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading notifications...</div>;


  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Notification</h1>
        <div className={styles.filterGroup}>
          
          {/* TOMBOL ALL */}
          <button 
            className={`${styles.filterBtn} ${activeFilter === 'All' ? styles.activeFilter : ''}`} 
            onClick={() => handleFilterChange('All')}
          >
            All
          </button>
          
          {/* TOMBOL ACTIVE */}
          <button 
            className={`${styles.filterBtn} ${activeFilter === 'Active' ? styles.activeFilter : ''}`}
            onClick={() => handleFilterChange('Active')}
          >
            Active
          </button>
          
          {/* TOMBOL COMPLETED */}
          <button 
            className={`${styles.filterBtn} ${activeFilter === 'Completed' ? styles.activeFilter : ''}`}
            onClick={() => handleFilterChange('Completed')}
          >
            Completed
          </button>
        </div>
      </div>

      <div className={styles.list}>
        {filteredNotifications.length === 0 ? (
            <div style={{textAlign: 'center', padding: '60px', color: '#888'}}>
                Tidak ada notifikasi di filter ini.
            </div>
        ) : (
            filteredNotifications.map((notif) => {
              const { cardClass, iconClass, icon } = getCardStyle(notif.type);
              
              return (
                <div key={notif._id} className={`${styles.card} ${cardClass}`}>
                  <div className={styles.leftContent}>
                    {/* Icon Bulat */}
                    <div className={`${styles.iconCircle} ${iconClass}`}>
                      {icon}
                    </div>
                    {/* Text Content */}
                    <div className={styles.textContent}>
                      <h3>{notif.title}</h3>
                      <p>{notif.message}</p>
                    </div>
                  </div>
                  
                  <button className={styles.viewBtn}>View Order</button>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}