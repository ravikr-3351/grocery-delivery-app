/**
 * App.js - Main application with routing
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RiderDashboard from './pages/RiderDashboard';
import SellerLoginPage from './pages/SellerLoginPage';
import SellerRegisterPage from './pages/SellerRegisterPage';
import SellerDashboard from './pages/SellerDashboard';

// Protected route wrapper
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const roleHome = {
    admin: '/admin',
    rider: '/rider',
    user: '/dashboard',
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={roleHome[user.role] || '/'} replace />;
  }
  return children;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <main className="main-content">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<ProtectedRoute roles={['user']}><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute roles={['user']}><CheckoutPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute roles={['user']}><UserDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/rider" element={<ProtectedRoute roles={['rider']}><RiderDashboard /></ProtectedRoute>} />
        
        {/* Seller Routes */}
        <Route path="/seller/login" element={<SellerLoginPage />} />
        <Route path="/seller/register" element={<SellerRegisterPage />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
      </Routes>
    </main>
  </>
);

const getBasename = () => {
  const publicUrl = process.env.PUBLIC_URL || '';
  if (!publicUrl) return '';
  const rawBase = publicUrl.startsWith('http')
    ? new URL(publicUrl).pathname
    : publicUrl;
  if (!rawBase || rawBase === '/') return '';
  return rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;
};

const App = () => (
  <BrowserRouter basename={getBasename()}>
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
