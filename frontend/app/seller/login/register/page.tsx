// frontend/app/seller/register/page.tsx
import AuthForm from '../../../components/AuthForm';

const SellerRegisterPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AuthForm type="register" role="seller" />
    </div>
  );
};

export default SellerRegisterPage;