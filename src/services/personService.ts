import apiClient, { getResponseData } from '@/lib/axios';
import { ApiResponse, Patient, PersonLookup } from '@/types/api';

export const personService = {
  async search(keyword: string): Promise<PersonLookup> {
    const res = await apiClient.get<ApiResponse<PersonLookup>>('/persons/search', { params: { keyword } });
    return getResponseData<PersonLookup>(res);
  },

  async addPatientProfile(personId: number, data: { bloodType?: string; medicalHistorySummary?: string }): Promise<Patient> {
    const res = await apiClient.post<ApiResponse<Patient>>(`/persons/${personId}/patient-profile`, data);
    return getResponseData<Patient>(res);
  },
};
