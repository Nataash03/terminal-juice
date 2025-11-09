// frontend/app/login/page.tsx
import AuthForm from '../components/AuthForm';

const LoginPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AuthForm type="login" role="buyer" />
    </div>
  );
};

export default LoginPage;