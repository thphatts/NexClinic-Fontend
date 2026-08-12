import apiClient from '@/lib/axios';
import { ApiResponse, PagedResponse, MedicalRecord } from '@/types/api';

export interface MedicalRecordQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface MedicalRecordCreateParams {
  appointmentId: number;
  patientId: number;
  doctorId: number;
  diagnosis: string;
  symptoms: string;
  notes?: string;
  reexaminationDate?: string;
}

export const medicalRecordService = {
  async getAllMedicalRecords(params?: MedicalRecordQueryParams): Promise<PagedResponse<MedicalRecord>> {
    const res = await apiClient.get<ApiResponse<PagedResponse<MedicalRecord>>>('/medical-records', {
      params: {
        page_no: params?.page || 1,
        page_size: params?.size || 10,
        sort_by: params?.sortBy || 'id',
        sort_dir: params?.sortDir || 'desc',
      },
    });
    return res.data.data;
  },

  async getMedicalRecordById(id: number): Promise<MedicalRecord> {
    const res = await apiClient.get<ApiResponse<MedicalRecord>>(`/medical-records/${id}`);
    return res.data.data;
  },

  async getMedicalRecordByAppointmentId(appointmentId: number): Promise<MedicalRecord> {
    const res = await apiClient.get<ApiResponse<MedicalRecord>>(`/medical-records/appointment/${appointmentId}`);
    return res.data.data;
  },

  async getMedicalRecordsByPatientId(patientId: number): Promise<MedicalRecord[]> {
    const res = await apiClient.get<ApiResponse<MedicalRecord[]>>(`/medical-records/patient/${patientId}`);
    return res.data.data;
  },

  async getMedicalRecordsByDoctorId(doctorId: number): Promise<MedicalRecord[]> {
    const res = await apiClient.get<ApiResponse<MedicalRecord[]>>(`/medical-records/doctor/${doctorId}`);
    return res.data.data;
  },

  async createMedicalRecord(data: MedicalRecordCreateParams): Promise<MedicalRecord> {
    const res = await apiClient.post<ApiResponse<MedicalRecord>>('/medical-records', data);
    return res.data.data;
  },
};
