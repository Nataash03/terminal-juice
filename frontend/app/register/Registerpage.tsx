// frontend/app/register/page.tsx
// Ini adalah halaman "Juice Up" (Create Account)

import AuthForm from '../components/AuthForm';

export default function RegisterPage() {
  // Catatan: Di halaman login/register, biasanya kita tidak menampilkan Navbar dan Footer.
  // Pastikan RootLayout.tsx sudah diatur untuk bisa menonaktifkan komponen tersebut
  // atau cukup buat layout terpisah di sini.
  
  return (
    // Gunakan AuthForm dengan type 'register'
    <AuthForm type="register" />
  );
}