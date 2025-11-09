// frontend/app/login/page.tsx
// Ini adalah halaman "Juice In (buyer)"

import AuthForm from '../components/AuthForm';

export default function LoginPage() {
  return (
    // Gunakan AuthForm dengan type 'login' dan role 'buyer'
    <AuthForm type="login" role="buyer" />
  );
}