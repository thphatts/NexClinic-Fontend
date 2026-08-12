import apiClient from '@/lib/axios';
import {
  AiSymptomAnalysisResult,
  AiAgentActionResult,
} from '@/types/api';

export interface AiChatResponse {
  sessionId: string;
  response: string;
}

export interface SymptomAnalysisParams {
  patientAge?: number;
  gender?: string;
  symptoms: string[];
  durationDays?: number;
  severityScale?: number;
  medicalHistory?: string;
}

export interface MedicalRecordSummaryResponse {
  summary: string;
  keyDiagnoses: string[];
  suggestedFollowUpDate?: string;
  riskAssessment: string;
}

export const aiService = {
  async chat(message: string, sessionId?: string, context?: string): Promise<AiChatResponse> {
    const res = await apiClient.post<AiChatResponse>('/ai/chat', { message, sessionId, context });
    return res.data;
  },

  async analyzeSymptoms(request: SymptomAnalysisParams): Promise<AiSymptomAnalysisResult> {
    const res = await apiClient.post<AiSymptomAnalysisResult>('/ai/analyze-symptoms', request);
    return res.data;
  },

  async summarizeMedicalRecord(recordId: number): Promise<MedicalRecordSummaryResponse> {
    const res = await apiClient.post<MedicalRecordSummaryResponse>(`/ai/summarize-medical-record/${recordId}`);
    return res.data;
  },

  async processAgentAction(command: string): Promise<AiAgentActionResult> {
    const res = await apiClient.post<AiAgentActionResult>('/ai/agent/action', null, {
      params: { command },
    });
    return res.data;
  },
};
