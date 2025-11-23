"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import styles from '../SellerProducts.module.css';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function SellerMyProducts() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/products`);
        const data = await res.json();
        if (data.success) setProducts(data.data);
      } catch (error) { console.error(error); }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if(!confirm("Hapus produk ini?")) return;
    const token = Cookies.get('token');
    try {
        const res = await fetch(`${baseUrl}/api/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if(res.ok) setProducts(products.filter(p => p._id !== id));
    } catch(e) { console.error(e); }
  };

  return (
    <div>
       <div style={{display:'flex', justifyContent:'space-between', marginBottom: 20}}>
          <h2 style={{fontFamily:'Playfair Display, serif', fontSize:'2rem'}}>My Products</h2>
          <Link href="/dashboard/se/orders/new" style={{background:'#d63384', color:'white', padding:'10px 20px', borderRadius:'30px', textDecoration:'none', fontWeight:'bold'}}>+ Add Product</Link>
       </div>
       <div className={styles.grid}>
          {products.map((item) => (
            <div key={item._id} className={styles.card}>
              <img src={item.images?.[0] || '/images/placeholder-jus.jpg'} alt={item.name} className={styles.img} />
              <div className={styles.prodName}>{item.name}</div>
              <div className={styles.price}>Rp {item.price.toLocaleString()}</div>
              <div className={styles.actions}>
                <Link href={`/dashboard/se/orders/edit/${item._id}`} className={styles.btn} style={{textDecoration:'none', color:'black', display:'flex', justifyContent:'center', alignItems:'center'}}>✏️ Edit</Link>
                <button onClick={() => handleDelete(item._id)} className={styles.btn} style={{color:'red'}}>🗑️ Del</button>
              </div>
            </div>
          ))}
       </div>
    </div>
  );
}