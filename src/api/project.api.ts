import { api } from './client';

export interface Project {
  id: number;
  title: string;
  description: string;
  xp_reward: number;
  due_days: number;
  requirements: string[];
  tips: string[];
  color: string;
}

export interface Submission {
  id: number;
  user_id: number;
  project_id: number;
  project_title?: string;
  link: string;
  note: string;
  status: string;
  feedback: string;
  submitted_at: string;
  xp_reward?: number;
}

export interface Portfolio {
  id: number;
  title: string;
  description: string;
  xp_reward: number;
  link: string;
  status: string;
  submitted_at: string;
}

export const projectApi = {
  getAll: () => api.get<Project[]>('/projects'),
  getById: (id: number) => api.get<Project>(`/projects/${id}`),
  create: (data: Partial<Project>) => api.post<Project>('/projects', data),
  update: (id: number, data: Partial<Project>) => api.put<Project>(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
  submit: (projectId: number, link: string, note?: string) =>
    api.post<Submission>(`/projects/${projectId}/submit`, { link, note }),
  getSubmissions: () => api.get<Submission[]>('/projects/user/submissions'),
  review: (id: number, status: string, feedback?: string) =>
    api.put(`/projects/submissions/${id}/review`, { status, feedback }),
  getPortfolio: () => api.get<Portfolio[]>('/projects/user/portfolio'),
};
