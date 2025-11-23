'use client'; 

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; 
import styles from './Payment.module.css'; 

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

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
  const [orderNotes, setOrderNotes] = useState('');

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) setCartItems(JSON.parse(storedCart));
    
    const token = Cookies.get('token');
    if (!token) router.push('/auth');
  }, []);

  // Hitung Total
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Logic Bayar
  const handlePayNow = async () => {
    setLoading(true);
    const token = Cookies.get('token'); 

    try {
      const response = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          items: cartItems,
          totalAmount,
          paymentMethod,
          notes: orderNotes 
        })
      });

      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('lastOrder', JSON.stringify(result.data));
        localStorage.removeItem('cart'); 
        router.push('/receipt'); 
      } else {
        alert('Gagal: ' + (result.message || 'Terjadi kesalahan saat memproses order.'));
      }
    } catch (error) {
      console.error(error);
      alert('Gagal menghubungi server. Pastikan backend berjalan.');
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

      {/* Notes */}
      <div className={styles.sectionTitle} style={{marginTop: '40px'}}>Special Requests</div>
      <textarea
        placeholder="Contoh: Tolong jusnya tanpa es, atau ditunggu di TSpace.."
        value={orderNotes}
        onChange={(e) => setOrderNotes(e.target.value)}
        rows={3}
        className={styles.notesTextarea} 
      />

      {/* Order Summary */}
      <div className={styles.summaryCard}>
        <h3>Order Summary</h3>
        
        {cartItems.map((item) => (
            <div 
                key={item.id} 
                className={styles.itemRow} 
            >
                <span>{item.quantity} x {item.name}</span>
                <span className={styles.totalPrice} style={{ textAlign: 'right' }}></span>
                <span style={{ fontWeight: 'bold' }}>
                  Rp. {(item.price * item.quantity).toLocaleString('id-ID')}
                </span>
            </div>
        ))}
        
        <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }}/>
        
        <div className={styles.totalRow}>
          <span>Total </span> 
          <span className={styles.totalPrice} style={{ textAlign: 'right' }}>
            {`Rp. ${totalAmount.toLocaleString('id-ID')}`}
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