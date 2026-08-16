'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency } from '@/lib/format';
import { doctorService, DoctorCreateParams } from '@/services/doctorService';
import { useAuthStore } from '@/store/useAuthStore';
import { Search, Plus, Phone, Award, Eye, Trash2, Loader2, CalendarPlus, Stethoscope, Star, MessageSquare } from 'lucide-react';
import { Doctor } from '@/types/api';

export default function DoctorsPage() {
  const { t } = useLanguage();
  const { hasRole } = useAuthStore();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filtering
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<DoctorCreateParams>({
    fullName: '',
    specialization: '',
    degree: '',
    phone: '',
    email: '',
    experienceYears: 5,
    consultationFee: 300000,
  });

  const isAdmin = hasRole(['ROLE_ADMIN']);
  const isPatient = hasRole(['ROLE_PATIENT']);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await doctorService.getAllDoctors({
        page,
        size: pageSize,
        search: search.trim() || undefined,
      });
      setDoctors(res.items || res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      setError(errorObj.response?.data?.message || errorObj.message || 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await doctorService.createDoctor(formData);
      setIsModalOpen(false);
      setFormData({
        fullName: '',
        specialization: '',
        degree: '',
        phone: '',
        email: '',
        experienceYears: 5,
        consultationFee: 300000,
      });
      fetchDoctors();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errorObj.response?.data?.message || 'Failed to create doctor profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hồ sơ bác sĩ này?')) return;
    try {
      await doctorService.deleteDoctor(id);
      fetchDoctors();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errorObj.response?.data?.message || 'Failed to delete doctor');
    }
  };

  return (
    <AppLayout title={t('doctorsTitle') || 'Danh Mục Bác Sĩ & Chuyên Gia'}>
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t('searchDoctorsPlaceholder') || 'Tìm tên bác sĩ hoặc chuyên khoa...'}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none transition"
            />
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition shadow-sm flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addNewDoctor') || 'Thêm Bác Sĩ Mới'}</span>
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
            <span className="text-xs text-slate-400 font-semibold">Đang tải danh sách bác sĩ...</span>
          </div>
        ) : doctors.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs font-medium bg-white rounded-3xl border border-slate-100">
            Không tìm thấy thông tin bác sĩ phù hợp.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-purple-200/80 transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-purple-500/20">
                      {doc.fullName.charAt(0)}
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-1.5 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Xóa hồ sơ bác sĩ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                      {doc.specialization || 'Chuyên khoa'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{doc.fullName}</h3>
                    <p className="text-xs text-slate-500">{doc.degree || 'Bác sĩ chuyên khoa'}</p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <p className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-purple-500" />
                      <span>
                        {doc.experienceYears} năm kinh nghiệm
                      </span>
                    </p>
                    {doc.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{doc.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">{t('consultationFee') || 'Phí tư vấn'}</p>
                      <p className="text-sm font-extrabold text-purple-600">{formatCurrency(doc.consultationFee)}</p>
                    </div>

                    <Link
                      href={`/doctors/${doc.id}`}
                      className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-bold text-xs transition flex items-center gap-1 border border-slate-100"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('viewDetails') || 'Chi tiết'}</span>
                    </Link>
                  </div>

                  {isPatient && (
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/appointments?doctorId=${doc.id}`}
                        className="py-2 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white font-bold text-xs transition flex items-center justify-center gap-1.5 border border-purple-200/60 hover:border-transparent shadow-xs"
                      >
                        <CalendarPlus className="w-3.5 h-3.5" />
                        <span>Đặt Khám</span>
                      </Link>
                      <Link
                        href="/chat"
                        className="py-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-bold text-xs transition flex items-center justify-center gap-1.5 border border-slate-200/60 shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                        <span>Nhắn Tin</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

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

      {/* Modal Create Doctor (Admin only) */}
      {isAdmin && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={t('addNewDoctor') || 'Thêm Bác Sĩ Mới'}
          subtitle="Nhập thông tin chuyên môn để tạo hồ sơ bác sĩ trên hệ thống."
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('fullName') || 'Họ và tên'}</label>
              <input
                required
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="VD: BS. Nguyễn Minh Tuấn"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('specialization') || 'Chuyên khoa'}</label>
                <input
                  required
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="VD: Tim mạch"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('degree') || 'Bằng cấp'}</label>
                <input
                  required
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="VD: Bác sĩ CKII, ThS"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Số điện thoại</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0901234567"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="doctor@nexclinic.com"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kinh nghiệm (Năm)</label>
                <input
                  required
                  type="number"
                  min={0}
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phí tư vấn (VNĐ)</label>
                <input
                  required
                  type="number"
                  min={0}
                  step={10000}
                  value={formData.consultationFee}
                  onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
              >
                {t('cancel') || 'Hủy'}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-2xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition shadow-sm flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{t('save') || 'Lưu'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AppLayout>
  );
}
