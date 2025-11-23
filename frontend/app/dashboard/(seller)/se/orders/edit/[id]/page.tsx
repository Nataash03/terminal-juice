"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '../../../../../../components/ProductForm'; 

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function EditProductPage() {
  const params = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); 

  useEffect(() => {
    const fetchProduct = async () => {
      console.log('Fetching Product ID:', params.id);

      try {
        const res = await fetch(`${baseUrl}/api/products/${params.id}`);
        
        if (!res.ok) {
          const status = res.status;
          let errorMessage = `API Gagal! Status: ${status}.`;
          
          if (status === 404) {
            errorMessage = 'Produk tidak ditemukan (404). Mungkin sudah dihapus.';
          } else if (status >= 500) {
            errorMessage = `Server Error (${status}). Cek terminal backend untuk CastError/typo.`;
          }

          throw new Error(errorMessage);
        }
        
        const data = await res.json();
        
        if (data.success) {
          setProductData(data.data);
        } else {
          setErrorMsg(data.message || 'Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        if (err instanceof Error) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading product data...</div>;
  }
  
  if (errorMsg) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>Error: {errorMsg}</div>;
  }
  
  if (!productData) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Product not found</div>;
  }

  return (
    <div>
      <h1 style={{ padding: '20px' }}>Edit Product</h1>
      <ProductForm initialData={productData} isEditMode={true} />
    </div>
  );
}