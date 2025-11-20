'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AuthForm.module.css';

// Sesuaikan port backend kamu
const API_BASE_URL = 'http://localhost:5001/api/users'; 

interface AuthFormProps {
  type: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const router = useRouter();
  
  // State Form (Tambah fullName)
  const [fullName, setFullName] = useState(''); 
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = type === 'login' 
      ? `${API_BASE_URL}/login` 
      : `${API_BASE_URL}/register`;

    // Payload disesuaikan (Tambah fullName jika register)
    const payload = type === 'login' 
      ? { email, password }
      : { fullName, username, email, password }; 

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Terjadi kesalahan');
      }

      // Sukses
      localStorage.setItem('user', JSON.stringify(data));
      if (data.token) localStorage.setItem('token', data.token);

      alert(type === 'login' ? 'Login Berhasil!' : 'Registrasi Berhasil!');
      window.location.href = '/'; 

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.illustrationSide}>
        <img 
            src="/images/login-signin.png" 
            alt="Juice Shop" 
            className={styles.illustrationImage} 
        />
      </div>

      <div className={styles.formSide}>
        <h2 className={styles.title}>
            {type === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className={styles.subtitle}>
            {type === 'login' ? 'New here? ' : 'Sudah punya akun? '}
            <a href={type === 'login' ? '/register' : '/login'}>
                {type === 'login' ? 'Create Account' : 'Sign in'}
            </a>
        </p>
        
        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
            
            {/* INPUT FULL NAME */}
            {type === 'register' && (
                <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input
                    className={styles.input}
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                />
                </div>
            )}

            {/* INPUT EMAIL */}
            <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input
                    className={styles.input}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                />
            </div>

            {/* INPUT USERNAME */}
            {type === 'register' && (
                <div className={styles.inputGroup}>
                <label>Username</label>
                <input
                    className={styles.input}
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Must be Unique"
                    required
                />
                </div>
            )}

            {/* INPUT PASSWORD */}
            <div className={styles.inputGroup}>
                <label>Password</label>
                <input
                    className={styles.input}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    required
                />
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Processing...' : (type === 'login' ? 'Login' : 'Juice Up')}
            </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;