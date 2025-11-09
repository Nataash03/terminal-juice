// frontend/app/cart/page.tsx
'use client';

import React, { useState } from 'react';
import CartItem from '../components/CartItem';
import styles from './CartPage.module.css';

interface CartItemData {
  id: number;
  name: string;
  imageSrc: string;
  details: string;
  quantity: number;
  price: number;
  isSelected: boolean;
}

// Data awal keranjang belanja
const initialCartItems: CartItemData[] = [
  {
    id: 1,
    name: 'Juice Mix 2 in 1',
    imageSrc: '/images/juice mix 2 in 1.png',
    details: 'Regular (500ml)\nLess Ice',
    quantity: 1,
    price: 15000,
    isSelected: true,
  },
  {
    id: 2,
    name: 'Juice Melon',
    imageSrc: '/images/juice melon.png',
    details: 'Regular (500ml)\nLess sugar',
    quantity: 1,
    price: 15000,
    isSelected: true,
  },
  {
    id: 3,
    name: 'Juice Strawberry',
    imageSrc: '/images/juice semangka.png',
    details: 'Regular (500ml)',
    quantity: 2,
    price: 15000,
    isSelected: true,
  },
];

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState<CartItemData[]>(initialCartItems);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle perubahan kuantitas item
  const handleQuantityChange = (id: number, newQuantity: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Handle perubahan status seleksi item
  const handleSelectChange = (id: number, selected: boolean) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isSelected: selected } : item
      )
    );
  };

  // Hitung total harga untuk item yang terpilih
  const calculateTotal = () => {
    return cartItems
      .filter((item) => item.isSelected)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const total = calculateTotal();
  const formattedTotal = `Rp ${total.toLocaleString('id-ID')}`;

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <header className={styles.header}>
        <h1 className={styles.title}>My Shopping Bag</h1>

        {/* Search Bar */}
        <div className={styles.searchBar}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Search cart items"
          />
        </div>
      </header>

      {/* Cart Items Section */}
      <main className={styles.cartContent}>
        <div className={styles.itemsList}>
          {cartItems.map((item) => (
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
      </main>

      {/* Checkout Section */}
      <div className={styles.checkoutSection}>
        <button
          className={styles.checkoutButton}
          disabled={total === 0}
          aria-label="Proceed to checkout"
        >
          Checkout
        </button>

        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalAmount}>{formattedTotal}</span>
      </div>
    </div>
  );
}