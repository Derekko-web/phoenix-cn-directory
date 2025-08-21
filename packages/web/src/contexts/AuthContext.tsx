'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, User, LoginRequest, RegisterRequest } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  loginWithGoogle: () => void;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authApi.getCurrentUser();
        const token = authApi.getToken();

        if (storedUser && token) {
          setUser(storedUser);
        }
      } catch (error) {
        // Auth initialization error - token cleared
        authApi.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    authApi.loginWithGoogle();
  };

  const register = async (userData: RegisterRequest) => {
    setLoading(true);
    try {
      const response = await authApi.register(userData);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    loginWithGoogle,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}