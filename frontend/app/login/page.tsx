// frontend/app/login/page.tsx
'use client'; // Pastikan ini ada jika menggunakan React hooks atau event handlers

import AuthForm from '../components/AuthForm';
import { useRouter } from 'next/navigation'; // Import hook router Next.js

const LoginPage = () => {
  const router = useRouter();

  // Handler untuk mengelola hasil login yang berhasil
  const handleLoginSuccess = (userRole: 'buyer' | 'seller', userName: string) => {
    // Di sini seharusnya data user disimpan ke state global (Context/Redux)
    console.log(`User ${userName} successfully logged in as ${userRole}. Redirecting...`);

    // Logika Redirect setelah Login
    if (userRole === 'seller') {
        router.push('/seller/dashboard'); // Seller langsung ke dashboard
    } else {
        router.push('/'); // User biasa kembali ke halaman utama
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AuthForm 
        type="login" 
        onAuthSuccess={handleLoginSuccess} 
      />
    </div>
  );
};

export default LoginPage;