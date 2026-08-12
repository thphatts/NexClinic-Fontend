import apiClient from '@/lib/axios';
import { ApiResponse, User } from '@/types/api';

export interface UserCreateParams {
  name: string;
  username: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  citizenId?: string;
  role?: string;
}

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const res = await apiClient.get<ApiResponse<User[]>>('/users');
    return res.data.data;
  },

  async createUser(data: UserCreateParams): Promise<string> {
    const res = await apiClient.post<ApiResponse<string>>('/users', data);
    return res.data.data;
  },

  async updateUser(id: string, data: UserCreateParams): Promise<string> {
    const res = await apiClient.put<string>(`/users/${id}`, data);
    return res.data;
  },

  async deleteUser(id: string): Promise<string> {
    const res = await apiClient.delete<string>(`/users/${id}`);
    return res.data;
  },
};
