import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { TOKEN_KEY } from '../api/client';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    async function initializeAuth() {
      const token = localStorage.getItem(TOKEN_KEY);
      
      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const response = await authService.getCurrentUser();
        if (response && response.success && response.data) {
          setUser(response.data);
        } else {
          // If response not successful, clear token
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
        }
      } catch (error) {
        console.error('Session restoration failed:', error);
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    }

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      
      if (result && result.success && result.data) {
        const { token, user: loggedUser } = result.data;
        localStorage.setItem(TOKEN_KEY, token);
        setUser(loggedUser);
        return loggedUser;
      } else {
        throw new Error(result?.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isInitializing,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
