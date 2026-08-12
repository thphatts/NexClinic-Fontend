'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Modal } from '@/components/ui/Modal';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { formatCurrency } from '@/lib/format';
import { doctorService, DoctorScheduleCreateParams } from '@/services/doctorService';
import { Doctor, DoctorSchedule, DoctorReview } from '@/types/api';
import { UserCheck, Clock, ArrowLeft, Plus, Star, Trash2, Loader2 } from 'lucide-react';

export default function DoctorDetailPage() {
  const params = useParams();
  const doctorId = Number(params?.id);

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
      setError(errorObj.response?.data?.message || errorObj.message || 'Failed to load doctor profile');
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
      alert(errorObj.response?.data?.message || 'Failed to add schedule');
    } finally {
      setSubmittingSchedule(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    if (!confirm('Are you sure you want to delete this duty shift?')) return;
    try {
      await doctorService.deleteSchedule(doctorId, scheduleId);
      fetchData();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errorObj.response?.data?.message || 'Failed to delete schedule');
    }
  };

  const daysOfWeek = [
    { num: 1, label: 'Monday' },
    { num: 2, label: 'Tuesday' },
    { num: 3, label: 'Wednesday' },
    { num: 4, label: 'Thursday' },
    { num: 5, label: 'Friday' },
    { num: 6, label: 'Saturday' },
    { num: 7, label: 'Sunday' },
  ];

  return (
    <AppLayout title={`Doctor Profile ${doctor ? `— ${doctor.fullName}` : ''}`}>
      <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF', 'ROLE_PATIENT']}>
        <div className="space-y-6">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Doctors Directory</span>
          </Link>

          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200/80">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
              <span className="text-xs text-slate-400 font-semibold">Loading doctor profile...</span>
            </div>
          ) : error || !doctor ? (
            <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-rose-700 text-xs font-semibold">
              {error || 'Doctor profile not found'}
            </div>
          ) : (
            <>
              {/* Doctor Profile Header */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    {doctor.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-extrabold text-slate-900">{doctor.fullName}</h1>
                      <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                        {doctor.specialization}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {doctor.degree} • <strong className="text-slate-700">{doctor.experienceYears} Years Experience</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Consultation Rate</p>
                  <p className="text-xl font-extrabold text-blue-600">{formatCurrency(doctor.consultationFee)}</p>
                </div>
              </div>

              {/* Tabs Container */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="flex border-b border-slate-100 px-6 pt-4 gap-4 bg-slate-50/50">
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                      activeTab === 'schedule'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Weekly Work Schedule</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                      activeTab === 'reviews'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Star className="w-4 h-4" />
                    <span>Patient Reviews ({reviews.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                      activeTab === 'overview'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Professional Contact</span>
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === 'schedule' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Doctor Duty Hours & Shifts</h3>
                          <p className="text-xs text-slate-500">Configured time slots for patient booking</p>
                        </div>
                        <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR']} fallback={null}>
                          <button
                            onClick={() => setIsScheduleModalOpen(true)}
                            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition flex items-center gap-1.5 shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Shift Slot</span>
                          </button>
                        </RoleGuard>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {daysOfWeek.map((day) => {
                          const daySchedules = schedules.filter((s) => s.dayOfWeek === day.num);

                          return (
                            <div key={day.num} className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                                <span className="font-bold text-xs text-slate-900">{day.label}</span>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                  {daySchedules.length > 0 ? 'Active' : 'Off'}
                                </span>
                              </div>

                              {daySchedules.length > 0 ? (
                                <div className="space-y-2 text-xs">
                                  {daySchedules.map((s) => (
                                    <div
                                      key={s.id}
                                      className="bg-white p-2.5 rounded-xl border border-slate-200/80 font-medium text-slate-700 flex justify-between items-center"
                                    >
                                      <div>
                                        <span>
                                          {s.startTime?.substring(0, 5)} — {s.endTime?.substring(0, 5)}
                                        </span>
                                        <span className="text-[10px] text-blue-600 font-bold block">
                                          {s.slotDurationMinutes}m slots
                                        </span>
                                      </div>
                                      <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR']} fallback={null}>
                                        <button
                                          onClick={() => handleDeleteSchedule(s.id)}
                                          className="text-slate-300 hover:text-rose-600 p-1"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </RoleGuard>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[11px] text-slate-400 italic py-2">No shift scheduled</p>
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
                        <p className="text-xs text-slate-400 font-medium">No reviews for this doctor yet.</p>
                      ) : (
                        reviews.map((rev) => (
                          <div key={rev.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2 text-xs">
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
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                          <p className="text-slate-400 mb-1">Direct Phone</p>
                          <p className="font-bold text-slate-900">{doctor.phone}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                          <p className="text-slate-400 mb-1">Email Address</p>
                          <p className="font-bold text-slate-900">{doctor.email}</p>
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
        <Modal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          title="Add Duty Shift"
          subtitle="Configure weekly working hours for this doctor."
        >
          <form onSubmit={handleCreateSchedule} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Day of Week</label>
              <select
                value={scheduleData.dayOfWeek}
                onChange={(e) => setScheduleData({ ...scheduleData, dayOfWeek: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
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
                <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">End Time</label>
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Slot Duration (Minutes)</label>
              <input
                required
                type="number"
                min={15}
                max={120}
                value={scheduleData.slotDurationMinutes}
                onChange={(e) => setScheduleData({ ...scheduleData, slotDurationMinutes: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingSchedule}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
              >
                {submittingSchedule && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Shift</span>
              </button>
            </div>
          </form>
        </Modal>
      </RoleGuard>
    </AppLayout>
  );
}
