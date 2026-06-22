import { api } from './client';

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  color: string;
  lesson_count: number;
  completed?: number;
}

export interface Module {
  id: number;
  course_id: number;
  title: string;
  duration: string;
  sort_order: number;
}

export interface Quiz {
  id: number;
  course_id: number;
  title: string;
  questions: { id: number; question_text: string; options: string[]; correct_index: number }[];
}

export const courseApi = {
  getAll: (category?: string) =>
    api.get<Course[]>('/courses', category ? { category } : undefined),
  getById: (id: number) => api.get<Course & { modules: Module[] }>(`/courses/${id}`),
  create: (data: Partial<Course>) => api.post<Course>('/courses', data),
  update: (id: number, data: Partial<Course>) => api.put<Course>(`/courses/${id}`, data),
  delete: (id: number) => api.delete(`/courses/${id}`),
  getModules: (courseId: number) => api.get<Module[]>(`/courses/${courseId}/modules`),
  getModule: (courseId: number, moduleId: number) =>
    api.get<Module>(`/courses/${courseId}/modules/${moduleId}`),
  createModule: (courseId: number, data: Partial<Module>) =>
    api.post<Module>(`/courses/${courseId}/modules`, data),
  updateModule: (courseId: number, moduleId: number, data: Partial<Module>) =>
    api.put<Module>(`/courses/${courseId}/modules/${moduleId}`, data),
  deleteModule: (courseId: number, moduleId: number) =>
    api.delete(`/courses/${courseId}/modules/${moduleId}`),
  enroll: (courseId: number) => api.post(`/courses/${courseId}/enroll`),
  unenroll: (courseId: number) => api.delete(`/courses/${courseId}/enroll`),
  updateProgress: (moduleId: number) => api.post('/courses/progress', { module_id: moduleId }),
  getQuiz: (courseId: number) => api.get<Quiz>(`/courses/quiz/${courseId}`),
  submitQuiz: (courseId: number, answers: number[]) =>
    api.post<{ score: number; total: number }>(`/courses/quiz/${courseId}/submit`, { answers }),
  createQuiz: (data: any) => api.post('/courses/quiz', data),
  updateQuiz: (id: number, data: any) => api.put(`/courses/quiz/${id}`, data),
  deleteQuiz: (id: number) => api.delete(`/courses/quiz/${id}`),
};
