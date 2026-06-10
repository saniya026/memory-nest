import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import AdminHome from './pages/admin/AdminHome';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPricing from './pages/admin/AdminPricing';
import AdminServices from './pages/admin/AdminServices';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReviews from './pages/admin/AdminReviews';
import ForgotPassword from './pages/auth/ForgotPassword';
import Login from './pages/auth/Login';
import ResetPassword from './pages/auth/ResetPassword';
import Signup from './pages/auth/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import MyMemories from './pages/dashboard/MyMemories';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Orders from './pages/dashboard/Orders';
import UserDashboard from './pages/dashboard/UserDashboard';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import Return from './pages/Return';
import Shipping from './pages/Shipping';
import { useState, useEffect } from 'react';

// ✅ Services + DesignGallery
import Services from './pages/Services';
import DesignGallery from './pages/DesignGallery';
import Reviews from './pages/Reviews'; // ✅ Ye add kar

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      if (location.pathname === '/') {
        navigate('/');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, location.pathname]);

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
          onEnded={() => setShowSplash(false)}
        >
          <source src="/logo-splash.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public — browse & auth */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        
        <Route path="services" element={<Services />} />
        <Route path="gallery" element={<DesignGallery />} />
        <Route path="reviews" element={<Reviews />} /> {/* ✅ Ye add kiya */}
        
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="refund" element={<Refund />} />
        <Route path="return" element={<Return />} />
        <Route path="shipping" element={<Shipping />} />
      </Route>

      {/* Customer — cart & checkout */}
      <Route
        element={
          <ProtectedRoute role="any">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Customer — dashboard & order history */}
      <Route
        element={
          <ProtectedRoute role="any">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="dashboard/orders" element={<Orders />} />
        <Route path="dashboard/memories" element={<MyMemories />} />
      </Route>

      {/* Admin — management only */}
      <Route
        path="admin"
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
        <Route path="reviews" element={<AdminReviews />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}