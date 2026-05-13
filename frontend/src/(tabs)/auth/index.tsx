import React from 'react';
import { useSignUp } from './useSignUp';
import SignUpPresenter from './SignUpPresenter';

export default function SignUpScreen() {
  const { 
    name, setName, 
    phone, setPhone, 
    loading, handleSignUp, goBack 
  } = useSignUp();

  return (
    <SignUpPresenter
      name={name}
      setName={setName}
      phone={phone}
      setPhone={setPhone}
      loading={loading}
      onSignUp={handleSignUp}
      onBack={goBack}
    />
  );
}