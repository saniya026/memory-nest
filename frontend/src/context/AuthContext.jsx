import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'https://memory-nest-backend.onrender.com';
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
      const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const userData = {
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        isAdmin: data.user.isAdmin || false,
        token: data.token
      };
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setUser(userData);
      toast.success('Login successful!');
      return userData;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw new Error(message);
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register`, {
        name, email, password, phone,
      });
      const userData = {
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        isAdmin: data.user.isAdmin || false,
        token: data.token
      };
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setUser(userData);
      toast.success('Account created!');
      return userData;
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
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
    isAuthenticated:!!user?.token,
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