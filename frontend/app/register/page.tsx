// File: app/register/page.tsx

'use client';

import React, { useState } from 'react';
import AuthForm from '../components/AuthForm'; // Asumsi path komponen AuthForm
import { useRouter } from 'next/navigation';

// URL API Backend kamu
const REGISTER_URL = 'http://localhost:5001/api/users/register';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handler yang akan dipanggil dari AuthForm
  const handleRegister = async (fullName: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sign Up Sukses
        
        // 1. Simpan Token dan Role
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userRole', data.role); // 🚨 Simpan Role untuk otorisasi
        
        console.log(`Pendaftaran Sukses! Role: ${data.role}`);
        
        // 2. Arahkan pengguna berdasarkan role (opsional, tapi disarankan)
        if (data.role === 'seller') {
            router.push('/dashboard'); // Arahkan seller ke Dashboard
        } else {
            router.push('/shop'); // Arahkan buyer ke halaman utama/toko
        }

      } else {
        // Gagal Sign Up (misal: Email sudah terdaftar)
        setError(data.message || 'Pendaftaran Gagal. Cek data input.');
      }

    } catch (err) {
      setError('Terjadi error koneksi ke server.');
      console.error('Connection Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      type="register" // Tentukan tipe form
      onSubmit={handleRegister}
      isLoading={loading}
      error={error}
    />
  );
};

export default RegisterPage;