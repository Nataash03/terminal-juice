// frontend/app/seller/login/page.tsx
import AuthForm from '../../components/AuthForm';

const SellerLoginPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AuthForm type="login" role="seller" />
    </div>
  );
};

export default SellerLoginPage;