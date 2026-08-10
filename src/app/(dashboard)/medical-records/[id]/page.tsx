'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Sparkles, ArrowLeft, FileText, User, Stethoscope, Calendar, AlertCircle, CheckCircle2, Pill } from 'lucide-react';

export default function MedicalRecordDetailPage() {
  const [showAiSummary, setShowAiSummary] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const record = {
    id: 1,
    appointmentId: 101,
    patientName: 'Nguyen Van An',
    doctorName: 'Dr. Nguyen Minh Tuan',
    specialization: 'Cardiology',
    diagnosis: 'Chronic Bronchitis / Rule out Pulmonary Tuberculosis',
    symptoms: 'Persistent cough for 2 weeks, afternoon low-grade fever, chest tightness during physical activity.',
    notes: 'Chest X-Ray PA view requested. Prescribed Paracetamol 500mg and Cough Suppressant Syrup. Recommended 7 days bed rest.',
    reexaminationDate: '2026-08-20',
    createdAt: '2026-08-10',
  };

  const handleAiSummarize = () => {
    setShowAiSummary(true);
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
    }, 1000);
  };

  return (
    <AppLayout title={`Medical Record #MR-${record.id}`}>
      <div className="space-y-6">
        {/* Back Link */}
        <Link
          href="/medical-records"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Medical Records</span>
        </Link>

        {/* EMR Detail Card Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                #MR-{record.id}
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900">{record.diagnosis}</h1>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Patient: <strong className="text-slate-900">{record.patientName}</strong> • Doctor:{' '}
              <strong className="text-blue-600">{record.doctorName}</strong> ({record.specialization})
            </p>
          </div>

          <button
            onClick={handleAiSummarize}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold text-xs hover:shadow-lg hover:scale-105 transition-all shadow-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>✨ Summarize with NexAI</span>
          </button>
        </div>

        {/* Two-column layout: Main record & AI Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Clinical Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5 text-xs">
              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Reported Symptoms</h3>
                <p className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-slate-800 leading-relaxed font-medium">
                  {record.symptoms}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Primary Diagnosis</h3>
                <p className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/60 text-purple-900 font-bold leading-relaxed">
                  {record.diagnosis}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Doctor Examination Notes</h3>
                <p className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-slate-800 leading-relaxed font-medium">
                  {record.notes}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-slate-400">Visit Date</p>
                  <p className="font-bold text-slate-900 mt-0.5">{record.createdAt}</p>
                </div>
                <div>
                  <p className="text-slate-400">Re-examination Date</p>
                  <p className="font-bold text-slate-900 mt-0.5">{record.reexaminationDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* NexAI Summary Side Panel */}
          <div>
            {showAiSummary ? (
              <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 rounded-3xl p-6 shadow-md space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-between items-center pb-3 border-b border-purple-200">
                  <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>NexAI Clinical Summary</span>
                  </div>
                  <span className="text-[10px] bg-purple-200 text-purple-900 font-extrabold px-2 py-0.5 rounded-full uppercase">
                    AI Assist
                  </span>
                </div>

                {isAiLoading ? (
                  <div className="py-8 text-center text-xs text-purple-700 font-semibold space-y-2">
                    <Sparkles className="w-6 h-6 mx-auto animate-spin text-purple-600" />
                    <p>Generating clinical summary from medical context...</p>
                  </div>
                ) : (
                  <div className="space-y-3.5 text-xs text-slate-800">
                    <div className="p-3 bg-white/80 rounded-2xl border border-purple-100">
                      <p className="font-bold text-purple-900 mb-1">Key Findings:</p>
                      <p className="leading-relaxed">
                        Patient presents classic symptoms of persistent lower respiratory tract inflammation. Low-grade fever suggests mild ongoing infection.
                      </p>
                    </div>

                    <div className="p-3 bg-white/80 rounded-2xl border border-purple-100">
                      <p className="font-bold text-purple-900 mb-1">Suggested Lab Protocol:</p>
                      <ul className="list-disc pl-4 space-y-1 text-[11px]">
                        <li>PA Chest Radiograph (X-Ray)</li>
                        <li>Complete Blood Count (CBC) with Differential</li>
                        <li>Sputum Smear Examination</li>
                      </ul>
                    </div>

                    {/* Medical Disclaimer */}
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[10px] text-amber-900 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="leading-tight">
                        <strong>Disclaimer:</strong> AI-generated summaries are for clinical decision assistance only and do not replace official physician diagnosis.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-dashed border-slate-200 text-center text-xs space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900">NexAI Clinical Analysis</h4>
                <p className="text-slate-500 leading-relaxed">
                  Click <strong>"Summarize with NexAI"</strong> to generate an instant clinical breakdown, lab recommendations, and risk factors.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
