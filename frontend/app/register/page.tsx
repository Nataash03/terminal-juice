// frontend/app/register/page.tsx
import AuthForm from '../components/AuthForm';

const RegisterPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AuthForm type="register" role="buyer" />
    </div>
  );
};

export default RegisterPage;