"use client";
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import styles from './Incoming.module.css';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  createdAt: string;
  status: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  note?: string; 
}

export default function IncomingOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
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
      if (!data.success) {
        setOrders(prevOrders);
        alert("Gagal update status: " + (data.message || "Error backend"));
      }
    } catch (error) {
      setOrders(prevOrders);
      alert("Error koneksi backend");
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    
    let badgeClass = styles.badgePending; // Default
    if (s === 'paid' || s === 'processing') badgeClass = styles.badgePaid;
    if (s === 'ready') badgeClass = styles.badgeReady;
    if (s === 'completed') badgeClass = styles.badgeCompleted;
    if (s === 'cancelled') badgeClass = styles.badgeCancelled;

    return <span className={`${styles.badge} ${badgeClass}`}>{status}</span>;
  };

  if (loading) return <div style={{padding:40, textAlign: 'center', color: '#666'}}>Loading incoming orders...</div>;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Incoming Orders</h1>
        <p className={styles.subtitle}>Manage customer orders and update their status here.</p>
      </div>

      {orders.length === 0 ? (
        <div style={{textAlign: 'center', padding: '40px', color: '#888'}}>
            Belum ada pesanan masuk.
        </div>
      ) : (
        <div className={styles.grid}>
            {orders.map((order) => (
            <div key={order._id} className={styles.card}>
                
                {/* Header Kartu */}
                <div className={styles.cardHeader}>
                <div>
                    <div className={styles.orderId}>Order #{order._id.slice(-6).toUpperCase()}</div>
                    <div className={styles.time}>{new Date(order.createdAt).toLocaleString('id-ID')}</div>
                </div>
                {getStatusBadge(order.status)}
                </div>

                {/* Detail Item */}
                <div className={styles.items}>
                {order.items.map((item, idx) => (
                    <div key={idx} className={styles.itemRow}>
                        <span>{item.quantity}x {item.name}</span>
                        <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                ))}
                
                {/* Notes */}
                {order.note && (
                    <div className={styles.noteBox}>
                        <strong>📝 Note:</strong> "{order.note}"
                    </div>
                )}

                <div className={styles.totalRow}>
                    <span style={{color: '#d63384', fontWeight: 'bold'}}>Total ({order.paymentMethod})</span>
                    <span style={{color: '#d63384', fontWeight: 'bold'}}>Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className={styles.actions}>
                
                {['Pending', 'Paid', 'Processing'].includes(order.status) && (
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
      )}
    </div>
  );
}