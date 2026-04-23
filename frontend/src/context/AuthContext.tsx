'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserResponse, LoginForm, UserCreate } from '@/types/auth';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  login: (data: LoginForm) => Promise<void>;
  register: (data: UserCreate) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    if (authService.isAuthenticated()) {
      try {
        const userData = await authService.getMe();
        setUser(userData);
        return userData;
      } catch (error) {
        authService.logout();
        setUser(null);
      }
    }
    return null;
  };

  useEffect(() => {
    fetchUser().finally(() => setLoading(false));
  }, []);

  const login = async (data: LoginForm) => {
    await authService.login(data);
    const userData = await fetchUser();
    if (userData) {
      router.replace('/dashboard');
    }
  };

  const register = async (data: UserCreate) => {
    await authService.register(data);
    // After registration, automatically log them in
    await login({ email: data.email, password: data.password });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
