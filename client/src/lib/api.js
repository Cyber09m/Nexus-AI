import axios from 'axios';
import { useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';

const baseURL = `${(import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')}/api`;

export function useApi() {
  const { getToken } = useAuth();
  return useMemo(() => {
    const instance = axios.create({ baseURL, timeout: 90_000 });
    instance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return instance;
  }, [getToken]);
}

export function errorMessage(e) {
  if (e.response?.data?.message) return e.response.data.message;
  if (e.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  if (!e.response) return `Can't reach the Nexus server at ${baseURL}. Check that it is running and VITE_API_URL is correct.`;
  return e.message || 'Something went wrong.';
}
export const errorCode = (e) => e.response?.data?.code || null;

/** Cloudinary delivery URL that forces a file download. */
export const downloadUrl = (url) => url.replace('/upload/', '/upload/fl_attachment/');
