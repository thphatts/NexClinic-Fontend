import apiClient from '@/lib/axios';
import {
  AiChatResponse,
  AiSymptomAnalysisResult,
  AiAgentActionResult,
} from '@/types/api';

export interface SymptomAnalysisParams {
  patientAge?: number;
  gender?: string;
  symptoms: string | string[];
  durationDays?: number;
  severityScale?: number;
  medicalHistory?: string;
}

export interface MedicalRecordSummaryResponse {
  summary: string;
  keyDiagnoses?: string[];
  suggestedFollowUpDate?: string;
  riskAssessment?: string;
}

export const aiService = {
  async chat(message: string, sessionId?: string, context?: string): Promise<AiChatResponse> {
    const res = await apiClient.post<AiChatResponse>('/ai/chat', { message, sessionId, context });
    const data = res.data;
    const textReply = data.reply || data.response || 'Tôi đã xử lý yêu cầu của bạn.';
    return {
      ...data,
      reply: textReply,
      response: textReply,
    };
  },

  async analyzeSymptoms(request: SymptomAnalysisParams): Promise<AiSymptomAnalysisResult> {
    const formattedSymptoms = Array.isArray(request.symptoms)
      ? request.symptoms.join(', ')
      : request.symptoms;

    const payload = {
      symptoms: formattedSymptoms,
      durationDays: request.durationDays ?? 1,
      patientAge: request.patientAge,
      medicalHistory: request.medicalHistory,
    };

    const res = await apiClient.post<AiSymptomAnalysisResult>('/ai/analyze-symptoms', payload);
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
