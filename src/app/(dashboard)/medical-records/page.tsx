'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Modal } from '@/components/ui/Modal';
import { useLanguage } from '@/context/LanguageContext';
import { Search, Plus, Eye } from 'lucide-react';
import { MedicalRecord } from '@/types/api';

export default function MedicalRecordsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [records] = useState<MedicalRecord[]>([
    {
      id: 1,
      appointmentId: 101,
      patientId: 1,
      patientName: 'Nguyen Van An',
      doctorId: 1,
      doctorName: 'Dr. Nguyen Minh Tuan',
      diagnosis: 'Chronic Bronchitis / Rule out Pulmonary Tuberculosis',
      symptoms: 'Persistent cough for 2 weeks, afternoon low-grade fever',
      notes: 'Chest X-Ray PA view recommended. Prescribed Paracetamol & Antibiotics.',
      reexaminationDate: '2026-08-20',
      createdAt: '2026-08-10',
    },
    {
      id: 2,
      appointmentId: 104,
      patientId: 4,
      patientName: 'Pham Minh Dung',
      doctorId: 3,
      doctorName: 'Dr. Pham Hoang Nam',
      diagnosis: 'Migraine with Aura',
      symptoms: 'Unilateral throbbing headache, light sensitivity',
      notes: 'Advised rest in dim environment. Prescribed Pain Management regimen.',
      reexaminationDate: '2026-08-25',
      createdAt: '2026-08-10',
    },
  ]);

  const filtered = records.filter(
    (r) =>
      (r.patientName?.toLowerCase().includes(search.toLowerCase()) || false) ||
      r.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout title={t('medicalRecordsTitle')}>
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchRecordsPlaceholder')}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 border-none text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('createMedicalRecord')}</span>
          </button>
        </div>

        {/* EMR Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                <tr>
                  <th className="px-6 py-4">{t('recordId')}</th>
                  <th className="px-6 py-4">{t('patientName')}</th>
                  <th className="px-6 py-4">{t('attendingPhysician')}</th>
                  <th className="px-6 py-4">{t('primaryDiagnosis')}</th>
                  <th className="px-6 py-4">{t('visitDate')}</th>
                  <th className="px-6 py-4">{t('reexamDate')}</th>
                  <th className="px-6 py-4 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                        #MR-{rec.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{rec.patientName}</td>
                    <td className="px-6 py-4 text-blue-600 font-semibold">{rec.doctorName}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold">
                        {rec.diagnosis}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{rec.createdAt}</td>
                    <td className="px-6 py-4 text-slate-700 font-bold">{rec.reexaminationDate || 'N/A'}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/medical-records/${rec.id}`}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-[11px] hover:bg-blue-600 hover:text-white transition inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t('viewAndAiSummary')}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Record Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('createMedicalRecord')}
        subtitle="Document clinical examination notes, diagnosis, and symptoms."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Saved successfully!');
            setIsModalOpen(false);
          }}
          className="space-y-4 text-xs"
        >
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Appointment & Patient</label>
            <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white">
              <option value="101">Apt #101 — Nguyen Van An (Dr. Nguyen Minh Tuan)</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('reportedSymptoms')}</label>
            <textarea
              required
              rows={2}
              placeholder="Describe symptoms..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('primaryDiagnosis')}</label>
            <input
              required
              type="text"
              placeholder="Primary diagnosis..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-sm"
            >
              {t('save')}
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
