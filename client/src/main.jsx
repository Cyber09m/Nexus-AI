import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import App from './App.jsx';
import SetupNotice from './components/SetupNotice.jsx';
import './styles.css';

const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
  key ? (
    <ClerkProvider
      publishableKey={key}
      afterSignOutUrl="/"
      signInFallbackRedirectUrl="/app"
      signUpFallbackRedirectUrl="/app"
      appearance={{ baseTheme: dark, variables: { colorPrimary: '#7c5cff', colorBackground: '#0e0c1f', fontFamily: 'Figtree, sans-serif', borderRadius: '0.75rem' } }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  ) : (
    <SetupNotice />
  ),
);
