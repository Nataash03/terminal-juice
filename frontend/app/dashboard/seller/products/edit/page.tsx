// frontend/app/dashboard/products/edit/page.tsx
'use client'; 

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './EditProductsPage.module.css'; // Import CSS Module

// Data mock untuk produk yang akan diedit (jika ID ada di URL)
const mockProduct = {
    name: "Juice Mix 2 in 1",
    description: "A super refreshing blend of mango, banana, and pineapple, providing essential vitamins.",
    price: 20000,
    stock: 45,
    imageUrl: "/images/juice-mix-2-in-1.png", // Path gambar mock
};

export default function EditProductsPage() {
    // State untuk form input
    const [formData, setFormData] = useState({
        productName: mockProduct.name,
        productDescription: mockProduct.description,
        price: mockProduct.price.toString(),
        stock: mockProduct.stock.toString(),
        // Anda bisa tambahkan field untuk upload gambar di sini
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Product saved/updated! (Simulasi API POST/PUT)');
        console.log('Data yang disimpan:', formData);
        // Di sini nanti akan ada logika API call ke backend untuk CREATE atau UPDATE
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Edit Products</h1>
            
            <form onSubmit={handleSubmit} className={styles.editForm}>
                
                {/* Kolom Kiri: Visual Produk */}
                <div className={styles.visualColumn}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src={mockProduct.imageUrl}
                            alt="Product Visual"
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                </div>

                {/* Kolom Kanan: Form Input */}
                <div className={styles.formColumn}>
                    {/* Product Name */}
                    <label htmlFor="productName" className={styles.formLabel}>Product Name</label>
                    <input
                        type="text"
                        id="productName"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        className={styles.formInput}
                        placeholder="e.g., Juice Mix 2 in 1"
                    />

                    {/* Product Description */}
                    <label htmlFor="productDescription" className={styles.formLabel}>Product Description</label>
                    <textarea
                        id="productDescription"
                        name="productDescription"
                        value={formData.productDescription}
                        onChange={handleChange}
                        rows={4}
                        className={`${styles.formInput} ${styles.textareaInput}`}
                        placeholder="Enter a detailed description of the product"
                    />

                    {/* Price */}
                    <label htmlFor="price" className={styles.formLabel}>Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={styles.formInput}
                        placeholder="e.g., 20000"
                    />

                    {/* Stock */}
                    <label htmlFor="stock" className={styles.formLabel}>Stock</label>
                    <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className={styles.formInput}
                        placeholder="e.g., 50"
                    />

                    {/* Placeholder for optional fields or image upload */}
                    <div className={styles.placeholderInput}></div>
                    
                    {/* Action Buttons */}
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.saveButton}>
                            <span className={styles.leafIcon}>&#x1F343;</span> Save Changes
                        </button>
                        <button type="button" className={styles.cancelButton} onClick={() => console.log('Cancel clicked')}>
                            cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}