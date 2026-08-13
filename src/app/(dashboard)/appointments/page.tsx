'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency } from '@/lib/format';
import { appointmentService, AppointmentCreateParams } from '@/services/appointmentService';
import { patientService } from '@/services/patientService';
import { doctorService } from '@/services/doctorService';
import { paymentService } from '@/services/paymentService';
import { Appointment, AppointmentStatus, Patient, Doctor, AvailableSlot } from '@/types/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Plus, Clock, Filter, CreditCard, Trash2, Loader2 } from 'lucide-react';

export default function AppointmentsPage() {
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isPatient = user?.role === 'ROLE_PATIENT';

  // Filter & Pagination
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Patients & Doctors list for booking modal dropdowns
  const [patientsList, setPatientsList] = useState<Patient[]>([]);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [myPatientProfile, setMyPatientProfile] = useState<Patient | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<AppointmentCreateParams>({
    patientId: 0,
    doctorId: 0,
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '',
    reason: '',
  });

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await appointmentService.filterAppointments({
        page,
        size: pageSize,
        status: statusFilter !== 'ALL' ? (statusFilter as AppointmentStatus) : undefined,
      });
      const rawItems = res.items || res.content || [];
      if (isPatient) {
        // Filter personal appointments for patient
        const myItems = rawItems.filter(
          (apt) =>
            (myPatientProfile && apt.patientId === myPatientProfile.id) ||
            apt.patientName === user?.name ||
            apt.patientId?.toString() === user?.id
        );
        setAppointments(myItems);
      } else {
        setAppointments(rawItems);
      }
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      setError(errorObj.response?.data?.message || errorObj.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, statusFilter, isPatient, user?.name, user?.id, user?.citizenId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const loadPatientsAndDoctors = async () => {
    try {
      const docRes = await doctorService.getAllDoctors({ page: 1, size: 50 }).catch(() => ({ items: [], content: [] }));
      const docs = docRes.items || docRes.content || [];
      setDoctorsList(docs);

      let pId = 0;
      if (isPatient) {
        try {
          const myProfile = await patientService.getMyPatientProfile();
          setMyPatientProfile(myProfile);
          pId = myProfile.id;
        } catch {
          // Ignore if patient profile lookup fails
        }
      } else {
        const patRes = await patientService.getAllPatients({ page: 1, size: 50 }).catch(() => ({ items: [], content: [] }));
        const pats = patRes.items || patRes.content || [];
        setPatientsList(pats);
        if (pats.length > 0) pId = pats[0].id;
      }

      setFormData((prev) => ({
        ...prev,
        patientId: pId || prev.patientId,
        doctorId: docs.length > 0 ? docs[0].id : prev.doctorId,
      }));
    } catch {
      // ignore
    }
  };

  const handleOpenBookingModal = () => {
    loadPatientsAndDoctors();
    setIsModalOpen(true);
  };

  // Fetch slots whenever doctorId or appointmentDate changes
  useEffect(() => {
    if (formData.doctorId && formData.appointmentDate) {
      setLoadingSlots(true);
      doctorService
        .getAvailableSlots(formData.doctorId, formData.appointmentDate)
        .then((slots) => {
          setAvailableSlots(slots);
          if (slots.length > 0) {
            setFormData((prev) => ({ ...prev, timeSlot: slots[0].timeSlotLabel }));
          } else {
            setFormData((prev) => ({ ...prev, timeSlot: '' }));
          }
        })
        .catch(() => setAvailableSlots([]))
        .finally(() => setLoadingSlots(false));
    }
  }, [formData.doctorId, formData.appointmentDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let targetPatientId = formData.patientId;
    if (isPatient && (!targetPatientId || targetPatientId === 0)) {
      if (myPatientProfile && myPatientProfile.id) {
        targetPatientId = myPatientProfile.id;
      } else {
        try {
          const freshProfile = await patientService.getMyPatientProfile();
          setMyPatientProfile(freshProfile);
          targetPatientId = freshProfile.id;
        } catch {
          alert('Không thể xác thực hồ sơ bệnh nhân. Vui lòng thử lại!');
          return;
        }
      }
    }

    if (!targetPatientId || targetPatientId === 0) {
      alert('Vui lòng chọn bệnh nhân');
      return;
    }

    if (!formData.timeSlot) {
      alert('Vui lòng chọn ca khám khả dụng');
      return;
    }
    setSubmitting(true);
    try {
      await appointmentService.createAppointment({
        ...formData,
        patientId: targetPatientId,
      });
      setIsModalOpen(false);
      fetchAppointments();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errorObj.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: AppointmentStatus) => {
    try {
      await appointmentService.updateAppointmentStatus(id, newStatus);
      fetchAppointments();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errorObj.response?.data?.message || 'Failed to update status');
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentService.cancelAppointment(id);
      fetchAppointments();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errorObj.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handlePayVNPay = async (appointmentId: number) => {
    try {
      const payment = await paymentService.createPayment({
        appointmentId,
        paymentMethod: 'VNPAY',
      });
      if (payment.paymentUrl) {
        window.location.href = payment.paymentUrl;
      } else {
        alert('Payment created successfully!');
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errorObj.response?.data?.message || 'Failed to initialize VNPay payment');
    }
  };

  return (
    <AppLayout title={t('appointmentsTitle')}>
      <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF', 'ROLE_PATIENT']}>
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-slate-100 border-none text-xs text-slate-700 font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="ALL">{t('allStatuses')}</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleOpenBookingModal}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t('bookAppointment')}</span>
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                <span className="text-xs font-semibold">Loading appointments...</span>
              </div>
            ) : appointments.length === 0 ? (
              <div className="p-16 text-center text-slate-400 text-xs font-medium">
                No appointment records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                    <tr>
                      <th className="px-6 py-4">ID / Time</th>
                      <th className="px-6 py-4">{t('patientName')}</th>
                      <th className="px-6 py-4">{t('assignedDoctor')}</th>
                      <th className="px-6 py-4">{t('reasonForVisit')}</th>
                      <th className="px-6 py-4">{t('fee')}</th>
                      <th className="px-6 py-4">{t('status')}</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                              <Clock className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">
                                #{apt.id} • {apt.timeSlot}
                              </p>
                              <p className="text-[11px] text-slate-400">{apt.appointmentDate}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {apt.patientName || `Patient #${apt.patientId}`}
                        </td>
                        <td className="px-6 py-4 text-blue-600 font-semibold">
                          {apt.doctorName || `Doctor #${apt.doctorId}`}
                        </td>
                        <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{apt.reason || '-'}</td>
                        <td className="px-6 py-4 font-extrabold text-slate-900">{formatCurrency(apt.amount)}</td>
                        <td className="px-6 py-4">
                          <Badge variant={apt.status} />
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <select
                            value={apt.status}
                            onChange={(e) => handleStatusChange(apt.id, e.target.value as AppointmentStatus)}
                            className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>

                          <button
                            onClick={() => handlePayVNPay(apt.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] inline-flex items-center gap-1"
                            title="Pay with VNPay"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>VNPay</span>
                          </button>

                          <button
                            onClick={() => handleCancel(apt.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Cancel Appointment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Booking Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={t('bookAppointment')}
          subtitle="Reserve a doctor consultation time slot."
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('selectPatient')}</label>
              {isPatient ? (
                <input
                  type="text"
                  readOnly
                  disabled
                  value={
                    myPatientProfile
                      ? `${myPatientProfile.fullName} (${myPatientProfile.phone})`
                      : user?.name || user?.username || 'Bệnh nhân hiện tại'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 font-medium cursor-not-allowed"
                />
              ) : (
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium text-slate-800"
                >
                  {patientsList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.phone})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('selectDoctor')}</label>
              <select
                value={formData.doctorId}
                onChange={(e) => setFormData({ ...formData, doctorId: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium text-slate-800"
              >
                {doctorsList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.fullName} ({d.specialization} - {formatCurrency(d.consultationFee)})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Appointment Date</label>
                <input
                  required
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Available Time Slot</label>
                {loadingSlots ? (
                  <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-400 font-medium animate-pulse">
                    Loading slots...
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium leading-tight">
                    ⚠️ Bác sĩ chưa có ca trực vào ngày này. Vui lòng chọn ngày khác.
                  </div>
                ) : (
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium text-slate-800"
                  >
                    {availableSlots.map((s, idx) => (
                      <option key={idx} value={s.timeSlotLabel}>
                        {s.timeSlotLabel}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reason for Visit</label>
              <textarea
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Describe symptoms or purpose of checkup..."
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
