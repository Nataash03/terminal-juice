'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Receipt.module.css';

const checkIconSrc = '/images/checklist.png';

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
      // Kalau gak ada data, balikin ke home
      router.push('/');
    }
  }, [router]);

  if (!order) return null;

  // Format Tanggal & Waktu
  const dateObj = new Date(order.createdAt);
  const dateString = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeString = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        {/* Header Struk dengan Custom Image */}
        <div className={styles.iconWrapper}>
             <img 
                src={checkIconSrc} 
                alt="Payment Success" 
                className={styles.checkIcon} 
             />
        </div>

        <h1 className={styles.title}>Payment Success!</h1>
        <p className={styles.subtitle}>Thank you for your order</p>

        {/* Box Detail */}
        <div className={styles.detailsBox}>
            
            {/* Baris Info */}
            <div className={styles.row}>
                <span className={styles.label}>Order ID</span>
                <span className={styles.value}>#{order._id.slice(-6).toUpperCase()}</span>
            </div>
            <div className={styles.row}>
                <span className={styles.label}>Date</span>
                <span className={styles.value}>{dateString}</span>
            </div>
            <div className={styles.row}>
                <span className={styles.label}>Time</span>
                <span className={styles.value}>{timeString} WIB</span>
            </div>
            <div className={styles.row}>
                <span className={styles.label}>Payment</span>
                <span className={styles.paymentBadge}>{order.paymentMethod}</span>
            </div>

            <div className={styles.divider}></div>

            {/* List Barang */}
            <div className={styles.itemsList}>
                {order.items.map((item, index) => (
                    <div key={index} className={styles.itemRow}>
                    <span>{item.quantity}x {item.name}</span>
                    <span>Rp. {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className={styles.totalRow}>
                <span className={styles.totalLabel}>TOTAL PAID</span>
                <span className={styles.totalAmount}>
                    Rp. {order.totalAmount.toLocaleString('id-ID')}
                </span>
            </div>
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