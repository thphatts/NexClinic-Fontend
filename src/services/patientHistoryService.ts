import apiClient, { getResponseData } from '@/lib/axios';
import { ApiResponse, ObservationTrend, VisitHistory } from '@/types/api';

export const patientHistoryService = {
  async getVisits(patientId: number): Promise<VisitHistory[]> {
    const response = await apiClient.get<ApiResponse<VisitHistory[]>>(`/patients/${patientId}/visits`);
    return getResponseData<VisitHistory[]>(response);
  },
  async getObservationTrend(patientId: number, conceptId: number): Promise<ObservationTrend[]> {
    const response = await apiClient.get<ApiResponse<ObservationTrend[]>>(`/patients/${patientId}/observations`, { params: { conceptId } });
    return getResponseData<ObservationTrend[]>(response);
  },
};
