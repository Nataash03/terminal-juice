// app/dashboard/seller/products/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SellerSidebar from './../../../components/SellerSidebar';
import styles from '../../Dashboard.module.css';

export default function ProductListPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/products');
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
    if(!confirm("Yakin mau hapus produk ini?")) return;
    
    try {
      const res = await fetch(`http://localhost:5001/api/products/${id}`, {
         method: 'DELETE'
      });
      if(res.ok) {
         // Update state biar hilang langsung
         setProducts(prev => prev.filter(p => p._id !== id));
      }
    } catch(err) {
       alert("Gagal menghapus");
    }
  };

  return (
    <div className={styles.container}>
      <SellerSidebar />
      
      <div className={styles.contentCard}>
        <div className={styles.headerRow}>
           <h2 className={styles.pageTitle}>My Products</h2>
           <Link href="/dashboard/seller/products/create" style={{textDecoration:'none'}}>
              <button style={{padding:'10px 20px', background:'#FF9800', color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:'bold'}}>
                + Add New
              </button>
           </Link>
        </div>

        {loading ? <p>Loading...</p> : (
           <div className={styles.productGrid}>
              {products.map((p) => (
                <div key={p._id} className={styles.productCard}>
                   <div className={styles.cardImage}>
                      <img src={p.images[0] || '/images/placeholder.png'} alt={p.name} />
                   </div>
                   <strong>{p.name}</strong>
                   <p style={{color:'#E91E63', fontWeight:'bold'}}>Rp {p.price.toLocaleString()}</p>
                   
                   <div style={{marginTop:'15px', display:'flex', gap:'10px', justifyContent:'center'}}>
                      <Link href={`/dashboard/seller/products/edit/${p._id}`} style={{textDecoration:'none'}}>
                         <span style={{padding:'5px 12px', border:'1px solid #4CAF50', color:'#4CAF50', borderRadius:'15px', fontSize:'0.8rem', cursor:'pointer'}}>✏️ Edit</span>
                      </Link>
                      <button onClick={() => handleDelete(p._id)} style={{padding:'5px 12px', border:'1px solid #F44336', background:'white', color:'#F44336', borderRadius:'15px', fontSize:'0.8rem', cursor:'pointer'}}>
                         🗑️ Del
                      </button>
                   </div>
                </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
}