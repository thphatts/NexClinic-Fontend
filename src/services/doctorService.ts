import apiClient from '@/lib/axios';
import {
  ApiResponse,
  PagedResponse,
  Doctor,
  DoctorSchedule,
  AvailableSlot,
  DoctorReview,
} from '@/types/api';

export interface DoctorQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  search?: string;
}

export interface DoctorCreateParams {
  fullName: string;
  specialization: string;
  degree: string;
  phone: string;
  email: string;
  experienceYears: number;
  consultationFee: number;
  userId?: string;
}

export interface DoctorScheduleCreateParams {
  dayOfWeek: number;
  startTime: string; // "08:00:00"
  endTime: string;   // "17:00:00"
  slotDurationMinutes?: number;
}

export interface DoctorReviewCreateParams {
  doctorId: number;
  appointmentId: number;
  rating: number;
  comment: string;
}

export const doctorService = {
  // Doctors CRUD
  async getAllDoctors(params?: DoctorQueryParams): Promise<PagedResponse<Doctor>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<Doctor>>>('/doctors', {
      params: {
        page_no: params?.page || 1,
        page_size: params?.size || 10,
        sort_by: params?.sortBy || 'id',
        sort_dir: params?.sortDir || 'asc',
        search: params?.search || undefined,
      },
    });
    return res.data.data;
  },

  async getDoctorById(id: number): Promise<Doctor> {
    const res = await apiClient.get<ApiResponse<Doctor>>(`/doctors/${id}`);
    return res.data.data;
  },

  async getDoctorsBySpecialization(specialization: string): Promise<Doctor[]> {
    const res = await apiClient.get<ApiResponse<Doctor[]>>(`/doctors/specialization/${specialization}`);
    return res.data.data;
  },

  async createDoctor(data: DoctorCreateParams): Promise<Doctor> {
    const res = await apiClient.post<ApiResponse<Doctor>>('/doctors', data);
    return res.data.data;
  },

  async updateDoctor(id: number, data: DoctorCreateParams): Promise<Doctor> {
    const res = await apiClient.put<ApiResponse<Doctor>>(`/doctors/${id}`, data);
    return res.data.data;
  },

  async deleteDoctor(id: number): Promise<string> {
    const res = await apiClient.delete<ApiResponse<string>>(`/doctors/${id}`);
    return res.data.data;
  },

  // Schedules & Available Slots
  async getSchedules(doctorId: number): Promise<DoctorSchedule[]> {
    const res = await apiClient.get<ApiResponse<DoctorSchedule[]>>(`/doctors/${doctorId}/schedules`);
    return res.data.data;
  },

  async createSchedule(doctorId: number, data: DoctorScheduleCreateParams): Promise<DoctorSchedule> {
    const res = await apiClient.post<ApiResponse<DoctorSchedule>>(`/doctors/${doctorId}/schedules`, data);
    return res.data.data;
  },

  async deleteSchedule(doctorId: number, scheduleId: number): Promise<string> {
    const res = await apiClient.delete<ApiResponse<string>>(`/doctors/${doctorId}/schedules/${scheduleId}`);
    return res.data.data;
  },

  async getAvailableSlots(doctorId: number, date: string): Promise<AvailableSlot[]> {
    const res = await apiClient.get<ApiResponse<AvailableSlot[]>>(`/doctors/${doctorId}/schedules/available-slots`, {
      params: { date },
    });
    return res.data.data;
  },

  async addLeave(doctorId: number, date: string, reason?: string): Promise<string> {
    const res = await apiClient.post<ApiResponse<string>>(`/doctors/${doctorId}/schedules/leaves`, null, {
      params: { date, reason },
    });
    return res.data.data;
  },

  // Doctor Reviews
  async getDoctorReviews(doctorId: number, page: number = 1, size: number = 10): Promise<PagedResponse<DoctorReview>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<DoctorReview>>>(`/doctor-reviews/doctor/${doctorId}`, {
      params: { page_no: page, page_size: size },
    });
    return res.data.data;
  },

  async createReview(data: DoctorReviewCreateParams): Promise<DoctorReview> {
    const res = await apiClient.post<ApiResponse<DoctorReview>>('/doctor-reviews', data);
    return res.data.data;
  },

  async updateReview(id: number, data: DoctorReviewCreateParams): Promise<DoctorReview> {
    const res = await apiClient.put<ApiResponse<DoctorReview>>(`/doctor-reviews/${id}`, data);
    return res.data.data;
  },

  async deleteReview(id: number): Promise<string> {
    const res = await apiClient.delete<ApiResponse<string>>(`/doctor-reviews/${id}`);
    return res.data.data;
  },
};
