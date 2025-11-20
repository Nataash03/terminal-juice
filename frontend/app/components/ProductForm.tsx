// components/ProductForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ProductForm.module.css';

interface ProductFormProps {
  initialData?: any;
  isEditMode?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, isEditMode = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');

  // Load data lama jika mode Edit
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setPrice(initialData.price);
      setStock(initialData.stock);
      setImage(initialData.images?.[0] || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      images: [image], // Backend minta array string
      category: '64f8a...' // Dummy Category ID (Hardcode dulu biar aman)
    };

    try {
      // Tentukan URL & Method
      const url = isEditMode 
        ? `http://localhost:5001/api/products/${initialData._id}`
        : 'http://localhost:5001/api/products';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(isEditMode ? '✅ Update Berhasil!' : '✅ Produk Ditambahkan!');
        router.push('/dashboard/seller/products');
        router.refresh();
      } else {
        throw new Error('Gagal menyimpan data');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Kiri: Preview Image */}
      <div className={styles.imagePreviewBox}>
        {image ? (
           <img src={image} alt="Preview" className={styles.previewImg} />
        ) : (
           <div>📷<br/>Paste Image URL<br/>to see preview</div>
        )}
      </div>

      {/* Kanan: Form */}
      <form onSubmit={handleSubmit} className={styles.formContent}>
         <div className={styles.inputGroup}>
            <label>Nama Produk</label>
            <input className={styles.input} value={name} onChange={e=>setName(e.target.value)} required />
         </div>
         <div className={styles.inputGroup}>
            <label>Image URL</label>
            <input className={styles.input} value={image} onChange={e=>setImage(e.target.value)} placeholder="https://..." required />
         </div>
         <div className={styles.inputGroup}>
            <label>Deskripsi</label>
            <textarea className={styles.textarea} value={description} onChange={e=>setDescription(e.target.value)} rows={3} />
         </div>
         <div className={styles.inputGroup}>
            <label>Harga (Rp)</label>
            <input type="number" className={styles.input} value={price} onChange={e=>setPrice(e.target.value)} required />
         </div>
         <div className={styles.inputGroup}>
            <label>Stok</label>
            <input type="number" className={styles.input} value={stock} onChange={e=>setStock(e.target.value)} required />
         </div>

         <div className={styles.btnGroup}>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
               {loading ? 'Saving...' : '💾 Save Changes'}
            </button>
            <button type="button" className={styles.cancelBtn} onClick={() => router.back()}>
               Cancel
            </button>
         </div>
      </form>
    </div>
  );
};

export default ProductForm;