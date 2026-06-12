import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // App load hote hi localStorage se user check karo
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  // ✅ Login Function
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // ✅ Register Function
  const register = async (name, email, password, phone) => {
    try {
      const { data } = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        phone,
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  // ✅ Update Profile Function - Yahi fix hai
  const updateProfile = async (userData) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      if (!userInfo?.token) {
        throw new Error('No token found. Please login again.');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`, // ✅ Token bhej raha hai
        },
      };

      const { data } = await axios.put(
        '/api/auth/profile', // ✅ Sahi URL
        userData,
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data); // Context update
      return data;
    } catch (error) {
      console.log('Update Profile Error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Update failed');
    }
  };

  // ✅ Logout Function
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
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