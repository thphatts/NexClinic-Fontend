import apiClient from '@/lib/axios';
import { ApiResponse, PagedResponse, Patient } from '@/types/api';

export interface PatientQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  search?: string;
}

export interface PatientCreateParams {
  fullName: string;
  citizenId: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
  userId?: string;
}

export const patientService = {
  async getAllPatients(params?: PatientQueryParams): Promise<PagedResponse<Patient>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<Patient>>>('/patients', {
      params: {
        page_no: params?.page || 1,
        page_size: params?.size || 10,
        sort_by: params?.sortBy || 'id',
        sort_dir: params?.sortDir || 'asc',
        search: params?.search || undefined,
      },
    });
    return (res.data.result ?? res.data.data)!;
  },

  async getPatientById(id: number): Promise<Patient> {
    const res = await apiClient.get<ApiResponse<Patient>>(`/patients/${id}`);
    return (res.data.result ?? res.data.data)!;
  },

  async getPatientByCitizenId(citizenId: string): Promise<Patient> {
    const res = await apiClient.get<ApiResponse<Patient>>(`/patients/citizen-id/${citizenId}`);
    return (res.data.result ?? res.data.data)!;
  },

  async getMyPatientProfile(): Promise<Patient> {
    const res = await apiClient.get<ApiResponse<Patient>>('/patients/me');
    return (res.data.result ?? res.data.data)!;
  },

  async createPatient(data: PatientCreateParams): Promise<Patient> {
    const res = await apiClient.post<ApiResponse<Patient>>('/patients', data);
    return (res.data.result ?? res.data.data)!;
  },

  async updatePatient(id: number, data: PatientCreateParams): Promise<Patient> {
    const res = await apiClient.put<ApiResponse<Patient>>(`/patients/${id}`, data);
    return (res.data.result ?? res.data.data)!;
  },

  async deletePatient(id: number): Promise<string> {
    const res = await apiClient.delete<ApiResponse<string>>(`/patients/${id}`);
    return (res.data.result ?? res.data.data ?? res.data.message)!;
  },
};
