export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface PagedResponse<T> {
  items: T[];
  content?: T[]; // alias for compatibility
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export type Role = 'ROLE_ADMIN' | 'ROLE_DOCTOR' | 'ROLE_STAFF' | 'ROLE_PATIENT';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'VNPAY' | 'BANK_TRANSFER';

export interface User {
  id: string;
  name?: string;
  username: string;
  email: string;
  phoneNumber?: string;
  phone?: string;
  address?: string;
  citizenId?: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: string;
  username: string;
  email: string;
  role: Role;
  expiresInMs: number;
}

export interface Patient {
  id: number;
  fullName: string;
  citizenId: string;
  phone: string;
  email: string;
  dob: string;
  gender: Gender;
  address: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Doctor {
  id: number;
  fullName: string;
  specialization: string;
  degree: string;
  phone: string;
  email: string;
  experienceYears: number;
  consultationFee: number;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DoctorSchedule {
  id: number;
  doctorId: number;
  dayOfWeek: number; // 1 = Monday, 7 = Sunday
  startTime: string; // e.g. "08:00:00"
  endTime: string;   // e.g. "17:00:00"
  slotDurationMinutes: number; // e.g. 30
  active: boolean;
}

export interface AvailableSlot {
  date: string;
  startTime: string;
  endTime: string;
  timeSlotLabel: string;
}

export interface DoctorReview {
  id: number;
  doctorId: number;
  patientId: number;
  patientName: string;
  doctorName?: string;
  verified: boolean;
  appointmentId: number;
  rating: number;
  comment: string;
  visitCountSnapshot?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  appointmentDate: string;
  timeSlot: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicalRecord {
  id: number;
  appointmentId: number;
  patientId: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  diagnosis: string;
  symptoms: string;
  notes?: string;
  reexaminationDate?: string;
  prescriptionId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PrescriptionItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  dosage: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Prescription {
  id: number;
  medicalRecordId: number;
  patientName?: string;
  doctorName?: string;
  notes?: string;
  totalAmount: number;
  items: PrescriptionItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  status: string;
  categoryId?: number;
  categoryName?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Payment {
  paymentId?: string;
  id?: string;
  appointmentId: number;
  patientName?: string;
  amount: number;
  status?: PaymentStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: string;
  orderRef?: string;
  paymentUrl?: string;
  createdAt?: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface AiSymptomAnalysisResult {
  triageLevel: string;
  possibleConditions: { name: string; probability: number }[];
  recommendations: string[];
  warningSigns: string[];
  suggestedAction: string;
}

export interface AiAgentActionResult {
  actionName: string;
  status: string;
  resultMessage: string;
  payloadData?: Record<string, unknown>;
}

