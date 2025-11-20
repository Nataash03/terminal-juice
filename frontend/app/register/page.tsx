'use client';

import React from 'react';
import AuthForm from './../components/AuthForm';

const REGISTER_URL = 'http://localhost:5001/api/users/register';

const RegisterPage = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#f9f9f9' 
    }}>
      <AuthForm type="register" />
    </div>
  );
};

export default RegisterPage;