import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import Navbar from '../components/layout/Navbar';
import MobileTabBar from '../components/layout/MobileTabBar';
import Footer from '../components/layout/Footer';
import TermsConditionsModal from '../components/shared/TermsConditionsModal';
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
import About from '../pages/About';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import Dashboard from '../pages/Dashboard';
import BlogEditor from '../pages/admin/BlogEditor';
import PackageEditor from '../pages/admin/PackageEditor';
import ResortEditor from '../pages/admin/ResortEditor';

import AdminDashboard from '../pages/admin/AdminDashboard';

function ProtectedRoute({ children }) {
  const stored = localStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;
  if (!user) return <Navigate to="/auth/login" replace />;
  // If admin tries to access user dashboard, redirect to admin dashboard
  if (user.email === 'arakuecostays@gmail.com') return <Navigate to="/admin/dashboard" replace />;
  return children;
}

function AdminRoute({ children }) {
  const stored = localStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;
  if (!user) return <Navigate to="/auth/login" replace />;
  if (user.email !== 'arakuecostays@gmail.com') return <Navigate to="/dashboard" replace />;
  return children;
}

// Pages that should not show Footer (auth pages)
const noFooterRoutes = ['/auth/login', '/auth/signup'];

export default function AppRouter() {
  const location = useLocation();
  const [termsOpen, setTermsOpen] = useState(false);
  
  // Expose to window for nested components to access
  window.setTermsOpen = setTermsOpen;
  
  const isAdminRoute = location.pathname.startsWith('/admin');
  const showFooter = !noFooterRoutes.includes(location.pathname) && !isAdminRoute;
  const showPageTabBar = !noFooterRoutes.includes(location.pathname) && !isAdminRoute;
  const showMobileTabBar = !isAdminRoute;

  return (
    <>
      <Navbar />
      <main className="page-content" style={{ paddingTop: '0', paddingBottom: '80px' }}>
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
            <Route path="/about" element={<About />} />
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

            {/* Admin routes — check admin inside guard */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/blog/new" element={<AdminRoute><BlogEditor /></AdminRoute>} />
            <Route path="/admin/blog/edit/:id" element={<AdminRoute><BlogEditor /></AdminRoute>} />
            <Route path="/admin/package/new" element={<AdminRoute><PackageEditor /></AdminRoute>} />
            <Route path="/admin/package/edit/:id" element={<AdminRoute><PackageEditor /></AdminRoute>} />
            <Route path="/admin/resort/new" element={<AdminRoute><ResortEditor /></AdminRoute>} />
            <Route path="/admin/resort/edit/:id" element={<AdminRoute><ResortEditor /></AdminRoute>} />


            <Route path="/:slug" element={<BlogPost />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      {showFooter && <Footer setTermsOpen={setTermsOpen} />}
      {showMobileTabBar && <MobileTabBar />}
      <WhatsAppButton />
      <TermsConditionsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  );
}
