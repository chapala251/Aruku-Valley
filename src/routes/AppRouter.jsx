import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from '../components/layout/Navbar';
import MobileTabBar from '../components/layout/MobileTabBar';
import Footer from '../components/layout/Footer';
import WhatsAppButton from '../components/shared/WhatsAppButton';
import PageTabBar from '../components/layout/PageTabBar';

import Home from '../pages/Home';
import Packages from '../pages/Packages';
import PackageDetail from '../pages/PackageDetail';
import Resorts from '../pages/Resorts';
import ResortDetail from '../pages/ResortDetail';
import Travels from '../pages/Travels';
import Vanjangi from '../pages/Vanjangi';
import Lambasingi from '../pages/Lambasingi';
import Blog from '../pages/Blog';
import BlogPost from '../pages/BlogPost';
import Contact from '../pages/Contact';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import Dashboard from '../pages/Dashboard';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAuthenticated = user && user.isLoggedIn;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}

// Pages that should not show Footer (auth pages)
const noFooterRoutes = ['/auth/login', '/auth/signup'];

export default function AppRouter() {
  const location = useLocation();
  const showFooter = !noFooterRoutes.includes(location.pathname);
  const showPageTabBar = !noFooterRoutes.includes(location.pathname);

  return (
    <>
      <Navbar />
      <main className="page-content" style={{ paddingTop: showPageTabBar ? '0px' : '64px', paddingBottom: '80px' }}>
        {showPageTabBar && <PageTabBar />}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:slug" element={<PackageDetail />} />
            <Route path="/resorts" element={<Resorts />} />
            <Route path="/resorts/:slug" element={<ResortDetail />} />
            <Route path="/travels" element={<Travels />} />
            <Route path="/vanjangi" element={<Vanjangi />} />
            <Route path="/lambasingi" element={<Lambasingi />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      {showFooter && <Footer />}
      <MobileTabBar />
      <WhatsAppButton />
    </>
  );
}
