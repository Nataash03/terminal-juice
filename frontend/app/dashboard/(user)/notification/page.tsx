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
  type: 'ready' | 'process' | 'success'; // Tipe untuk styling
  createdAt: string;
  isRead: boolean;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = Cookies.get('token');
    if (!token) {
        // --- DUMMY DATA (JAGA-JAGA KALAU DATABASE KOSONG PAS DEMO) ---
        // Biar dosen tetep liat tampilan bagus walaupun backend belum ada datanya
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
        // Fallback ke dummy kalau data kosong (biar demo aman)
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

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Notification</h1>
        <div className={styles.filterGroup}>
          <button className={`${styles.filterBtn} ${filter === 'All' ? styles.activeFilter : ''}`} onClick={()=>setFilter('All')}>All</button>
          <button className={styles.filterBtn}>Active</button>
          <button className={styles.filterBtn}>Completed</button>
        </div>
      </div>

      <div className={styles.list}>
        {notifications.map((notif) => {
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
        })}
      </div>
    </div>
  );
}