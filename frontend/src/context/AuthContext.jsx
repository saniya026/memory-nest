import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://memory-nest-backend.onrender.com';
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Wapas true kar

  useEffect(() => {
    // Page load pe localStorage se user uthao
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
    setLoading(false); // Sab check ke baad false kar
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    
    const userData = {
      _id: data.user._id,
      name: data.user.name,
      email: data.user.email,
      token: data.token
    };
    
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await axios.post(`${API_URL}/api/auth/register`, {
      name, email, password, phone,
    });
    
    const userData = {
      _id: data.user._id,
      name: data.user.name,
      email: data.user.email,
      token: data.token
    };
    
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const updateProfile = async (userData) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo?.token) throw new Error('No token found. Please login again.');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`${API_URL}/api/auth/profile`, userData, config);

    const updatedUserData = {
      _id: data.user._id,
      name: data.user.name,
      email: data.user.email,
      token: data.token || userInfo.token
    };

    localStorage.setItem('userInfo', JSON.stringify(updatedUserData));
    setUser(updatedUserData);
    return updatedUserData;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    isAuthenticated: !!user?.token,
    isAdmin: user?.isAdmin || false, // Ye add kar de
    loading, // Asli loading state bhej
    login,
    register,
    updateProfile,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};