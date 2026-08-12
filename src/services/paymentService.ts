import apiClient from '@/lib/axios';
import { ApiResponse, Payment, PaymentMethod } from '@/types/api';

export interface CreatePaymentParams {
  appointmentId: number;
  paymentMethod: PaymentMethod;
}

export const paymentService = {
  async createPayment(params: CreatePaymentParams): Promise<Payment> {
    const res = await apiClient.post<ApiResponse<Payment>>('/payments/create', params);
    return res.data.data;
  },
};
