import apiClient, { getResponseData } from '@/lib/axios';
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
    return getResponseData<User[]>(res);
  },

  async createUser(data: UserCreateParams): Promise<string> {
    const res = await apiClient.post<ApiResponse<string>>('/users', data);
    return getResponseData<string>(res);
  },

  async updateUser(id: string, data: UserCreateParams): Promise<string> {
    const res = await apiClient.put<ApiResponse<string>>(`/users/${id}`, data);
    return getResponseData<string>(res);
  },

  async deleteUser(id: string): Promise<string> {
    const res = await apiClient.delete<ApiResponse<string>>(`/users/${id}`);
    return getResponseData<string>(res);
  },
};
