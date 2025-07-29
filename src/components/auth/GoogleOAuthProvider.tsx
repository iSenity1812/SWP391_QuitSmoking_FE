import React from 'react';
import { GoogleOAuthProvider as GoogleProvider } from '@react-oauth/google';

interface GoogleOAuthProviderProps {
  children: React.ReactNode;
}

const GoogleOAuthProvider: React.FC<GoogleOAuthProviderProps> = ({ children }) => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '464304967792-2sdljl8j6migpfkje1pqcg84euiclrfl.apps.googleusercontent.com';

  return (
    <GoogleProvider clientId={googleClientId}>
      {children}
    </GoogleProvider>
  );
};

export default GoogleOAuthProvider; 