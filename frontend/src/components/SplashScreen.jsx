import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        navigate(isAuthenticated? '/' : '/login');
      }, 2000); // 2 sec splash
    }
  }, [loading, isAuthenticated, navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-rose to-lavender">
      <h1 className="animate-pulse text-5xl font-bold text-white">MemoryNest</h1>
    </div>
  );
}