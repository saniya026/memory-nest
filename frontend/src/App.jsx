import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { WishlistProvider } from './context/WishlistContext';
import MainLayout from './components/layout/MainLayout';

// Admin pages
import AdminHome from './pages/admin/AdminHome';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPricing from './pages/admin/AdminPricing';
import AdminServices from './pages/admin/AdminServices';
import AdminUsers from './pages/admin/AdminUsers';
import ReviewsAdmin from './pages/admin/ReviewsAdmin';

// Auth pages
import ForgotPassword from './pages/auth/ForgotPassword';
import Login from './pages/auth/Login';
import ResetPassword from './pages/auth/ResetPassword';
import Signup from './pages/auth/Signup';
import VerifyOTP from './pages/auth/VerifyOTP';

// Public pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import MyMemories from './pages/dashboard/MyMemories';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Orders from './pages/dashboard/Orders';
import UserDashboard from './pages/dashboard/UserDashboard';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import Return from './pages/Return';
import Shipping from './pages/Shipping';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import DesignGallery from './pages/DesignGallery';
import Reviews from './pages/Reviews';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      setShowSplash(false);
      if (location.pathname === '/') {
        navigate(isAuthenticated ? '/home' : '/login', { replace: true });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, location.pathname, isAuthenticated, loading]);

  const handleVideoEnd = () => {
    setShowSplash(false);
    if (location.pathname === '/') {
      navigate(isAuthenticated ? '/home' : '/login', { replace: true });
    }
  };

  if (showSplash) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <video
          autoPlay
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onEnded={handleVideoEnd}
        >
          <source src="/logo-splash.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/return" element={<Return />} />
        <Route path="/shipping" element={<Shipping />} />
      </Route>

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute role="any">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/gallery" element={<DesignGallery />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        
        {/* ✅ WishlistProvider sirf yahan */}
        <Route path="/wishlist" element={
          <WishlistProvider>
            <Wishlist />
          </WishlistProvider>
        } />
        
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Customer Dashboard */}
      <Route
        element={
          <ProtectedRoute role="any">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/dashboard/orders" element={<Orders />} />
        <Route path="/dashboard/memories" element={<MyMemories />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout admin />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="pricing" element={<AdminPricing />} />
        <Route path="reviews" element={<ReviewsAdmin />} />
      </Route>

      {/* Redirect old /products to /services */}
      <Route path="/products" element={<Navigate to="/services" replace />} />
      <Route path="/products/:id" element={<Navigate to="/services" replace />} />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}