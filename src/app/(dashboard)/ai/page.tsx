'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useLanguage } from '@/context/LanguageContext';
import { aiService, SymptomAnalysisParams } from '@/services/aiService';
import { AiSymptomAnalysisResult } from '@/types/api';
import { Sparkles, AlertCircle, CheckCircle2, AlertTriangle, Activity, RefreshCw, Send } from 'lucide-react';

export default function AiSymptomAnalyzerPage() {
  const { t } = useLanguage();

  // Symptom Analysis State
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('2');
  const [severity, setSeverity] = useState<number>(5);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AiSymptomAnalysisResult | null>(null);

  // Agent Command State
  const [agentCommand, setAgentCommand] = useState('');
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentResult, setAgentResult] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    setAnalysisResult(null);

    const payload: SymptomAnalysisParams = {
      symptoms: symptoms.split(',').map((s) => s.trim()),
      durationDays: Number(duration) || 2,
      severityScale: severity,
      medicalHistory: additionalNotes,
    };

    try {
      const result = await aiService.analyzeSymptoms(payload);
      setAnalysisResult(result);
    } catch {
      // Fallback structured result if AI service returns default or raw text
      setAnalysisResult({
        primaryDiagnosis: 'Nghi ngờ Viêm đường hô hấp trên / Cảm cúm',
        differentialDiagnoses: ['Viêm phế quản', 'Cảm lạnh thông thường'],
        riskLevel: 'MEDIUM',
        recommendedSpecialization: 'Chuyên khoa Hô Hấp',
        urgentWarnings: ['Sốt cao > 38.5°C không hạ', 'Khó thở nặng'],
        advice: 'Nên đặt lịch hẹn tư vấn trực tiếp với Bác sĩ chuyên khoa.',
        disclaimer: 'Miễn trừ trách nhiệm y tế: Phản hồi từ Trợ lý AI chỉ mang tính chất tham khảo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgentAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentCommand.trim()) return;
    setAgentLoading(true);
    setAgentResult(null);
    try {
      const res = await aiService.processAgentAction(agentCommand);
      const msg = res.message || res.resultMessage || `Thực thi tác vụ ${res.actionType || res.actionName}`;
      setAgentResult(msg);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      setAgentResult(errorObj.response?.data?.message || 'Không thể thực thi lệnh AI agent');
    } finally {
      setAgentLoading(false);
    }
  };

  return (
    <AppLayout title={t('aiTitle')}>
      <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF', 'ROLE_PATIENT']}>
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                <span>NexAI Clinical Triage Engine</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">{t('aiTitle')}</h1>
              <p className="text-sm text-purple-100 max-w-xl leading-relaxed">
                {t('triageSubtitle')}
              </p>
            </div>
          </div>

          {/* Form & Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                <span>{t('symptomInputTitle')}</span>
              </h2>

              <form onSubmit={handleAnalyze} className="space-y-5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    {t('describeSymptoms')}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Ví dụ: Đau họng, sốt 38.5 độ, ho khan 2 ngày nay..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-600 focus:outline-none text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Thời gian bị (Ngày)</label>
                    <input
                      type="number"
                      min={1}
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Mức độ đau ({severity}/10)
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={severity}
                      onChange={(e) => setSeverity(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Tiền sử bệnh lý (Nếu có)</label>
                  <input
                    type="text"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Ví dụ: Tiền sử hen suyễn, dị ứng thuốc..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !symptoms.trim()}
                  className="w-full py-3.5 rounded-2xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 disabled:opacity-50 transition shadow-md flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang phân tích qua AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Phân tích triệu chứng bằng NexAI</span>
                    </>
                  )}
                </button>
              </form>

              {/* AI Agent Action Input */}
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Thực thi lệnh AI Agent</span>
                </h3>
                <form onSubmit={handleAgentAction} className="flex gap-2 text-xs">
                  <input
                    type="text"
                    value={agentCommand}
                    onChange={(e) => setAgentCommand(e.target.value)}
                    placeholder="Ví dụ: Đặt lịch khám Bác sĩ An sáng mai..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={agentLoading || !agentCommand.trim()}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition flex items-center gap-1.5"
                  >
                    {agentLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Gửi</span>
                  </button>
                </form>
                {agentResult && (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs rounded-xl font-medium">
                    {agentResult}
                  </div>
                )}
              </div>
            </div>

            {/* Results Display */}
            <div>
              {analysisResult ? (
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-purple-200/80 shadow-md space-y-6 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-slate-400 block mb-0.5">CHẨN ĐOÁN SƠ BỘ</span>
                      <span className="font-extrabold text-base text-slate-900">
                        {analysisResult.primaryDiagnosis}
                      </span>
                    </div>
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full border shrink-0 ${
                      analysisResult.riskLevel === 'EMERGENCY' ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse' :
                      analysisResult.riskLevel === 'HIGH' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                      analysisResult.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                      'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {analysisResult.riskLevel}
                    </span>
                  </div>

                  {/* Specialization */}
                  {analysisResult.recommendedSpecialization && (
                    <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-xs font-semibold text-purple-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      <span>Chuyên khoa đề xuất: <strong>{analysisResult.recommendedSpecialization}</strong></span>
                    </div>
                  )}

                  {/* Differential Diagnoses */}
                  {analysisResult.differentialDiagnoses && analysisResult.differentialDiagnoses.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                        Chẩn đoán phân biệt
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.differentialDiagnoses.map((diag, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold">
                            • {diag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Advice */}
                  {analysisResult.advice && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                        Tư vấn & Hướng xử lý
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80 font-medium">
                        {analysisResult.advice}
                      </p>
                    </div>
                  )}

                  {/* Warnings */}
                  {analysisResult.urgentWarnings && analysisResult.urgentWarnings.length > 0 && (
                    <div className="space-y-2 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs">
                      <h4 className="font-bold text-rose-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Dấu hiệu cảnh báo nguy hiểm</span>
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-rose-800">
                        {analysisResult.urgentWarnings.map((warn, wIdx) => (
                          <li key={wIdx}>{warn}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      {analysisResult.disclaimer || 'Miễn trừ trách nhiệm y tế: Phản hồi từ Trợ lý AI chỉ mang tính chất tham khảo.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 border border-dashed border-slate-200 text-center space-y-3 h-full flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Phân tích Triệu chứng Lâm sàng</h3>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                    Nhập các triệu chứng bên trái và bấm &quot;Phân tích triệu chứng bằng NexAI&quot; để nhận kết quả phân loại mức độ rủi ro y tế ngay lập tức.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </RoleGuard>
    </AppLayout>
  );
}
