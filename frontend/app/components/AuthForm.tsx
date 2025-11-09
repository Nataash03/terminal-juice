// frontend/app/components/AuthForm.tsx

'use client';

import React, { useState } from 'react';
import styles from './AuthForm.module.css';

interface AuthFormProps {
  type: 'login' | 'register';
  role?: 'buyer' | 'seller';
}

const AuthForm: React.FC<AuthFormProps> = ({ type, role }) => {
  // State untuk data form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
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

    // Validasi Full Name (Register only)
    if (type === 'register' && fullName.trim().length < 3) {
      newErrors.fullName = 'Nama harus diisi minimal 3 karakter.';
      isValid = false;
    }

    // Validasi Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Format email tidak valid.';
      isValid = false;
    }

    // Validasi Username
    if (username.trim().length < 3) {
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
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log(`[AUTH SUCCESS] Type: ${type}, Email: ${email}, Username: ${username}`);
      
      alert(`${type === 'login' ? 'Login' : 'Registrasi'} Berhasil! Redirecting...`);
      // window.location.href = '/dashboard';

    } catch (error: any) {
      setErrors(prev => ({ 
        ...prev, 
        general: error.message || 'Terjadi kesalahan saat memproses.' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic content based on type
  const title = type === 'login' ? 'Sign in' : 'Create Account';
  const subtitle = type === 'login' 
    ? 'Belum punya akun?' 
    : 'Sudah punya akun?';
  const subtitleLink = type === 'login' 
    ? 'Juice up' 
    : 'Sign in';
  const subtitleHref = type === 'login' 
    ? '/register' 
    : '/login';

  return (
    <div className={styles.container}>
      {/* Illustration */}
      <div className={styles.illustration}>
        <img 
          src="/images/login-signin.png" 
          alt="Juice Shop" 
          className={styles.illustrationImage}
        />
      </div>

      {/* Form Card */}
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>
            {subtitle} <a href={subtitleHref} className={styles.switchLink}>{subtitleLink}</a>
          </p>
        </div>

        {errors.general && (
          <div className={styles.errorGeneral}>{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Full Name (Register only) */}
          {type === 'register' && (
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
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className={styles.errorMessage}>{errors.fullName}</p>
              )}
            </div>
          )}

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
            {isLoading ? 'Processing...' : 'Juice Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;