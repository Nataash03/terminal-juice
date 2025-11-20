'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Payment.module.css';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageSrc: string;
}

const PaymentPage = () => {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'Cash'>('QRIS');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load Cart dari LocalStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, []);

  // Hitung Total
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Logic Bayar
  const handlePayNow = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          totalAmount,
          paymentMethod
        })
      });

      const result = await response.json();
      if (result.success) {
        // 1. Simpan data order yang sukses ke LocalStorage buat ditampilkan di Struk
        localStorage.setItem('lastOrder', JSON.stringify(result.data));
        
        // 2. Bersihkan keranjang belanja
        localStorage.removeItem('cart'); 
        
        // 3. Lempar ke halaman Struk
        router.push('/receipt'); 
      } else {
        alert('Gagal: ' + result.message);
      }
    } catch (error) {
      console.error(error);
      alert('Error koneksi backend. Cek apakah server jalan di port 5001?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Payment</h1>

      {/* Step Indicator */}
      <div className={styles.progressBarContainer}>
         <div className={styles.step}>
            <div className={styles.circle}></div>
            <span>Details</span>
         </div>
         <div className={styles.line}></div>
         <div className={`${styles.step} ${styles.activeStep}`}>
            <div className={`${styles.circle} ${styles.activeCircle}`}></div>
            <span>Payment</span>
         </div>
      </div>

      {/* Pilihan Metode Pembayaran */}
      <div className={styles.sectionTitle}>Payment Method</div>
      <div className={styles.paymentMethods}>
        <div 
          className={`${styles.methodCard} ${paymentMethod === 'QRIS' ? styles.selected : ''}`}
          onClick={() => setPaymentMethod('QRIS')}
        >
          <strong>QRIS</strong>
        </div>
        <div 
          className={`${styles.methodCard} ${paymentMethod === 'Cash' ? styles.selected : ''}`}
          onClick={() => setPaymentMethod('Cash')}
        >
          <strong>Cash</strong>
        </div>
      </div>

      {/* Order Summary */}
      <div className={styles.summaryCard}>
        <h3>Order Summary</h3>
        
        {cartItems.map((item) => (
            <div 
                key={item.id} 
                className={styles.itemRow}
                style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '10px',
                    alignItems: 'center'
                }}
            >
               <span>{item.quantity}x {item.name}</span>
               <span style={{ fontWeight: 'bold' }}>
                 Rp.{(item.price * item.quantity).toLocaleString('id-ID')}
               </span>
            </div>
        ))}
        
        <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }}/>
        
        <div className={styles.totalRow}>
          <span>Total</span>
          <span className={styles.totalPrice}>
            Rp.{totalAmount.toLocaleString('id-ID')}
          </span>
        </div>

        <button 
            className={styles.payButton} 
            onClick={handlePayNow} 
            disabled={loading}
        >
            {loading ? 'Processing...' : 'Confirm Payment'}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;