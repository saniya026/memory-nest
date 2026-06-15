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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIX 1: try-catch add kiya JSON parse ke liye
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const parsedUser = JSON.parse(userInfo);
        // FIX 2: token check karo, agar hai tabhi set karo
        if (parsedUser?.token) {
          setUser(parsedUser);
          console.log('User loaded from localStorage:', parsedUser.email);
        } else {
          localStorage.removeItem('userInfo');
        }
      }
    } catch (error) {
      console.log('Error parsing userInfo:', error);
      localStorage.removeItem('userInfo');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, { 
        email, 
        password 
      });
      
      const userData = {
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        token: data.token
      };
      
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setUser(userData);
      console.log('Login success, user set:', userData.email);
      return userData;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
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
        token: data.token
      };
      
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const updateProfile = async (userData) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      if (!userInfo?.token) {
        throw new Error('No token found. Please login again.');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/api/auth/profile`,
        userData,
        config
      );

      const updatedUserData = {
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        token: data.token || userInfo.token
      };

      localStorage.setItem('userInfo', JSON.stringify(updatedUserData));
      setUser(updatedUserData);
      return updatedUserData;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Update failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    // FIX 3: logout ke baad bhi reload karo
    window.location.href = '/login';
  };

  const value = {
    user,
    isAuthenticated: !!user?.token,
    loading,
    login,
    register,
    updateProfile,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};