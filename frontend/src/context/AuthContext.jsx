import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem('mn_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch {
      localStorage.removeItem('mn_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('mn_token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone });
    localStorage.setItem('mn_token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('mn_token');
    setUser(null);
  };

  const updateProfile = async (profile) => {
    const { data } = await api.put('/auth/profile', profile);
    setUser(data.user);
    return data;
  };

  const setSession = (token, userData) => {
    localStorage.setItem('mn_token', token);
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        setSession,
        isAdmin: user?.role === 'admin',
        isCustomer: user?.role === 'user',
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
