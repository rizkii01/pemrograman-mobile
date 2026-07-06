import { supabase } from '../lib/supabase';
import { api, setToken } from './client';

export interface User {
  id: number;
  name: string;
  email: string;
  bio: string;
  level: string;
  xp: number;
  streak: number;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  register: async (name: string, email: string, password: string) => {
    // 1. Backend mendaftarkan ke Supabase Auth & insert ke public.users
    const res = await api.post<AuthResponse>('/auth/register', { name, email, password });
    
    // 2. Client frontend juga harus login agar state Supabase lokal tersinkronisasi
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.warn('Frontend local login failed:', error.message);
    } else if (data.session?.access_token) {
      setToken(data.session.access_token);
    } else {
      setToken(res.token); // Fallback ke token dari backend
    }
    
    return res;
  },

  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    if (data.session?.access_token) {
      setToken(data.session.access_token);
    }
    const user = await api.get<User>('/auth/me');
    return { token: data.session!.access_token, user };
  },

  getMe: () => api.get<User>('/auth/me'),
};
