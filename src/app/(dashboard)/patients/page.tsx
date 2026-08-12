'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useLanguage } from '@/context/LanguageContext';
import { patientService, PatientCreateParams } from '@/services/patientService';
import { Search, Plus, Eye, Edit2, Phone, Mail, Trash2, Loader2 } from 'lucide-react';
import { Patient } from '@/types/api';

export default function PatientsPage() {
  const { t } = useLanguage();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filtering state
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modal & Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<PatientCreateParams>({
    fullName: '',
    citizenId: '',
    phone: '',
    email: '',
    dob: '',
    gender: 'MALE',
    address: '',
  });

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await patientService.getAllPatients({
        page,
        size: pageSize,
        search: search.trim() || undefined,
      });
      setPatients(res.items || res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      setError(errorObj.response?.data?.message || errorObj.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleOpenCreateModal = () => {
    setEditingPatient(null);
    setFormData({
      fullName: '',
      citizenId: '',
      phone: '',
      email: '',
      dob: '',
      gender: 'MALE',
      address: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      fullName: patient.fullName,
      citizenId: patient.citizenId,
      phone: patient.phone,
      email: patient.email,
      dob: patient.dob,
      gender: patient.gender,
      address: patient.address,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingPatient) {
        await patientService.updatePatient(editingPatient.id, formData);
      } else {
        await patientService.createPatient(formData);
      }
      setIsModalOpen(false);
      fetchPatients();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errorObj.response?.data?.message || 'Failed to save patient');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this patient record?')) return;
    try {
      await patientService.deletePatient(id);
      fetchPatients();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errorObj.response?.data?.message || 'Failed to delete patient');
    }
  };

  return (
    <AppLayout title={t('patientsTitle')}>
      <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF']}>
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={t('searchPatientsPlaceholder')}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 border-none text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
              />
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addNewPatient')}</span>
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Patient Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="text-xs font-medium">Loading patients...</span>
              </div>
            ) : patients.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-medium">
                No patients found. Click &quot;Add New Patient&quot; to register a patient.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                    <tr>
                      <th className="px-6 py-4">{t('patientName')}</th>
                      <th className="px-6 py-4">{t('citizenId')}</th>
                      <th className="px-6 py-4">{t('contact')}</th>
                      <th className="px-6 py-4">{t('dobGender')}</th>
                      <th className="px-6 py-4">{t('registeredDate')}</th>
                      <th className="px-6 py-4 text-right">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {patients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">
                              {patient.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{patient.fullName}</p>
                              <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{patient.address}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-slate-800 bg-slate-100 px-2 py-1 rounded-md text-[11px]">
                            {patient.citizenId}
                          </span>
                        </td>
                        <td className="px-6 py-4 space-y-0.5">
                          <p className="flex items-center gap-1.5 text-slate-800">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{patient.phone}</span>
                          </p>
                          <p className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{patient.email}</span>
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-900">{patient.dob}</p>
                          <span className="text-[10px] font-bold uppercase text-slate-500">
                            {patient.gender === 'MALE' ? t('male') : patient.gender === 'FEMALE' ? t('female') : t('other')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{patient.createdAt?.split('T')[0] || '-'}</td>
                        <td className="px-6 py-4 text-right space-x-1">
                          <Link
                            href={`/patients/${patient.id}`}
                            className="p-2 inline-flex rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                            title={t('viewDetails')}
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleOpenEditModal(patient)}
                            className="p-2 inline-flex rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition"
                            title={t('edit')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(patient.id)}
                            className="p-2 inline-flex rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

        {/* Create/Edit Patient Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingPatient ? 'Edit Patient Details' : t('registerPatientTitle')}
          subtitle={t('registerPatientSubtitle')}
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('fullName')}</label>
              <input
                required
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Nguyen Van An"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('citizenId')}</label>
                <input
                  required
                  type="text"
                  value={formData.citizenId}
                  onChange={(e) => setFormData({ ...formData, citizenId: e.target.value })}
                  placeholder="12 digit CCCD"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('phone')}</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0901234567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('dob')}</label>
                <input
                  required
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('gender')}</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                >
                  <option value="MALE">{t('male')}</option>
                  <option value="FEMALE">{t('female')}</option>
                  <option value="OTHER">{t('other')}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('email')}</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="patient@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('address')}</label>
              <input
                required
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full home address..."
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
