import apiClient, { getResponseData } from '@/lib/axios';
import { ApiResponse, ConceptDictionaryItem } from '@/types/api';

export const conceptService = {
  async getDictionary(conceptClass?: string): Promise<ConceptDictionaryItem[]> {
    const res = await apiClient.get<ApiResponse<ConceptDictionaryItem[]>>('/concepts/dictionary', {
      params: { conceptClass },
    });
    return getResponseData<ConceptDictionaryItem[]>(res);
  },
};
