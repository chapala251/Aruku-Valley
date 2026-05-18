import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRouter from './routes/AppRouter';
import useAuthStore from './store/authStore';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

export default function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#FFFBF4',
            color: '#1C1C1E',
            border: '1px solid #F4E9D8',
            borderRadius: '12px',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '14px',
            fontWeight: 500,
          },
          success: {
            iconTheme: { primary: '#2D6A4F', secondary: 'white' },
          },
        }}
      />
      <AppRouter />
    </BrowserRouter>
  );
}
