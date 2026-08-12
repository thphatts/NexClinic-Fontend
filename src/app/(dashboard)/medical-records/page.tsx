'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useLanguage } from '@/context/LanguageContext';
import { medicalRecordService, MedicalRecordCreateParams } from '@/services/medicalRecordService';
import { patientService } from '@/services/patientService';
import { doctorService } from '@/services/doctorService';
import { MedicalRecord, Patient, Doctor } from '@/types/api';
import { Search, Plus, Eye, Loader2 } from 'lucide-react';

export default function MedicalRecordsPage() {
  const { t } = useLanguage();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modal State & Dropdowns
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [patientsList, setPatientsList] = useState<Patient[]>([]);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);

  const [formData, setFormData] = useState<MedicalRecordCreateParams>({
    appointmentId: 1,
    patientId: 0,
    doctorId: 0,
    diagnosis: '',
    symptoms: '',
    notes: '',
    reexaminationDate: '',
  });

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await medicalRecordService.getAllMedicalRecords({
        page,
        size: pageSize,
      });
      setRecords(res.items || res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      setError(errorObj.response?.data?.message || errorObj.message || 'Failed to fetch medical records');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleOpenCreateModal = async () => {
    try {
      const [patRes, docRes] = await Promise.all([
        patientService.getAllPatients({ page: 1, size: 50 }).catch(() => ({ items: [], content: [] })),
        doctorService.getAllDoctors({ page: 1, size: 50 }).catch(() => ({ items: [], content: [] })),
      ]);
      const pats = patRes.items || patRes.content || [];
      const docs = docRes.items || docRes.content || [];
      setPatientsList(pats);
      setDoctorsList(docs);
      if (pats.length > 0 && docs.length > 0) {
        setFormData({
          appointmentId: 1,
          patientId: pats[0].id,
          doctorId: docs[0].id,
          diagnosis: '',
          symptoms: '',
          notes: '',
          reexaminationDate: '',
        });
      }
    } catch {
      // ignore
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await medicalRecordService.createMedicalRecord(formData);
      setIsModalOpen(false);
      fetchRecords();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errorObj.response?.data?.message || 'Failed to create medical record');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout title={t('medicalRecordsTitle')}>
      <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_PATIENT']}>
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR']} fallback={<div />}>
              <button
                onClick={handleOpenCreateModal}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{t('createMedicalRecord')}</span>
              </button>
            </RoleGuard>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* EMR Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                <span className="text-xs font-semibold">Loading medical records...</span>
              </div>
            ) : records.length === 0 ? (
              <div className="p-16 text-center text-slate-400 text-xs font-medium">
                No medical records stored.
              </div>
            ) : (
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
                    {records.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                            #MR-{rec.id}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {rec.patientName || `Patient #${rec.patientId}`}
                        </td>
                        <td className="px-6 py-4 text-blue-600 font-semibold">
                          {rec.doctorName || `Doctor #${rec.doctorId}`}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold">
                            {rec.diagnosis}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{rec.createdAt?.split('T')[0] || '-'}</td>
                        <td className="px-6 py-4 text-slate-700 font-bold">{rec.reexaminationDate || 'N/A'}</td>
                        <td className="px-6 py-4 text-right">
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
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
          />
        </div>

        {/* Create Record Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={t('createMedicalRecord')}
          subtitle="Document clinical examination notes and diagnosis."
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient</label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                >
                  {patientsList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attending Doctor</label>
                <select
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                >
                  {doctorsList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} ({d.specialization})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Appointment ID</label>
              <input
                required
                type="number"
                value={formData.appointmentId}
                onChange={(e) => setFormData({ ...formData, appointmentId: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('reportedSymptoms')}</label>
              <textarea
                required
                rows={2}
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                placeholder="Describe patient symptoms..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('primaryDiagnosis')}</label>
              <input
                required
                type="text"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="Primary clinical diagnosis..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Doctor Notes & Treatment</label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Treatment plan, advice..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Re-examination Date</label>
              <input
                type="date"
                value={formData.reexaminationDate}
                onChange={(e) => setFormData({ ...formData, reexaminationDate: e.target.value })}
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
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{t('save')}</span>
              </button>
            </div>
          </form>
        </Modal>
      </RoleGuard>
    </AppLayout>
  );
}
