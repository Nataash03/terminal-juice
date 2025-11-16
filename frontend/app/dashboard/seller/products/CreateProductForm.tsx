// File: app/dashboard/seller/products/CreateProductForm.tsx 

'use client';

import React, { useState } from 'react';
import styles from '../sellerDashboard.module.css'; 

// --- DEKLARASI TIPE ---
interface ProductFormProps {
    onSave: (newProductData: any) => Promise<void>; // Handler untuk POST data ke API
    onClose: () => void; // Handler untuk menutup form
    isSubmitting: boolean; // Status loading dari parent
}

// Data Awal untuk Produk Baru
const initialProductState = {
    name: '',
    price: '',
    stock: '',
    slug: '',
    images: [''],
    description: '',
};

const CreateProductForm: React.FC<ProductFormProps> = ({ onSave, onClose, isSubmitting }) => {
    
    const [newProduct, setNewProduct] = useState(initialProductState);
    
    // --- HANDLER INPUT ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        setNewProduct(prev => {
            const newValue = name === 'price' || name === 'stock' ? Number(value) : value;
            const newSlug = name === 'name' ? value.toLowerCase().replace(/ /g, '-') : prev.slug;
            
            return {
                ...prev,
                [name]: newValue,
                slug: newSlug,
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // 🚨 Validasi Sederhana
        const isNameValid = newProduct.name.trim() !== '';
        const isPriceValid = Number(newProduct.price) > 0; // Cek > 0
        const isStockValid = Number(newProduct.stock) > 0; // Cek > 0

        if (!isNameValid || !isPriceValid || !isStockValid) {
            alert("Nama, Harga, dan Stok wajib diisi dengan nilai positif.");
            return; // 🚨 HENTIKAN SUBMISSION JIKA INVALID
        }

        // Panggil handler dari parent (handleAddProduct)
        onSave(newProduct); 
    };

    return (
        <div className={styles.mainContentArea}>
            <h1 className={styles.pageTitle}>Tambah Produk Baru</h1>
            
            <form onSubmit={handleSubmit}>
                <div className={styles.tableWrapper} style={{ padding: '30px' }}>
                    
                    {/* Input Nama Produk */}
                    <p className={styles.formLabel}>Nama Produk</p>
                    <input 
                        type="text" 
                        name="name"
                        value={newProduct.name} 
                        className={styles.formInput}
                        onChange={handleInputChange}
                        required
                    />

                    {/* Input Deskripsi (Textarea) */}
                    <p className={styles.formLabel} style={{ marginTop: '20px' }}>Deskripsi Produk</p>
                    <textarea 
                        name="description"
                        value={newProduct.description || ''} 
                        className={styles.formInput} // Kita gunakan style yang sama
                        onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                        rows={3} // Membuat textarea 3 baris
                        placeholder="Jelaskan detail produk di sini..."
                    />
                    
                    {/* Input Harga */}
                    <p className={styles.formLabel} style={{ marginTop: '20px' }}>Harga</p>
                    <input 
                        type="number" 
                        name="price"
                        value={newProduct.price} 
                        className={styles.formInput}
                        onChange={handleInputChange}
                        required
                    />
                    
                    {/* Input Stok */}
                    <p className={styles.formLabel} style={{ marginTop: '20px' }}>Stok</p>
                    <input 
                        type="number" 
                        name="stock"
                        value={newProduct.stock} 
                        className={styles.formInput}
                        onChange={handleInputChange}
                        required
                    />
                    
                    {/* Input URL Gambar */}
                    <p className={styles.formLabel} style={{ marginTop: '20px' }}>URL Gambar Produk</p>
                    <input 
                        type="text" 
                        value={newProduct.images[0] || ''} 
                        className={styles.formInput}
                        placeholder="Paste URL gambar (images/jus-baru.jpg)"
                        // Logic untuk update array images (elemen pertama)
                        onChange={(e) => setNewProduct(prev => ({ ...prev, images: [e.target.value] }))} 
                        required
                    />
                    
                    {/* Input Slug (Hidden) */}
                    <input 
                        type="hidden" 
                        name="slug"
                        value={newProduct.slug} 
                    />
                    
                    {/* --- Tombol Aksi --- */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                        <button 
                            type="submit"
                            className={styles.submitButton} 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Product'}
                        </button>
                        <button 
                            type="button"
                            className={styles.cancelButton} 
                            onClick={onClose} 
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateProductForm;