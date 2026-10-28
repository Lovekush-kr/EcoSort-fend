/**
 * EcoSort AI — Auth Hook
 *
 * Provides authentication state and actions to components.
 * Uses React context to share auth state across the app.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, login as loginService, register as registerService, verifyOtp as verifyOtpService, logout as logoutService, hasToken } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      if (!hasToken()) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();
        if (!cancelled) {
          setUser(data.user || data);
        }
      } catch {
        // Token invalid or expired — clear it
        if (!cancelled) {
          logoutService();
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    checkAuth();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (credentials) => {
    setError(null);
    const data = await loginService(credentials);
    setUser(data.user || data);
    return data;
  }, []);

  const register = useCallback(async (credentials) => {
    setError(null);
    return registerService(credentials);
  }, []);

  const verifyOtp = useCallback(async (credentials) => {
    setError(null);
    return verifyOtpService(credentials);
  }, []);

  const logout = useCallback(() => {
    logoutService();
    setUser(null);
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    verifyOtp,
    logout,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;
