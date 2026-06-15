import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, role = 'any' }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: 'Please log in to continue', from: location.pathname }}
      />
    );
  }

  if (role === 'admin' &&!isAdmin) {
    return (
      <Navigate
        to="/"
        replace
        state={{ message: 'Unauthorized Access — admin only' }}
      />
    );
  }

  return children;
}