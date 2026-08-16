'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/format';
import { doctorService, DoctorScheduleCreateParams } from '@/services/doctorService';
import { useAuthStore } from '@/store/useAuthStore';
import { Doctor, DoctorSchedule, DoctorReview } from '@/types/api';
import { UserCheck, Clock, ArrowLeft, Plus, Star, Trash2, Loader2, CalendarPlus, Phone, Mail, Award, CheckCircle2, MessageSquare } from 'lucide-react';

export default function DoctorDetailPage() {
  const params = useParams();
  const doctorId = Number(params?.id);
  const { hasRole } = useAuthStore();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [reviews, setReviews] = useState<DoctorReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'schedule' | 'reviews' | 'overview'>('schedule');

  // Schedule Modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [submittingSchedule, setSubmittingSchedule] = useState(false);
  const [scheduleData, setScheduleData] = useState<DoctorScheduleCreateParams>({
    dayOfWeek: 1,
    startTime: '08:00:00',
    endTime: '12:00:00',
    slotDurationMinutes: 30,
  });

  const isAdminOrDoctor = hasRole(['ROLE_ADMIN', 'ROLE_DOCTOR']);
  const isPatient = hasRole(['ROLE_PATIENT']);

  const fetchData = useCallback(async () => {
    if (!doctorId) return;
    setLoading(true);
    setError(null);
    try {
      const [docData, schedData, reviewData] = await Promise.all([
        doctorService.getDoctorById(doctorId),
        doctorService.getSchedules(doctorId).catch(() => []),
        doctorService.getDoctorReviews(doctorId, 1, 20).catch(() => ({ items: [], content: [] })),
      ]);
      setDoctor(docData);
      setSchedules(schedData);
      setReviews(reviewData.items || reviewData.content || []);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      setError(errorObj.response?.data?.message || errorObj.message || 'Không thể tải hồ sơ bác sĩ');
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingSchedule(true);
    try {
      await doctorService.createSchedule(doctorId, scheduleData);
      setIsScheduleModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errorObj.response?.data?.message || 'Không thể thêm ca trực');
    } finally {
      setSubmittingSchedule(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    if (!confirm('Bạn có chắc muốn xóa ca trực này?')) return;
    try {
      await doctorService.deleteSchedule(doctorId, scheduleId);
      fetchData();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errorObj.response?.data?.message || 'Không thể xóa ca trực');
    }
  };

  const daysOfWeek = [
    { num: 1, label: 'Thứ Hai' },
    { num: 2, label: 'Thứ Ba' },
    { num: 3, label: 'Thứ Tư' },
    { num: 4, label: 'Thứ Năm' },
    { num: 5, label: 'Thứ Sáu' },
    { num: 6, label: 'Thứ Bảy' },
    { num: 7, label: 'Chủ Nhật' },
  ];

  return (
    <AppLayout title={`Hồ Sơ Bác Sĩ ${doctor ? `— ${doctor.fullName}` : ''}`}>
      <div className="space-y-6">
        <Link
          href="/doctors"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-purple-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Danh Sách Bác Sĩ</span>
        </Link>

        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-xs">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
            <span className="text-xs text-slate-400 font-semibold">Đang tải hồ sơ bác sĩ...</span>
          </div>
        ) : error || !doctor ? (
          <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl text-rose-700 text-xs font-semibold">
            {error || 'Không tìm thấy hồ sơ bác sĩ'}
          </div>
        ) : (
          <>
            {/* Doctor Profile Header */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                  {doctor.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-extrabold text-slate-900">{doctor.fullName}</h1>
                    <span className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                      {doctor.specialization || 'Chuyên khoa'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {doctor.degree} • <strong className="text-slate-700">{doctor.experienceYears} năm kinh nghiệm</strong>
                  </p>
                </div>
              </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phí tư vấn</p>
                    <p className="text-xl font-extrabold text-purple-600">{formatCurrency(doctor.consultationFee)}</p>
                  </div>

                  {isPatient && (
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/appointments?doctorId=${doctor.id}`}
                        className="px-5 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 hover:scale-[1.02] transition flex items-center gap-2"
                      >
                        <CalendarPlus className="w-4 h-4" />
                        <span>Đặt Lịch Khám</span>
                      </Link>
                      <Link
                        href="/chat"
                        className="px-5 py-4 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200/80 hover:scale-[1.02] transition flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Nhắn Tin</span>
                      </Link>
                    </div>
                  )}
                </div>
            </div>

            {/* Tabs Container */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
              <div className="flex border-b border-slate-100 px-6 pt-4 gap-6 bg-slate-50/50">
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                    activeTab === 'schedule'
                      ? 'border-purple-600 text-purple-700'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Lịch Trực Tuần</span>
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                    activeTab === 'reviews'
                      ? 'border-purple-600 text-purple-700'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  <span>Đánh Giá Từ Bệnh Nhân ({reviews.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                    activeTab === 'overview'
                      ? 'border-purple-600 text-purple-700'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Thông Tin Liên Hệ</span>
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'schedule' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Lịch Khám & Khung Giờ Làm Việc</h3>
                        <p className="text-xs text-slate-500">Các ca trực sẵn sàng nhận đăng ký khám</p>
                      </div>
                      {isAdminOrDoctor && (
                        <button
                          onClick={() => setIsScheduleModalOpen(true)}
                          className="px-4 py-2 rounded-2xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition flex items-center gap-1.5 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm Ca Trực</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {daysOfWeek.map((day) => {
                        const daySchedules = schedules.filter((s) => s.dayOfWeek === day.num);

                        return (
                          <div key={day.num} className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                              <span className="font-bold text-xs text-slate-900">{day.label}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                daySchedules.length > 0 ? 'text-emerald-700 bg-emerald-100/60' : 'text-slate-400 bg-slate-200/60'
                              }`}>
                                {daySchedules.length > 0 ? 'Có lịch' : 'Nghỉ'}
                              </span>
                            </div>

                            {daySchedules.length > 0 ? (
                              <div className="space-y-2 text-xs">
                                {daySchedules.map((s) => (
                                  <div
                                    key={s.id}
                                    className="bg-white p-2.5 rounded-xl border border-slate-100 font-medium text-slate-700 flex justify-between items-center shadow-xs"
                                  >
                                    <div>
                                      <span className="font-bold text-slate-800">
                                        {s.startTime?.substring(0, 5)} — {s.endTime?.substring(0, 5)}
                                      </span>
                                      <span className="text-[10px] text-purple-600 font-bold block">
                                        {s.slotDurationMinutes} phút / ca
                                      </span>
                                    </div>
                                    {isAdminOrDoctor && (
                                      <button
                                        onClick={() => handleDeleteSchedule(s.id)}
                                        className="text-slate-300 hover:text-rose-600 p-1"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[11px] text-slate-400 italic py-2">Không có ca trực</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <p className="text-xs text-slate-400 font-medium text-center py-8">Chưa có đánh giá nào cho bác sĩ này.</p>
                    ) : (
                      reviews.map((rev) => (
                        <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-900">{rev.patientName}</span>
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span className="font-bold">{rev.rating}/5</span>
                            </div>
                          </div>
                          <p className="text-slate-600">{rev.comment}</p>
                          <span className="text-[10px] text-slate-400 block">{rev.createdAt?.split('T')[0]}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'overview' && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-slate-400 text-[10px] uppercase font-bold">Số điện thoại</p>
                          <p className="font-bold text-slate-900 text-sm">{doctor.phone || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-slate-400 text-[10px] uppercase font-bold">Email liên hệ</p>
                          <p className="font-bold text-slate-900 text-sm">{doctor.email || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Add Schedule */}
      {isAdminOrDoctor && (
        <Modal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          title="Thêm Ca Trực Mới"
          subtitle="Cấu hình khung giờ khám hàng tuần cho bác sĩ."
        >
          <form onSubmit={handleCreateSchedule} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ngày trong tuần</label>
              <select
                value={scheduleData.dayOfWeek}
                onChange={(e) => setScheduleData({ ...scheduleData, dayOfWeek: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
              >
                {daysOfWeek.map((d) => (
                  <option key={d.num} value={d.num}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Giờ bắt đầu</label>
                <input
                  required
                  type="time"
                  step="1"
                  value={scheduleData.startTime}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      startTime: e.target.value.length === 5 ? `${e.target.value}:00` : e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Giờ kết thúc</label>
                <input
                  required
                  type="time"
                  step="1"
                  value={scheduleData.endTime}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      endTime: e.target.value.length === 5 ? `${e.target.value}:00` : e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Thời lượng mỗi ca (Phút)</label>
              <input
                required
                type="number"
                min={15}
                max={120}
                value={scheduleData.slotDurationMinutes}
                onChange={(e) => setScheduleData({ ...scheduleData, slotDurationMinutes: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submittingSchedule}
                className="px-5 py-2 rounded-2xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition shadow-sm flex items-center gap-2"
              >
                {submittingSchedule && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Lưu Ca Trực</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AppLayout>
  );
}
