import { api } from './client';

export interface Post {
  id: number;
  user_id: number;
  author: string;
  role: string;
  category: string;
  title: string;
  body: string;
  replies_count: number;
  likes_count: number;
  created_at: string;
}

export interface Comment {
  id: number;
  discussion_id: number;
  user_id: number;
  author: string;
  role: string;
  body: string;
  created_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  level: string;
  badge: string;
}

export interface Mentor {
  id: number;
  name: string;
  role: string;
  expertise: string[];
  students: number;
  rating: number;
  available: boolean;
}

export const communityApi = {
  getPosts: () => api.get<Post[]>('/community/posts'),
  getPostById: (id: number) => api.get<Post & { comments: Comment[] }>(`/community/posts/${id}`),
  createPost: (data: { category?: string; title: string; body: string }) =>
    api.post<Post>('/community/posts', data),
  updatePost: (id: number, data: { title?: string; body?: string; category?: string }) =>
    api.put<Post>(`/community/posts/${id}`, data),
  deletePost: (id: number) => api.delete(`/community/posts/${id}`),
  toggleLike: (id: number) => api.post<{ liked: boolean }>(`/community/posts/${id}/like`),
  addComment: (postId: number, body: string) =>
    api.post<Comment>(`/community/posts/${postId}/comments`, { body }),
  updateComment: (id: number, body: string) =>
    api.put<Comment>(`/community/comments/${id}`, { body }),
  deleteComment: (id: number) => api.delete(`/community/comments/${id}`),
  getLeaderboard: () => api.get<LeaderboardEntry[]>('/community/leaderboard'),
  getMentors: () => api.get<Mentor[]>('/community/mentors'),
  getMentorById: (id: number) => api.get<Mentor>(`/community/mentors/${id}`),
  createMentor: (data: Partial<Mentor>) => api.post<Mentor>('/community/mentors', data),
  updateMentor: (id: number, data: Partial<Mentor>) => api.put<Mentor>(`/community/mentors/${id}`, data),
  deleteMentor: (id: number) => api.delete(`/community/mentors/${id}`),
};
