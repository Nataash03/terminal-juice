// frontend/app/cart/page.tsx
'use client';

import React, { useState } from 'react';
import CartItem from '../components/CartItem';
import styles from './ShoppingCart.module.css';

interface CartItemData {
  id: number;
  name: string;
  imageSrc: string;
  details: string;
  quantity: number;
  price: number;
  isSelected: boolean;
}

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState<CartItemData[]>([
    {
      id: 1,
      name: 'Juice Mix 2 in 1',
      imageSrc: '/images/juice-mix-2in1.png',
      details: 'Regular (500ml)\nLess Ice',
      quantity: 1,
      price: 15000,
      isSelected: true,
    },
    {
      id: 2,
      name: 'Juice Melon',
      imageSrc: '/images/juice-melon.png',
      details: 'Regular (500ml)\nLess sugar',
      quantity: 1,
      price: 15000,
      isSelected: true,
    },
    {
      id: 3,
      name: 'Juice Strawberry',
      imageSrc: '/images/juice-strawberry.png',
      details: 'Regular (500ml)',
      quantity: 2,
      price: 15000,
      isSelected: true,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  // Handle quantity change
  const handleQuantityChange = (id: number, newQuantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Handle select change
  const handleSelectChange = (id: number, selected: boolean) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isSelected: selected } : item
      )
    );
  };

  // Handle select all
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setCartItems(items =>
      items.map(item => ({ ...item, isSelected: checked }))
    );
  };

  // Calculate total
  const calculateTotal = () => {
    return cartItems
      .filter(item => item.isSelected)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const allSelected = cartItems.every(item => item.isSelected);
  const total = calculateTotal();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Shopping Bag</h1>
        
        <div className={styles.searchBar}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.cartContent}>
        {/* Cart Items */}
        <div className={styles.itemsList}>
          {cartItems.map(item => (
            <CartItem
              key={item.id}
              id={item.id}
              name={item.name}
              imageSrc={item.imageSrc}
              details={item.details}
              initialQuantity={item.quantity}
              price={item.price}
              isSelected={item.isSelected}
              onQuantityChange={handleQuantityChange}
              onSelectChange={handleSelectChange}
            />
          ))}
        </div>

        {/* Checkout Section */}
        <div className={styles.checkoutSection}>
          <div className={styles.selectAllWrapper}>
            <input
              type="checkbox"
              id="selectAll"
              className={styles.selectAllCheckbox}
              checked={allSelected}
              onChange={handleSelectAll}
            />
            <label htmlFor="selectAll" className={styles.selectAllLabel}>
              Select All
            </label>
          </div>

          <div className={styles.totalWrapper}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalAmount}>Rp {total.toLocaleString('id-ID')}</span>
          </div>

          <button className={styles.checkoutButton}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}