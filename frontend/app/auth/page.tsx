import AuthForm from './AuthForm';

export default function AuthPage() {
  return (
    <div 
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        // Background Hijau Muda Cerah (Sesuai Screenshot 2)
        backgroundColor: '#F7FDE6' 
      }}
    >
      <AuthForm />
    </div>
  );
}