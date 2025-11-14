// frontend/app/components/Profile/MyOrdersList.tsx
'use client'; 

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './MyOrdersList.module.css'; 

// Data mock untuk produk
interface OrderItem {
    id: number;
    name: string;
    variant: string;
    quantity: number;
    price: number;
    imageSrc: string;
}

// Data mock untuk pesanan
interface Order {
    id: number;
    orderNumber: string;
    date: string;
    time: string;
    status: 'Preparing' | 'Active' | 'Completed';
    items: OrderItem[];
    total: number;
}

const mockOrders: Order[] = [
    {
        id: 1,
        orderNumber: 'Order #TJ-2024-001',
        date: 'November 5, 2025',
        time: '19:50',
        status: 'Preparing',
        items: [
            { id: 101, name: 'Juice Mix 2 in 1', variant: 'Regular (500ml)', quantity: 1, price: 15000, imageSrc: '/images/juice-placeholder.png' },
            { id: 102, name: 'Juice Melon', variant: 'Regular (500ml)', quantity: 2, price: 15000, imageSrc: '/images/juice-placeholder.png' },
        ],
        total: 45000,
    },
    {
        id: 2,
        orderNumber: 'Order #TJ-2024-002',
        date: 'November 5, 2025',
        time: '16:50',
        status: 'Preparing', // Menggunakan status yang sama dengan gambar
        items: [
            { id: 201, name: 'Juice Mix 2 in 1', variant: 'Regular (500ml)', quantity: 1, price: 15000, imageSrc: '/images/juice-placeholder.png' },
        ],
        total: 15000,
    },
    // ... bisa tambahkan data lain dengan status 'Active' atau 'Completed'
];


const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

export default function MyOrdersList() {
    const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');

    const filteredOrders = mockOrders.filter(order => {
        if (filter === 'All') return true;
        if (filter === 'Active') return order.status === 'Preparing' || order.status === 'Active';
        if (filter === 'Completed') return order.status === 'Completed';
        return false;
    });

    const getStatusBadgeColor = (status: Order['status']) => {
        switch (status) {
            case 'Preparing': return styles.badgePreparing;
            case 'Active': return styles.badgeActive;
            case 'Completed': return styles.badgeCompleted;
            default: return styles.badgeDefault;
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.ordersTitle}>My Orders</h2>
            
            {/* Filter Tabs */}
            <div className={styles.filterTabs}>
                {['All', 'Active', 'Completed'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab as 'All' | 'Active' | 'Completed')}
                        className={`${styles.filterButton} ${filter === tab ? styles.filterActive : ''}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* List of Orders */}
            <div className={styles.ordersList}>
                {filteredOrders.length === 0 ? (
                    <p className={styles.noOrders}>No orders found for this filter.</p>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.id} className={styles.orderItemCard}>
                            {/* Order Header */}
                            <div className={styles.orderHeader}>
                                <div>
                                    <p className={styles.orderNumber}>{order.orderNumber}</p>
                                    <p className={styles.orderDate}>{order.date} · {order.time}</p>
                                </div>
                                {/* Status Badge */}
                                <span className={`${styles.statusBadge} ${getStatusBadgeColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>

                            {/* Order Items */}
                            <div className={styles.itemsList}>
                                {order.items.map(item => (
                                    <div key={item.id} className={styles.itemRow}>
                                        <div className={styles.itemInfo}>
                                            <div className={styles.itemImageWrapper}>
                                                {/* Asumsi Anda memiliki placeholder image di /public/images/juice-placeholder.png */}
                                                <Image src={item.imageSrc} alt={item.name} width={40} height={40} />
                                            </div>
                                            <div className={styles.itemDetails}>
                                                <p className={styles.itemName}>{item.name}</p>
                                                <p className={styles.itemVariant}>{item.variant} &times; {item.quantity}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Harga per item, warna pink/merah */}
                                        <p className={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Order Total (Ditempatkan di luar itemsList, setelah garis pemisah) */}
                            <div className={styles.orderTotal}>
                                <span className={styles.totalLabel}>Total</span>
                                <span className={styles.totalAmount}>{formatCurrency(order.total)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}