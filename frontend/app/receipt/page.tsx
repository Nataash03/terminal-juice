'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Receipt.module.css';

interface OrderData {
  _id: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
}

const ReceiptPage = () => {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    // Ambil data order terakhir
    const data = localStorage.getItem('lastOrder');
    if (data) {
      setOrder(JSON.parse(data));
    } else {
      // Kalau gak ada data (user iseng buka link langsung), balikin ke home
      router.push('/');
    }
  }, [router]);

  if (!order) return null;

  return (
    <div className={styles.container}>
      <div className={styles.receiptCard}>
        {/* Header Struk */}
        <div className={styles.header}>
          <div className={styles.checkIcon}>✅</div>
          <h2 className={styles.title}>Payment Success!</h2>
          <p className={styles.subtitle}>Thank you for your order</p>
        </div>

        <hr className={styles.dashedLine} />

        {/* Detail Info */}
        <div className={styles.infoRow}>
          <span>Order ID</span>
          <span className={styles.bold}>#{order._id.slice(-6).toUpperCase()}</span>
        </div>
        <div className={styles.infoRow}>
          <span>Date</span>
          <span>{new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
        </div>
        <div className={styles.infoRow}>
          <span>Time</span>
          <span>{new Date(order.createdAt).toLocaleTimeString('id-ID')}</span>
        </div>
        <div className={styles.infoRow}>
          <span>Payment</span>
          <span className={styles.paymentTag}>{order.paymentMethod}</span>
        </div>

        <hr className={styles.dashedLine} />

        {/* List Barang */}
        <div className={styles.itemsContainer}>
          {order.items.map((item, index) => (
            <div key={index} className={styles.itemRow}>
              <span>{item.quantity}x {item.name}</span>
              <span>Rp.{(item.price * item.quantity).toLocaleString('id-ID')}</span>
            </div>
          ))}
        </div>

        <hr className={styles.solidLine} />

        {/* Total */}
        <div className={styles.totalRow}>
          <span>TOTAL PAID</span>
          <span className={styles.totalAmount}>
            Rp.{order.totalAmount.toLocaleString('id-ID')}
          </span>
        </div>

        {/* Tombol Balik */}
        <button 
          className={styles.homeButton} 
          onClick={() => router.push('/')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ReceiptPage;