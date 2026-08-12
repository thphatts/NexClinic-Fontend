import apiClient from '@/lib/axios';
import { ApiResponse, PagedResponse, Appointment, AppointmentStatus } from '@/types/api';

export interface AppointmentQueryParams {
  doctorId?: number;
  patientId?: number;
  status?: AppointmentStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface AppointmentCreateParams {
  patientId: number;
  doctorId: number;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // "09:00 - 09:30"
  reason?: string;
  notes?: string;
}

export const appointmentService = {
  async filterAppointments(params?: AppointmentQueryParams): Promise<PagedResponse<Appointment>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<Appointment>>>('/appointments', {
      params: {
        doctor_id: params?.doctorId || undefined,
        patient_id: params?.patientId || undefined,
        status: params?.status || undefined,
        from_date: params?.fromDate || undefined,
        to_date: params?.toDate || undefined,
        page_no: params?.page || 1,
        page_size: params?.size || 10,
        sort_by: params?.sortBy || 'appointmentDate',
        sort_dir: params?.sortDir || 'asc',
      },
    });
    return res.data.data;
  },

  async getAppointmentById(id: number): Promise<Appointment> {
    const res = await apiClient.get<ApiResponse<Appointment>>(`/appointments/${id}`);
    return res.data.data;
  },

  async createAppointment(data: AppointmentCreateParams): Promise<Appointment> {
    const res = await apiClient.post<ApiResponse<Appointment>>('/appointments', data);
    return res.data.data;
  },

  async updateAppointmentStatus(id: number, status: AppointmentStatus, notes?: string): Promise<Appointment> {
    const res = await apiClient.patch<ApiResponse<Appointment>>(`/appointments/${id}/status`, null, {
      params: { status, notes },
    });
    return res.data.data;
  },

  async cancelAppointment(id: number): Promise<string> {
    const res = await apiClient.delete<ApiResponse<string>>(`/appointments/${id}`);
    return res.data.data;
  },
};
