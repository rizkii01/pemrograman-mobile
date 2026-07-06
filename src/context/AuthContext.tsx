import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { authApi, User } from '../api/auth.api';
import { setToken, refreshTokenFromSession } from '../api/client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await refreshTokenFromSession();
      if (token) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
        } catch {
          setToken(null);
        }
      }
      setIsLoading(false);
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setToken(null);
        setUser(null);
      } else if (session?.access_token) {
        setToken(session.access_token);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await authApi.register(name, email, password);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const token = await refreshTokenFromSession();
    if (token) {
      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch {}
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isLoggedIn: !!user, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
