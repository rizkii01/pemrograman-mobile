import { supabase } from '../lib/supabase';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const localhost = debuggerHost.split(':')[0];
    return `http://${localhost}:5000/api`;
  }
  if (Platform.OS === 'android') return 'http://10.0.2.2:5000/api';
  return 'http://localhost:5000/api';
};

const BASE_URL = getBaseUrl();

let token: string | null = null;

export const setToken = (t: string | null) => {
  token = t;
};

export const getToken = () => token;

export const refreshTokenFromSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    token = session.access_token;
  }
  return token;
};

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;
  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const search = new URLSearchParams(params).toString();
    url += `?${search}`;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...fetchOptions, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data as T;
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    request<T>(endpoint, { method: 'GET', params }),
  post: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};
