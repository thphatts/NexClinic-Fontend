import apiClient from '@/lib/axios';
import { ApiResponse, AuthResponse } from '@/types/api';

export interface LoginParams {
  username?: string;
  email?: string;
  password?: string;
}

export interface RegisterParams {
  name: string;
  username: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  citizenId?: string;
  role?: string;
}

export const authService = {
  async login(credentials: LoginParams): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return res.data.data;
  },

  async register(data: RegisterParams): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data.data;
  },

  async refresh(): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh');
    return res.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post<ApiResponse<void>>('/auth/logout');
  },
};
