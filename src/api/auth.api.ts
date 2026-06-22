import { api } from './client';

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
  register: (name: string, email: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { name, email, password }),
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
  getMe: () => api.get<User>('/auth/me'),
};
