"use client";
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import styles from './Incoming.module.css';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function IncomingOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Semua Order
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = Cookies.get('token');
    try {
      const res = await fetch(`${baseUrl}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fungsi Update Status 
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const token = Cookies.get('token');
    
    const prevOrders = [...orders];
    setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));

    try {
      const res = await fetch(`${baseUrl}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (data.success) {
      } else {
        setOrders(prevOrders);
        alert("Gagal update status: " + data.message);
      }
    } catch (error) {
      setOrders(prevOrders);
      alert("Error koneksi backend");
    }
  };

  // Helper: Render Badge
  const getStatusBadge = (status: string) => {
    let style = styles.badgePending;
    if (status === 'Paid') style = styles.badgePaid;
    if (status === 'Ready') style = styles.badgeReady;
    if (status === 'Completed') style = styles.badgeCompleted;
    return <span className={`${styles.badge} ${style}`}>{status}</span>;
  };

  if (loading) return <div style={{padding:40}}>Loading incoming orders...</div>;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Incoming Orders</h1>
        <p className={styles.subtitle}>Manage customer orders and update their status here.</p>
      </div>

      <div className={styles.grid}>
        {orders.map((order) => (
          <div key={order._id} className={styles.card}>
            
            {/* Header Kartu */}
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.orderId}>Order #{order._id.slice(-6).toUpperCase()}</div>
                <div className={styles.time}>{new Date(order.createdAt).toLocaleString()}</div>
              </div>
              {getStatusBadge(order.status)}
            </div>

            {/* Detail Item */}
            <div className={styles.items}>
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className={styles.itemRow}>
                  <span>{item.quantity}x {item.name}</span>
                  <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className={styles.totalRow}>
                <span>Total ({order.paymentMethod})</span>
                <span>Rp {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className={styles.actions}>
              
              {(order.status === 'Pending' || order.status === 'Paid') && (
                <button 
                    className={`${styles.btnAction} ${styles.btnReady}`}
                    onClick={() => handleUpdateStatus(order._id, 'Ready')}
                >
                    🔔 Mark as Ready
                </button>
              )}

              {order.status === 'Ready' && (
                <button 
                    className={`${styles.btnAction} ${styles.btnComplete}`}
                    onClick={() => handleUpdateStatus(order._id, 'Completed')}
                >
                    ✅ Complete Order
                </button>
              )}

              {order.status === 'Completed' && (
                <button className={`${styles.btnAction} ${styles.btnDisabled}`} disabled>
                    Finished
                </button>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}