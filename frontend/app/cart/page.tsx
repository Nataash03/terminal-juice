'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CartItem from '../components/CartItem';
import styles from './CartPage.module.css';

interface CartItemData {
  id: string | number; 
  name: string;
  imageSrc: string;
  details: string;
  quantity: number;
  price: number;
  isSelected: boolean;
}

export default function ShoppingCartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      const formattedCart = parsedCart.map((item: any) => ({
        id: item.id,
        name: item.name,
        imageSrc: item.imageSrc || '/images/placeholder-jus.jpg',
        details: 'Regular (500ml)', 
        quantity: item.quantity,
        price: item.price,
        isSelected: true,
      }));
      setCartItems(formattedCart);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const simpleCart = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageSrc: item.imageSrc
      }));
      localStorage.setItem('cart', JSON.stringify(simpleCart));
    }
  }, [cartItems, isLoaded]);

  const handleQuantityChange = (id: string | number, newQuantity: number) => {
    if (newQuantity < 1) {
       if (confirm("Hapus item ini?")) {
         setCartItems(items => items.filter(item => item.id !== id));
       }
       return;
    }
    setCartItems((items) =>
      items.map((item) => item.id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  const handleSelectChange = (id: string | number, selected: boolean) => {
    setCartItems((items) =>
      items.map((item) => item.id === id ? { ...item, isSelected: selected } : item)
    );
  };

  const calculateTotal = () => {
    return cartItems
      .filter((item) => item.isSelected)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const total = calculateTotal();
  const formattedTotal = `Rp ${total.toLocaleString('id-ID')}`;

  const handleCheckout = () => {
    router.push('/payment'); 
  };

  if (!isLoaded) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Shopping Bag</h1>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </header>

      <main className={styles.cartContent}>
        <div className={styles.itemsList}>
          {cartItems.length === 0 ? (
             <div style={{textAlign: 'center', padding: '40px'}}>Cart Kosong.</div>
          ) : (
            cartItems
              .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => (
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
            ))
          )}
        </div>
      </main>

      <div className={styles.checkoutSection}>
        <button
          className={styles.checkoutButton}
          disabled={total === 0}
          onClick={handleCheckout}
        >
          Checkout
        </button>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalAmount}>{formattedTotal}</span>
      </div>
    </div>
  );
}