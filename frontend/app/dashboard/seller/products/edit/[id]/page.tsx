// app/dashboard/seller/products/edit/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SellerSidebar from './../../../../../components/SellerSidebar';
import ProductForm from './../../../../../components/ProductForm';
import styles from './../../../Dashboard.module.css';

export default function EditProductPage() {
  const params = useParams();
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    // Fetch data spesifik
    fetch(`http://localhost:5001/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => setProductData(data.data || data))
      .catch(err => console.error(err));
  }, [params.id]);

  return (
    <div className={styles.container}>
      <SellerSidebar />
      <div className={styles.contentCard}>
         <h2 className={styles.pageTitle} style={{marginBottom:'30px'}}>Edit Product</h2>
         
         {productData ? (
            <ProductForm initialData={productData} isEditMode={true} />
         ) : (
            <p>Loading data...</p>
         )}
      </div>
    </div>
  );
}