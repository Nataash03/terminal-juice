// frontend/app/components/AuthForm.tsx

'use client';

import React, { useState } from 'react';
import styles from './AuthForm.module.css';

// --- DAFTAR WHITELIST NAMA SELLER (SIMULASI FRONTEND) ---
const TEAM_SELLERS_NAMES = [
  "Natasya Agustine",
  "Patricia Natania",
  "Jessica Winola",
  "Lyvia Reva Ruganda",
  "Admin 1"
];
// --------------------------------------------------------

interface AuthFormProps {
  type: 'login' | 'register';
  // HAPUS: role: 'buyer' | 'seller'; -> Kita akan tentukan role di dalam handleSubmit
  
  // TAMBAH: Callback function untuk mengirim hasil auth (termasuk role) ke Parent Component
  onAuthSuccess: (userRole: 'buyer' | 'seller', userName: string) => void; 
}

// Hapus 'role' dari props
const AuthForm: React.FC<AuthFormProps> = ({ type, onAuthSuccess }) => {
  // State untuk data form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Digunakan untuk penentu role (simulasi)
  const [username, setUsername] = useState('');
  
  // State untuk error validasi
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    fullName: '',
    username: '',
    general: '',
  });

  // State untuk loading
  const [isLoading, setIsLoading] = useState(false);

  // Validasi Form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', fullName: '', username: '', general: '' };

    // Validasi Full Name (Wajib diisi untuk menentukan role/registrasi)
    if (fullName.trim().length < 3) {
      newErrors.fullName = 'Nama harus diisi minimal 3 karakter.';
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

    setErrors(newErrors);
    return isValid;
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: '', password: '', fullName: '', username: '', general: '' });
    
    // Kita pastikan fullName diisi, karena menjadi kunci simulasi role
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 1. SIMULASI API CALL
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 2. LOGIKA PENENTUAN ROLE BERDASARKAN NAMA LENGKAP
      const cleanInputName = fullName.trim().toLowerCase();
      const isSeller = TEAM_SELLERS_NAMES
                         .map(name => name.toLowerCase())
                         .includes(cleanInputName);
      
      const determinedRole: 'buyer' | 'seller' = isSeller ? 'seller' : 'buyer';
      
      console.log(`[AUTH SUCCESS] Type: ${type}, Determined Role: ${determinedRole}, Name: ${fullName}, Email: ${email}`);
      
      // 3. KIRIM DATA AUTH BERHASIL KE PARENT (TERMASUK ROLE)
      onAuthSuccess(determinedRole, fullName);

      alert(`${type === 'login' ? 'Login' : 'Registrasi'} Berhasil! Anda adalah ${determinedRole.toUpperCase()}.`);
      // Parent component akan menangani redirect

    } catch (error: any) {
      setErrors(prev => ({ 
        ...prev, 
        general: error.message || 'Terjadi kesalahan saat memproses.' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // --- Konten Dinamis Berdasarkan TIPE (Login atau Register) ---
  const isLogin = type === 'login';
  
  // 1. Judul Utama (NETRAL, tidak perlu sebut Seller/Buyer)
  const title = isLogin ? 'Sign In to Your Account' : 'Create New Account'; 

  // 2. Tautan Pengalih
  const subtitleLink = isLogin ? 'Daftar Sekarang' : 'Sign In';
  
  // 3. Tujuan Tautan Pengalih (netral)
  const subtitleHref = isLogin ? '/register' : '/login';

  return (
    <div className={styles.container}>
      {/* Illustration */}
      <div className={styles.illustration}>
        <img 
        // Menggunakan path relatif dari folder public/
          src="/images/login-signin.png" 
          alt="Juice Shop Illustration" 
          className={styles.illustrationImage}
        />
      </div>
      {/* ... (Illustration & Form Card Div tetap sama) ... */}
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>
            {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '} 
            <a href={subtitleHref} className={styles.switchLink}>{subtitleLink}</a>
          </p>
        </div>

        {errors.general && (
          <div className={styles.errorGeneral}>{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Full Name */}
          <div className={styles.inputGroup}>
            <label htmlFor="fullName" className={styles.label}>
              Full Name 
            </label>
            <input
              type="text"
              id="fullName"
              className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masukkan nama lengkap"
            />
            {errors.fullName && (
              <p className={styles.errorMessage}>{errors.fullName}</p>
            )}
          </div>
          
          {/* Email Address */}
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address 
            </label>
            <input
              type="email"
              id="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className={styles.errorMessage}>{errors.email}</p>
            )}
          </div>

          {/* Username */}
          {type === 'register' && (
            <div className={styles.inputGroup}>
              <label htmlFor="username" className={styles.label}>
                Username
              </label>
              <input
                type="text"
                id="username"
                className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Must be Unique"
              />
              {errors.username && (
                <p className={styles.errorMessage}>{errors.username}</p>
              )}
            </div>
          )}

          {/* Password */}
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
            />
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;