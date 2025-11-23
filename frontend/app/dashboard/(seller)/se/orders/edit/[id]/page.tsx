"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '../../../../../../components/ProductForm'; 

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function EditProductPage() {
  const params = useParams();
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/products/${params.id}`);
        const data = await res.json();
        if (data.success) setProductData(data);
      } catch (error) { console.error(error); }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  if (!productData) return <div>Loading...</div>;

  return (
    <div>
      <ProductForm initialData={productData} isEditMode={true} />
    </div>
  );
}