import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import AdminHome from './pages/admin/AdminHome';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPricing from './pages/admin/AdminPricing';
import AdminServices from './pages/admin/AdminServices';
import AdminUsers from './pages/admin/AdminUsers';
import ForgotPassword from './pages/auth/ForgotPassword';
import Login from './pages/auth/Login';
import ResetPassword from './pages/auth/ResetPassword';
import Signup from './pages/auth/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
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

export default function App() {
  return (
    <Routes>
      {/* Public — browse & auth */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
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
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
