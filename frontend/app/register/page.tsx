// frontend/app/register/page.tsx
'use client'; // Pastikan ini ada jika menggunakan React hooks atau event handlers

import AuthForm from '../components/AuthForm';
import { useRouter } from 'next/navigation'; // Import hook router Next.js

const RegisterPage = () => {
  const router = useRouter();
  
  // Handler untuk mengelola hasil registrasi yang berhasil
  const handleRegisterSuccess = (userRole: 'buyer' | 'seller', userName: string) => {
    // Di sini seharusnya data user disimpan ke state global (Context/Redux)
    console.log(`User ${userName} successfully registered as ${userRole}. Redirecting...`);
    
    // Logika Redirect setelah Registrasi
    if (userRole === 'seller') {
        router.push('/seller/dashboard'); // Seller langsung ke dashboard
    } else {
        router.push('/profile'); // Buyer/User biasa ke halaman profile
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AuthForm 
        type="register" 
        onAuthSuccess={handleRegisterSuccess} 
      />
    </div>
  );
};

export default RegisterPage;