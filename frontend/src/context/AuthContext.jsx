import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

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
      const { data } = await api.post('/auth/login', { email, password });
      const userData = {
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        isAdmin: data.user.isAdmin,
        phone: data.user.phone,      // ← add kar
        avatar: data.user.avatar,    // ← add kar
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
      const { data } = await api.post('/auth/register', {
        name, email, password, phone,
      });
      const userData = {
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        isAdmin: data.user.isAdmin,
        phone: data.user.phone,      // ← add kar
        avatar: data.user.avatar,    // ← add kar
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

  // ✅ Ye function add kar - Profile update ke liye
  const updateProfile = async (formData) => {
    try {
      const { data } = await api.put('/user/profile', {
        name: formData.name,
        phone: formData.phone,
        avatar: formData.avatar
      });

      if (data.success) {
        const updatedUser = {
          ...user, // purana token, isAdmin rakh
          name: data.user.name,
          phone: data.user.phone,
          avatar: data.user.avatar
        };
        
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        setUser(updatedUser); // ← Context update hoga, UI refresh
        return updatedUser;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
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
    updateProfile, // ← ye add kiya
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};