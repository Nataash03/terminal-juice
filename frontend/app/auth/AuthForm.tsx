'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; 
import styles from './AuthForm.module.css';

const illustrationSrc = '/images/login-signin.png'; 

// Ambil URL dari env
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const AuthForm = () => {
  const router = useRouter();
  
  const [isLogin, setIsLogin] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
  });

  // Handle Perubahan Input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = isLogin 
        ? { email: formData.email, password: formData.password } 
        : formData; 

    const endpoint = isLogin 
      ? `${baseUrl}/api/users/login`
      : `${baseUrl}/api/users/register`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) 
      });

      const data = await res.json();

      if (data.success) {
        Cookies.set('token', data.token, { expires: 30 }); 
        Cookies.set('user_role', data.user.role, { expires: 30 }); 

        localStorage.setItem('user', JSON.stringify(data.user));

        window.dispatchEvent(new Event('storage'));

        if (data.user.role === 'seller') {
            router.push('/dashboard/seller/se'); 
        } else {
            router.push('/dashboard'); 
        }
        
        router.refresh(); 
      } else {
        setError(data.message || 'Terjadi kesalahan.');
      }
    } catch (err) {
      console.error(err);
      setError('Gagal terhubung ke server. Cek koneksi backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      
      {/* KIRI: Ilustrasi */}
      <div className={styles.illustrationSide}>
        <img 
          src={illustrationSrc} 
          alt="Juice Shop Illustration" 
          className={styles.illustrationImage} 
        />
      </div>

      {/* KANAN: Form */}
      <div className={styles.formSide}>
        <h1 className={styles.title}>
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h1>
        <p className={styles.subtitle}>
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
          <span 
            className={styles.toggleLink} 
            onClick={() => {
              setIsLogin(!isLogin);
              setError(''); 
            }}
          >
            {isLogin ? ' Sign up' : ' Sign in'}
          </span>
        </p>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          
          {!isLogin && (
            <>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  className={styles.input}
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Username</label>
                <input 
                  type="text" 
                  name="username" 
                  className={styles.input}
                  placeholder="Must be unique"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {/* Email */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address</label>
            <input 
              type="email" 
              name="email" 
              className={styles.input}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input 
              type="password" 
              name="password" 
              className={styles.input}
              placeholder="Min 8 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Juice Up')}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AuthForm;