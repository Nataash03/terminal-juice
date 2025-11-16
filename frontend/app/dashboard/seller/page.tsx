'use client';

import React, { useState, useEffect } from 'react';
// ... (imports styles dan components untuk tabel) ...

const API_PRODUCTS_URL = 'http://localhost:5001/api/products'; 

const SellerDashboard: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductsForAdmin = async () => {
      setLoading(true);
      const token = localStorage.getItem('userToken'); // 🚨 Ambil token

      if (!token) {
        setError('Akses ditolak. Silakan login sebagai Seller.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(API_PRODUCTS_URL, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // 🚨 Kirim token
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 403) { // 403 Forbidden: bukan seller
            throw new Error('Anda tidak memiliki izin akses (Bukan Seller).');
        }

        const result = await response.json();
        setProducts(result.data || []); 

      } catch (err: any) {
        setError(err.message || 'Gagal memuat data produk.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductsForAdmin();
  }, []);

  // --- Tampilan Dashboard ---
  if (loading) return <div className="p-10 text-center">Memuat data produk...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard: Product Management</h1>
      <p className="mb-4">Total Produk: {products.length}</p>

      {/* 🚨 Tabel Produk (Gunakan map untuk menampilkan data) */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th>Nama Produk</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product: any) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>Rp{product.price.toLocaleString('id-ID')}</td>
              <td>{product.stock} pcs</td>
              <td><button>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellerDashboard;