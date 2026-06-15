import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios'; // ← axios hata ke ye import kar
import toast from 'react-hot-toast';

// const API_URL = 'https://memory-nest-backend.onrender.com'; ← Ye line delete kar de

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        if (parsedUser?.token) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('userInfo');
        }
      } catch (error) {
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password }); // ← /api hata diya
      const userData = {
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        isAdmin: data.user.isAdmin,
        token: data.token
      };
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setUser(userData);
      toast.success('Login successful!');
      return userData;
    } catch (error) {
      const message = error.response?.data?.msg || 'Login failed';
      toast.error(message);
      throw new Error(message);
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const { data } = await api.post('/auth/register', { // ← /api hata diya
        name, email, password, phone,
      });
      const userData = {
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        isAdmin: data.user.isAdmin,
        token: data.token
      };
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setUser(userData);
      toast.success('Account created!');
      return userData;
    } catch (error) {
      const message = error.response?.data?.msg || 'Signup failed';
      toast.error(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    window.location.replace('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user?.token,
    isAdmin: user?.isAdmin || false,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};