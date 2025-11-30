import axios from 'axios';
import type { Message } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const getMessages = async (limit = 50, before?: number) => {
  const response = await api.get<{
    messages: Message[];
    total: number;
    hasMore: boolean;
  }>('/messages', {
    params: { limit, before },
  });
  return response.data;
};

export const uploadFile = async (file: File, onProgress?: (progress: number) => void) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<{
    success: boolean;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });

  return response.data;
};
