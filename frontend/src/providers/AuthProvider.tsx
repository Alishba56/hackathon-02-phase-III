'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import { apiClient } from '@/lib/api';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in on initial load
    const initializeAuth = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth-token');
        if (token) {
          try {
            // Validate the token with the backend
            const response = await apiClient.request('/api/auth/me', {
              method: 'GET',
            });

            // Token is valid, set user
            setUser(response);
          } catch (error) {
            // If token is invalid, remove it
            localStorage.removeItem('auth-token');
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const response = await apiClient.login(email, password);

      if (response.access_token) {
        localStorage.setItem('auth-token', response.access_token);
        setUser(response.user);
      }

      setLoading(false);
    } catch (err) {
      setError((err as Error).message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const response = await apiClient.register(name, email, password);

      if (response.access_token) {
        localStorage.setItem('auth-token', response.access_token);
        setUser(response.user);
      }

      setLoading(false);
    } catch (err) {
      setError((err as Error).message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    setUser(null);
    // Notify backend about logout if needed
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};