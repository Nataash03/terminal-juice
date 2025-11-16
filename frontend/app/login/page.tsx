// File: app/login/page.tsx

'use client';

import React, { useState } from 'react';
import AuthForm from '../components/AuthForm'; 
import { useRouter } from 'next/navigation';

// URL API Backend kamu
const LOGIN_URL = 'http://localhost:5001/api/users/login';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handler yang akan dipanggil dari AuthForm
  const handleLogin = async (email: string, password: string) => { 
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login Sukses
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userRole', data.role);

        console.log(`Login Sukses! Role: ${data.role}`);
        
        if (data.role === 'seller') {
            router.push('/dashboard');
        } else {
            router.push('/shop');
        }
        
      } else {
        setError(data.message || 'Login Gagal. Cek email dan password.');
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
      type="login"
      onSubmit={handleLogin}
      isLoading={loading}
      error={error}
    />
  );
};

export default LoginPage;