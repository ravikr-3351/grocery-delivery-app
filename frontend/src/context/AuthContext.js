/**
 * context/AuthContext.js - Authentication state management
 */
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { getStoredUser, setStoredUser, clearStoredUser } from '../utils/authStorage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      setLoading(false);
      return;
    }

    const bootstrapAuth = async () => {
      try {
        if (!stored?.token) {
          clearStoredUser();
          setUser(null);
          return;
        }

        // Sync role/profile from backend so stale storage role cannot bypass UI guards.
        const { data } = await api.get('/auth/me');
        const syncedUser = {
          _id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          role: data.data.role,
          token: stored.token,
        };
        setStoredUser(syncedUser);
        setUser(syncedUser);
      } catch {
        clearStoredUser();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const userData = data.data;
    setStoredUser(userData);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, role = 'user') => {
    const { data } = await api.post('/auth/register', { name, email, password, role });
    const userData = data.data;
    setStoredUser(userData);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    clearStoredUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
