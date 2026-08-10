'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, AlertCircle, CheckCircle2, AlertTriangle, Activity, RefreshCw } from 'lucide-react';
import { AiSymptomAnalysisResult } from '@/types/api';

export default function AiSymptomAnalyzerPage() {
  const { t } = useLanguage();
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('2 weeks');
  const [severity, setSeverity] = useState<number>(5);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AiSymptomAnalysisResult | null>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnalysisResult({
        triageLevel: 'Level 2 — Specialist Referral Recommended',
        possibleConditions: [
          { name: 'Chronic Bronchitis / Tracheobronchitis', probability: 85 },
          { name: 'Upper Respiratory Tract Infection (URTI)', probability: 60 },
          { name: 'Pulmonary Tuberculosis (Rule Out)', probability: 30 },
        ],
        recommendations: [
          'Schedule an in-person consultation with a Pulmonologist or General Practitioner.',
          'Obtain PA view Chest X-Ray and Complete Blood Count (CBC).',
          'Maintain adequate hydration (2-3L water daily) and rest.',
        ],
        warningSigns: [
          'Sudden onset of severe dyspnea (shortness of breath).',
          'Hemoptysis (coughing up blood or blood-tinged sputum).',
          'High fever (> 38.5°C) refractory to antipyretics.',
        ],
        suggestedAction: 'Refer to Cardiology / Pulmonology Department for physical examination.',
      });
    }, 1200);
  };

  return (
    <AppLayout title={t('aiTitle')}>
      <div className="space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span>Gemini Clinical Triage Engine</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">{t('aiTitle')}</h1>
            <p className="text-sm text-purple-100 max-w-xl leading-relaxed">
              {t('triageSubtitle')}
            </p>
          </div>
        </div>

        {/* Input Form & Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Symptom Input Form */}
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
                  placeholder="e.g. Persistent dry cough for 2 weeks, afternoon low-grade fever, chest tightness..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-600 focus:outline-none text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">{t('symptomDuration')}</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 3 days, 2 weeks"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    {t('severityLevel')} ({severity}/10)
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
                <label className="block font-semibold text-slate-700 mb-1.5">{t('additionalNotes')}</label>
                <input
                  type="text"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="e.g. No known allergies..."
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
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t('analyzeWithNexAi')}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Analysis Results Display */}
          <div>
            {analysisResult ? (
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-purple-200/80 shadow-md space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="font-extrabold text-sm text-slate-900">{t('diagnosticBreakdown')}</span>
                  <span className="text-xs bg-purple-100 text-purple-800 font-extrabold px-3 py-1 rounded-full border border-purple-200">
                    {analysisResult.triageLevel}
                  </span>
                </div>

                {/* Possible Conditions Probabilities */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    {t('differentialProbabilities')}
                  </h4>
                  {analysisResult.possibleConditions.map((cond, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{cond.name}</span>
                        <span className="text-purple-700">{cond.probability}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${cond.probability}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommended Next Steps */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    {t('recommendedActions')}
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {analysisResult.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Warning Signs */}
                <div className="space-y-2 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs">
                  <h4 className="font-bold text-rose-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>{t('redFlagWarnings')}</span>
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-rose-800">
                    {analysisResult.warningSigns.map((warn, wIdx) => (
                      <li key={wIdx}>{warn}</li>
                    ))}
                  </ul>
                </div>

                {/* Disclaimer */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>{t('disclaimerTitle')}</strong> {t('disclaimerText')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 border border-dashed border-slate-200 text-center space-y-3 h-full flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{t('symptomInputTitle')}</h3>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  Enter symptoms on the left form and click "{t('analyzeWithNexAi')}" to generate instant clinical triage scoring.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
