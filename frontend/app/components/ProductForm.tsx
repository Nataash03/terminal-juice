'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import styles from './ProductForm.module.css';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

interface ProductFormProps {
  initialData?: any;
  isEditMode?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, isEditMode = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // State Form 
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [stock, setStock] = useState(initialData?.stock?.toString() || '');
  const [image, setImage] = useState(
    (initialData?.images && initialData.images.length > 0) 
      ? initialData.images[0] 
      : ''
  );

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setPrice(initialData.price?.toString() || '');
      setStock(initialData.stock?.toString() || '');
      setImage(
        (initialData.images && initialData.images.length > 0) 
          ? initialData.images[0] 
          : ''
      );
    }
  }, [initialData]);

  // Handler Upload ke Cloudinary
  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);

    const token = Cookies.get('token');
    
    if (!token) {
      alert("Upload gagal: Not authorized, no token");
      setUploading(false);
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
        body: formData, 
      });

      const data = await res.json();

      if (data.success) {
        setImage(data.filePath);
        alert('Gambar berhasil diupload ke Cloud! ☁️');
      } else {
        alert('Upload gagal: ' + (data.message || 'Check terminal backend for details.'));
      }
    } catch (error) {
      console.error(error);
      alert('Error saat mencoba koneksi upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = Cookies.get('token');

    const payload = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      images: [image],
    };

    try {
      const url = isEditMode 
        ? `${baseUrl}/api/products/${initialData._id}`
        : `${baseUrl}/api/products`;
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(isEditMode ? '✅ Product Updated!' : '✅ Product Created!');
        router.push('/dashboard/se/orders');
        router.refresh();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal menyimpan data');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
      <form onSubmit={handleSubmit} className={styles.contentWrapper}>
        <div className={styles.leftColumn}>
          <div className={styles.imagePreviewContainer}>
            {image ? (
              <img src={image} alt="Preview" className={styles.previewImg} />
            ) : (
              <div className={styles.placeholderText}>
                {uploading ? 'Uploading...' : 'No Image'}
              </div>
            )}
          </div>
        </div>
        <div className={styles.rightColumn}>
          <div>
            <label className={styles.label}>Product Name</label>
            <input 
              className={styles.input} 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
          </div>
          
          <div>
            <label className={styles.label}>Description</label>
            <textarea 
              className={styles.textarea} 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              rows={4} 
            />
          </div>
          
          <div>
            <label className={styles.label}>Price</label>
            <input 
              type="number" 
              className={styles.input} 
              value={price} 
              onChange={e => setPrice(e.target.value)} 
              required 
            />
          </div>
          
          <div>
            <label className={styles.label}>Stock</label>
            <input 
              type="number" 
              className={styles.input} 
              value={stock} 
              onChange={e => setStock(e.target.value)} 
              required 
            />
          </div>
          
          <div>
            <label className={styles.label}>Product Image</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input 
                type="file" 
                onChange={uploadFileHandler} 
                className={styles.input} 
                accept="image/*" 
              />
              {uploading && <span>⏳</span>}
            </div>
            <input 
              className={styles.input} 
              value={image} 
              readOnly 
              style={{ marginTop: 10, background: '#f9f9f9', fontSize: '0.8rem' }} 
              placeholder="URL otomatis muncul di sini" 
            />
          </div>

          <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              className={styles.saveBtn} 
              disabled={loading || uploading}
            >
              {loading ? '⏳ Saving...' : '💾 Save'}
            </button>
            <button 
              type="button" 
              className={styles.cancelBtn} 
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;