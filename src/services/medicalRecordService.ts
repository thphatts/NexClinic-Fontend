import apiClient, { getResponseData } from '@/lib/axios';
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
    return getResponseData<PagedResponse<MedicalRecord>>(res);
  },

  async getMedicalRecordById(id: number): Promise<MedicalRecord> {
    const res = await apiClient.get<ApiResponse<MedicalRecord>>(`/medical-records/${id}`);
    return getResponseData<MedicalRecord>(res);
  },

  async getMedicalRecordByAppointmentId(appointmentId: number): Promise<MedicalRecord> {
    const res = await apiClient.get<ApiResponse<MedicalRecord>>(`/medical-records/appointment/${appointmentId}`);
    return getResponseData<MedicalRecord>(res);
  },

  async getMedicalRecordsByPatientId(patientId: number): Promise<MedicalRecord[]> {
    const res = await apiClient.get<ApiResponse<MedicalRecord[]>>(`/medical-records/patient/${patientId}`);
    return getResponseData<MedicalRecord[]>(res);
  },

  async getMedicalRecordsByDoctorId(doctorId: number): Promise<MedicalRecord[]> {
    const res = await apiClient.get<ApiResponse<MedicalRecord[]>>(`/medical-records/doctor/${doctorId}`);
    return getResponseData<MedicalRecord[]>(res);
  },

  async createMedicalRecord(data: MedicalRecordCreateParams): Promise<MedicalRecord> {
    const res = await apiClient.post<ApiResponse<MedicalRecord>>('/medical-records', data);
    return getResponseData<MedicalRecord>(res);
  },
};
