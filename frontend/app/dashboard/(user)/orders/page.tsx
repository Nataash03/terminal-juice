"use client";

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import styles from './UserOrders.module.css';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Interface Data 
interface OrderItem {
  id: string; // atau _id
  name: string;
  price: number;
  quantity: number;
  imageSrc?: string;
}

interface Order {
  _id: string;
  createdAt: string; // Tanggal order
  status: string; // 'pending', 'processing', 'completed', 'cancelled'
  totalAmount: number;
  items: OrderItem[];
  paymentMethod: string;
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); 

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = Cookies.get('token');
    if (!token) {
        setLoading(false);
        return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      
      if (data.success) {
        setOrders(data.data || []); 
      } else {
        console.error("Gagal ambil order:", data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper: Format Tanggal
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Helper: Warna Badge Status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <span className={`${styles.badge} ${styles.completedBadge}`}>✅ Completed</span>;
      case 'processing':
      case 'preparing':
        return <span className={styles.badge}>⏳ Preparing</span>;
      case 'cancelled':
        return <span className={styles.badge} style={{background:'#ffebee', color:'red', borderColor:'red'}}>❌ Cancelled</span>;
      default: // Pending
        return <span className={styles.badge} style={{background:'#e3f2fd', color:'#0d47a1', borderColor:'#90caf9'}}>🕒 Pending</span>;
    }
  };

  // Logic Filter (Opsional, filter di sisi frontend)
  const filteredOrders = orders.filter(order => {
    if (filter === 'All') return true;
    if (filter === 'Active') return ['pending', 'processing'].includes(order.status.toLowerCase());
    if (filter === 'Completed') return order.status.toLowerCase() === 'completed';
    return true;
  });

  if (loading) return <div style={{padding:40, textAlign:'center'}}>Loading orders...</div>;

  return (
    <div>
      {/* Header & Filter */}
      <div className={styles.header}>
        <h1 className={styles.title}>My Orders</h1>
        <div className={styles.filterGroup}>
          <button 
            className={`${styles.filterBtn} ${filter === 'All' ? styles.activeFilter : ''}`}
            onClick={() => setFilter('All')}
          >All</button>
          <button 
            className={`${styles.filterBtn} ${filter === 'Active' ? styles.activeFilter : ''}`}
            onClick={() => setFilter('Active')}
          >Active</button>
          <button 
            className={`${styles.filterBtn} ${filter === 'Completed' ? styles.activeFilter : ''}`}
            onClick={() => setFilter('Completed')}
          >Completed</button>
        </div>
      </div>

      {/* List Order Cards */}
      <div className={styles.ordersList}>
        
        {filteredOrders.length === 0 ? (
            <div style={{textAlign:'center', color:'#888', marginTop: 40}}>
                Belum ada pesanan {filter !== 'All' ? `di tab ${filter}` : ''}
            </div>
        ) : (
            filteredOrders.map((order) => (
                <div key={order._id} className={styles.card}>
                  {/* Header Kartu */}
                  <div className={styles.cardHeader}>
                    <div className={styles.orderInfo}>
                      <strong>Order #{order._id.substring(order._id.length - 8).toUpperCase()}</strong>
                      <div className={styles.date}>{formatDate(order.createdAt)}</div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  {/* List Item dalam 1 Order */}
                  {order.items.map((item, index) => (
                      <div key={index} className={styles.itemRow}>
                        <div className={styles.itemDetail}>
                          {/* Gambar Item */}
                          {item.imageSrc ? (
                             <img 
                                src={item.imageSrc} 
                                alt={item.name} 
                                style={{width:50, height:50, borderRadius:10, objectFit:'cover'}} 
                             />
                          ) : (
                             <div className={styles.itemPlaceholder}></div> 
                          )}
                          
                          <div>
                            <div className={styles.itemName}>{item.name}</div>
                            <div className={styles.itemQty}>{item.quantity} pcs</div>
                          </div>
                        </div>
                        <div className={styles.itemPrice}>
                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                        </div>
                      </div>
                  ))}

                  {/* Footer Kartu */}
                  <div className={styles.cardFooter}>
                    <span>Total ({order.paymentMethod})</span>
                    <span className={styles.totalPrice}>
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
            ))
        )}

      </div>
    </div>
  );
}