// File: frontend/app/components/AuthForm.tsx

'use client';

import React, { useState } from 'react';
import styles from './AuthForm.module.css';

// 🚨 PERUBAHAN TIPE PROPS KRITIS
interface AuthFormProps {
  type: 'login' | 'register';
  isLoading: boolean;
  error: string | null;
  // Callback: Mengirim SEMUA data input ke Parent Component untuk proses API
  // Note: Hanya fullName, email, password yang wajib. username opsional.
  onSubmit: (fullName: string, email: string, password: string, username?: string) => void; 
}

const AuthForm: React.FC<AuthFormProps> = ({ type, isLoading, error, onSubmit }) => {
  // State untuk data form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); 
  const [username, setUsername] = useState('');
  
  // State untuk error validasi internal
  const [internalErrors, setInternalErrors] = useState({
    email: '',
    password: '',
    fullName: '',
    username: '',
  });

  // Validasi Form Internal (Hanya cek format/minimal panjang, bukan cek ke database)
  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', fullName: '', username: '' };

    // Validasi Full Name (Wajib saat Register)
    if (type === 'register' && fullName.trim().length < 3) {
      newErrors.fullName = 'Nama lengkap minimal 3 karakter.';
      isValid = false;
    } else if (type === 'login' && fullName.trim().length > 0) {
        // Biarkan kosong saat login, kecuali jika pengguna mengisinya tanpa sengaja
        newErrors.fullName = 'Tidak perlu mengisi nama saat Sign In.';
        isValid = false;
    }

    // Validasi Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Format email tidak valid.';
      isValid = false;
    }

    // Validasi Username (Register only)
    if (type === 'register' && username.trim().length < 3) {
      newErrors.username = 'Username minimal 3 karakter.';
      isValid = false;
    }

    // Validasi Password
    if (password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter.';
      isValid = false;
    }

    setInternalErrors(newErrors);
    return isValid;
  };

  // Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hapus error umum dari parent saat submit baru
    // Kita tidak bisa reset error state parent dari sini, jadi fokus pada internal errors.

    if (!validateForm()) {
      return;
    }
    
    // 🚨 KIRIM DATA KE PARENT
    // Parent akan menangani API call, loading, dan error database
    onSubmit(fullName, email, password, username);
  };

  // --- Konten Dinamis Berdasarkan TIPE (Login atau Register) ---
  const isLogin = type === 'login';
  const title = isLogin ? 'Sign In to Your Account' : 'Create New Account'; 
  const subtitleLink = isLogin ? 'Daftar Sekarang' : 'Sign In';
  const subtitleHref = isLogin ? '/register' : '/login';

  return (
    <div className={styles.container}>
      {/* Illustration */}
      <div className={styles.illustration}>
        <img 
          src="/images/login-signin.png" 
          alt="Juice Shop Illustration" 
          className={styles.illustrationImage}
        />
      </div>
      
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>
            {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '} 
            <a href={subtitleHref} className={styles.switchLink}>{subtitleLink}</a>
          </p>
        </div>

        {/* 🚨 TAMPILKAN ERROR DARI API (PARENT) */}
        {error && (
          <div className={styles.errorGeneral}>{error}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          
          {/* Full Name (Hanya Wajib di Register) */}
          <div className={styles.inputGroup} style={{ display: isLogin ? 'none' : 'block' }}>
            <label htmlFor="fullName" className={styles.label}>Full Name</label>
            <input
              type="text"
              id="fullName"
              className={`${styles.input} ${internalErrors.fullName ? styles.inputError : ''}`}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              required={!isLogin}
            />
            {internalErrors.fullName && (
              <p className={styles.errorMessage}>{internalErrors.fullName}</p>
            )}
          </div>
          
          {/* Email Address */}
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              className={`${styles.input} ${internalErrors.email ? styles.inputError : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
            {internalErrors.email && (
              <p className={styles.errorMessage}>{internalErrors.email}</p>
            )}
          </div>

          {/* Username (Hanya di Register) */}
          {type === 'register' && (
            <div className={styles.inputGroup}>
              <label htmlFor="username" className={styles.label}>Username</label>
              <input
                type="text"
                id="username"
                className={`${styles.input} ${internalErrors.username ? styles.inputError : ''}`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Must be Unique"
                required
              />
              {internalErrors.username && (
                <p className={styles.errorMessage}>{internalErrors.username}</p>
              )}
            </div>
          )}

          {/* Password */}
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              className={`${styles.input} ${internalErrors.password ? styles.inputError : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
            />
            {internalErrors.password && (
              <p className={styles.errorMessage}>{internalErrors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading} // 🚨 GUNAKAN PROPS isLoading
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;