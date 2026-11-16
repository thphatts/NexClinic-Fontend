import apiClient, { getResponseData } from '@/lib/axios';
import { ActiveVisit, ApiResponse, EncounterType, ObsRequest } from '@/types/api';

export const visitService = {
  async getActiveVisits(): Promise<ActiveVisit[]> {
    const res = await apiClient.get<ApiResponse<ActiveVisit[]>>('/visits/active');
    return getResponseData<ActiveVisit[]>(res);
  },
  async checkIn(patientId: number, appointmentId: number): Promise<ActiveVisit> {
    const res = await apiClient.post<ApiResponse<ActiveVisit>>('/visits', {
      patientId,
      appointmentId,
      visitType: 'OUTPATIENT',
    });
    return getResponseData<ActiveVisit>(res);
  },
  async createEncounter(visitId: number, encounterType: EncounterType, observations: ObsRequest[]) {
    const res = await apiClient.post<ApiResponse<{ encounterId: number }>>(`/visits/${visitId}/encounters`, {
      encounterType, observations,
    });
    return getResponseData<{ encounterId: number }>(res);
  },
  async closeVisit(visitId: number): Promise<void> {
    await apiClient.patch(`/visits/${visitId}/close`);
  },
};
