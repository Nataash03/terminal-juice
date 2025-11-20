// app/dashboard/seller/products/create/page.tsx
'use client';

import React from 'react';
import SellerSidebar from './../../../../components/SellerSidebar';
import ProductForm from './../../../../components/ProductForm';
import styles from './../../Dashboard.module.css';

export default function CreateProductPage() {
  return (
    <div className={styles.container}>
      <SellerSidebar />
      <div className={styles.contentCard}>
         <h2 className={styles.pageTitle} style={{marginBottom:'30px'}}>Add New Product</h2>
         <ProductForm />
      </div>
    </div>
  );
}