// frontend/app/dashboard/seller/notifications/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../sellerDashboard.module.css';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'order' | 'product' | 'system';
}

export default function Notifications() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('notifications');

  // Mock data notifikasi
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'New Order Received',
      message: 'You have a new order for Juice Mix 2 in 1',
      time: '2 minutes ago',
      isRead: false,
      type: 'order',
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      message: 'Juice Melon is running low on stock (5 items left)',
      time: '1 hour ago',
      isRead: false,
      type: 'product',
    },
    {
      id: 3,
      title: 'Order Completed',
      message: 'Order #12345 has been completed',
      time: '3 hours ago',
      isRead: true,
      type: 'order',
    },
    {
      id: 4,
      title: 'System Update',
      message: 'New features are now available in your dashboard',
      time: '1 day ago',
      isRead: true,
      type: 'system',
    },
  ]);

  const handleNavigation = (path: string, menuName: string) => {
    setActiveMenu(menuName);
    router.push(path);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    router.push('/');
  };

  const markAsRead = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '🛒';
      case 'product':
        return '📦';
      case 'system':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.profile}>
          <div className={styles.avatar}>
            <span>TJ</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${
              activeMenu === 'dashboard' ? styles.navItemActive : ''
            }`}
            onClick={() => handleNavigation('/dashboard/seller', 'dashboard')}
          >
            Dashboard
          </button>

          <button
            className={`${styles.navItem} ${
              activeMenu === 'products' ? styles.navItemActive : ''
            }`}
            onClick={() =>
              handleNavigation('/dashboard/seller/products', 'products')
            }
          >
            My Products
          </button>

          <button
            className={`${styles.navItem} ${
              activeMenu === 'notifications' ? styles.navItemActive : ''
            }`}
            onClick={() =>
              handleNavigation('/dashboard/seller/notifications', 'notifications')
            }
          >
            Notification
          </button>

          <button className={styles.navItem} onClick={handleLogout}>
            Log Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Notifications</h1>
        </header>

        {/* Notifications List */}
        <div className={styles.notificationsList}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.notificationCard} ${
                notification.isRead ? styles.notificationRead : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className={styles.notificationIcon}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className={styles.notificationContent}>
                <h3 className={styles.notificationTitle}>
                  {notification.title}
                </h3>
                <p className={styles.notificationMessage}>
                  {notification.message}
                </p>
                <span className={styles.notificationTime}>
                  {notification.time}
                </span>
              </div>
              {!notification.isRead && (
                <div className={styles.unreadBadge}></div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}