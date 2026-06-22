import { api } from './client';

export interface Resource {
  id: number;
  title: string;
  type: string;
  author: string;
  description: string;
  content: string;
  downloads: number;
  category_id: number;
  category_name?: string;
  color: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  resource_count: number;
}

export interface Bookmark {
  id: number;
  title: string;
  type: string;
  color: string;
  saved_at: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
}

export const libraryApi = {
  getResources: (categoryId?: number) =>
    api.get<Resource[]>('/resources', categoryId ? { category_id: String(categoryId) } : undefined),
  getResourceById: (id: number) => api.get<Resource>(`/resources/${id}`),
  createResource: (data: Partial<Resource>) => api.post<Resource>('/resources', data),
  updateResource: (id: number, data: Partial<Resource>) => api.put<Resource>(`/resources/${id}`, data),
  deleteResource: (id: number) => api.delete(`/resources/${id}`),
  search: (q: string) => api.get<Resource[]>('/resources/search', { q }),
  getCategories: () => api.get<Category[]>('/categories'),
  createCategory: (data: Partial<Category>) => api.post<Category>('/categories', data),
  updateCategory: (id: number, data: Partial<Category>) => api.put<Category>(`/categories/${id}`, data),
  deleteCategory: (id: number) => api.delete(`/categories/${id}`),
  getBookmarks: () => api.get<Bookmark[]>('/bookmarks'),
  addBookmark: (resourceId: number) => api.post('/bookmarks', { resource_id: resourceId }),
  removeBookmark: (resourceId: number) => api.delete(`/bookmarks/${resourceId}`),
  getFaqs: () => api.get<Faq[]>('/faqs'),
  createFaq: (data: Partial<Faq>) => api.post<Faq>('/faqs', data),
  updateFaq: (id: number, data: Partial<Faq>) => api.put<Faq>(`/faqs/${id}`, data),
  deleteFaq: (id: number) => api.delete(`/faqs/${id}`),
};
