import apiClient, { getResponseData } from '@/lib/axios';
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
    const authData = getResponseData<AuthResponse>(res);
    if (!authData || !authData.token) {
      throw new Error(res.data?.message || 'Lỗi xác thực dữ liệu từ máy chủ');
    }
    return authData;
  },

  async register(data: RegisterParams): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    const authData = getResponseData<AuthResponse>(res);
    if (!authData) {
      throw new Error(res.data?.message || 'Lỗi đăng ký tài khoản');
    }
    return authData;
  },

  async refresh(): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh');
    const authData = getResponseData<AuthResponse>(res);
    if (!authData) {
      throw new Error(res.data?.message || 'Lỗi làm mới phiên làm việc');
    }
    return authData;
  },

  async logout(): Promise<void> {
    await apiClient.post<ApiResponse<void>>('/auth/logout');
  },
};
