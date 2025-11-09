// frontend/app/dashboard/seller/products/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../sellerDashboard.module.css';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

export default function MyProducts() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('products');

  // Mock data produk
  const products: Product[] = [
    {
      id: 1,
      name: 'Juice Mix 2 in 1',
      category: 'Mixed Juice',
      price: 15000,
      stock: 50,
      image: '/images/juice mix 2 in 1.png',
    },
    {
      id: 2,
      name: 'Juice Melon',
      category: 'Fruit Juice',
      price: 15000,
      stock: 45,
      image: '/images/juice melon.png',
    },
    {
      id: 3,
      name: 'Juice Strawberry',
      category: 'Fruit Juice',
      price: 15000,
      stock: 60,
      image: '/images/juice semangka.png',
    },
  ];

  const handleNavigation = (path: string, menuName: string) => {
    setActiveMenu(menuName);
    router.push(path);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    router.push('/');
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
          <h1 className={styles.pageTitle}>My Products</h1>
        </header>

        {/* Products Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={styles.productThumb}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>Rp {product.price.toLocaleString('id-ID')}</td>
                  <td>{product.stock}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.editBtn}>Edit</button>
                      <button className={styles.deleteBtn}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className={styles.addProductBtn}>+ Add New Product</button>
      </main>
    </div>
  );
}