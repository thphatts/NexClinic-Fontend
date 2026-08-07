export type Role = 'ROLE_ADMIN' | 'ROLE_DOCTOR' | 'ROLE_RECEPTIONIST' | 'ROLE_PATIENT';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  role: Role;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PagedResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface Patient {
  id: number;
  fullName: string;
  citizenId: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
}

export interface Doctor {
  id: number;
  fullName: string;
  specialization: string;
  degree?: string;
  phone: string;
  email: string;
  experienceYears: number;
  consultationFee: number;
}

export interface MedicalRecord {
  id: number;
  appointmentId: number;
  patientId: number;
  doctorId: number;
  patientName: string;
  doctorName: string;
  diagnosis: string;
  symptoms?: string;
  notes?: string;
  reexaminationDate?: string;
  createdAt: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  timeSlot: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  reason?: string;
  notes?: string;
  amount?: number;
}
