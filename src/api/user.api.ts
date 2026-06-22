import { api } from './client';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  bio: string;
  level: string;
  xp: number;
  streak: number;
  created_at: string;
}

export interface UserStats {
  courses: number;
  projects: number;
  certificates: number;
  xp: number;
  streak: number;
  achievements: number;
}

export interface DashboardData {
  user: { name: string; xp: number; streak: number };
  stats: UserStats;
  courses: any[];
  activities: any[];
}

export interface Achievement {
  achievement_key: string;
  earned_at: string;
}

export const userApi = {
  getProfile: () => api.get<UserProfile>('/users/profile'),
  updateProfile: (data: { name?: string; email?: string; bio?: string }) =>
    api.put<UserProfile>('/users/profile', data),
  deleteProfile: () => api.delete('/users/profile'),
  getStats: () => api.get<UserStats>('/users/stats'),
  getDashboard: () => api.get<DashboardData>('/users/dashboard'),
  getEnrollments: () => api.get<any[]>('/users/enrollments'),
  getAchievements: () => api.get<Achievement[]>('/users/achievements'),
};
