export interface ApiResponse<T> {
  code?: number;
  status?: number;
  message: string;
  result?: T;
  data?: T;
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

export type Role = 'ROLE_ADMIN' | 'ROLE_DOCTOR' | 'ROLE_STAFF' | 'ROLE_RECEPTIONIST' | 'ROLE_NURSE' | 'ROLE_PATIENT';
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

export interface PersonLookup {
  personId: number;
  fullName: string;
  dob?: string;
  gender?: string;
  phoneNumber?: string;
  citizenId?: string;
  address?: string;
  profiles: {
    patientId: number | null;
    patientCode: string | null;
    doctorId: number | null;
    hasUserAccount: boolean;
  };
}

export type VisitStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type EncounterType = 'VITALS' | 'CONSULTATION' | 'LAB_RESULT' | 'DISCHARGE';

export interface ActiveVisit {
  visitId: number;
  patientId: number;
  patientName: string;
  appointmentId: number | null;
  visitType: string;
  startTime: string;
  encounters: EncounterType[];
}

export interface VisitHistory {
  visitId: number;
  appointmentId: number | null;
  visitType: string;
  status: VisitStatus;
  startTime: string;
  endTime?: string;
  encounters: {
    encounterId: number;
    encounterType: EncounterType;
    encounterDatetime: string;
    doctorName?: string;
    observations: {
      obsId: number;
      conceptId: number;
      conceptName: string;
      unit?: string;
      dataType: ConceptDataType;
      valueNumeric?: number;
      valueText?: string;
      valueCodedId?: number;
      valueCodedName?: string;
      valueDatetime?: string;
      valueBoolean?: boolean;
      observedAt: string;
    }[];
  }[];
}

export interface ObservationTrend {
  conceptId: number;
  conceptName: string;
  unit?: string;
  value: number;
  observedAt: string;
}

export type ConceptDataType = 'NUMERIC' | 'TEXT' | 'CODED' | 'BOOLEAN' | 'DATETIME';
export interface ConceptDictionaryItem {
  conceptId: number;
  name: string;
  dataType: ConceptDataType;
  conceptClass: string;
  unit?: string | null;
  minValue?: number | null;
  maxValue?: number | null;
  required: boolean;
  answers: { answerConceptId: number; name: string }[];
}
export interface ObsRequest {
  conceptId: number;
  valueNumeric: number | null;
  valueText: string | null;
  valueCodedId: number | null;
  valueDatetime: string | null;
  valueBoolean: boolean | null;
}

export interface Visit {
  id: number;
  patient: Patient;
  appointmentId: number | null;
  visitType: string;
  status: VisitStatus;
  startTime: string;
  endTime?: string;
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
  consultationFee: number;
  amount?: number;
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

export interface AiChatResponse {
  reply: string;
  sessionId: string;
  suggestedActions?: string[];
  disclaimer?: string;
  timestamp?: string;
  response?: string; // alias
}

export interface SymptomAnalysisResponse {
  primaryDiagnosis: string;
  differentialDiagnoses: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY' | string;
  recommendedSpecialization: string;
  urgentWarnings: string[];
  advice: string;
  disclaimer: string;
}

export type AiSymptomAnalysisResult = SymptomAnalysisResponse;

export interface AiAgentActionResult {
  success: boolean;
  actionType: string;
  message: string;
  resultData?: Record<string, unknown> | unknown;
  executedAt?: string;
  // legacy aliases
  actionName?: string;
  status?: string;
  resultMessage?: string;
}

// ── Chat Types ──────────────────────────────────────────────────────────────

export type ChatRoomStatus = 'ACTIVE' | 'CLOSED';

export interface ChatRoom {
  id: number;
  appointmentId?: number;
  doctorId: number;
  doctorName: string;
  patientId: number;
  patientName: string;
  status: ChatRoomStatus;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: number;
  roomId: number;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface CreateChatRoomRequest {
  doctorId: number;
  patientId: number;
  appointmentId?: number;
}

export interface SendMessageRequest {
  roomId: number;
  content: string;
}
