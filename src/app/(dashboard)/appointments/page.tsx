'use client';

import { useFeedback } from '@/providers/FeedbackProvider';

import React, { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/Badge';
import { BookingDialog } from '@/components/appointments/BookingDialog';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency } from '@/lib/format';
import { appointmentService } from '@/services/appointmentService';
import { patientService } from '@/services/patientService';
import { doctorService } from '@/services/doctorService';
import { paymentService } from '@/services/paymentService';
import { Appointment, AppointmentStatus } from '@/types/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2, Trash2 } from 'lucide-react';

export default function AppointmentsPage() {
  const { notify, confirmAction } = useFeedback();
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const isDoctor = user?.role === 'ROLE_DOCTOR';
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingAppointmentIds, setUpdatingAppointmentIds] = useState<number[]>([]);

  const isPatient = user?.role === 'ROLE_PATIENT';
  const [currentDoctorId, setCurrentDoctorId] = useState<number | null>(null);
  useEffect(() => {
    if (user?.role !== 'ROLE_DOCTOR') return;
    let active = true;
    doctorService.getAllDoctors({ size: 100 }).then((result) => {
      const doctor = (result.items || result.content || []).find((item) => String(item.userId) === String(user.id));
      if (active) setCurrentDoctorId(doctor?.id ?? null);
    }).catch(() => {});
    return () => { active = false; };
  }, [user?.role, user?.id]);

  // Filter & Pagination
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusAppointment, setStatusAppointment] = useState<Appointment | null>(null);
  const [statusDraft, setStatusDraft] = useState<AppointmentStatus>('PENDING');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const canBookAppointment = user?.role === 'ROLE_PATIENT' || user?.role === 'ROLE_STAFF';
    if (new URLSearchParams(window.location.search).get('book') === '1' && canBookAppointment) setIsModalOpen(true);
  }, [user?.role]);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = isPatient ? await patientService.getMyPatientProfile() : null;
      const res = await appointmentService.filterAppointments({
        doctorId: isDoctor ? currentDoctorId ?? undefined : undefined,
        patientId: profile?.id,
        page,
        size: pageSize,
        status: statusFilter !== 'ALL' ? (statusFilter as AppointmentStatus) : undefined,
      });
      const rawItems = res.items || res.content || [];
      setAppointments(rawItems);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      setError(errorObj.response?.data?.message || errorObj.message || 'Không tải được lịch hẹn');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, statusFilter, isPatient, currentDoctorId, isDoctor]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleStatusChange = async (id: number, newStatus: AppointmentStatus) => {
    if (updatingAppointmentIds.includes(id)) return;
    setUpdatingAppointmentIds((ids) => [...ids, id]);
    try {
      const updatedAppointment = await appointmentService.updateAppointmentStatus(id, newStatus);
      setAppointments((items) => items.map((appointment) => (
        appointment.id === id ? { ...appointment, ...updatedAppointment } : appointment
      )));
      setStatusAppointment(null);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      notify(errorObj.response?.data?.message || errorObj.message || 'Không cập nhật được trạng thái lịch hẹn. Vui lòng thử lại.');
    } finally {
      setUpdatingAppointmentIds((ids) => ids.filter((appointmentId) => appointmentId !== id));
    }
  };

  const handleCancel = async (id: number) => {
    if (!await confirmAction('Bạn muốn hủy lịch hẹn này?')) return;
    try {
      await appointmentService.cancelAppointment(id);
      fetchAppointments();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      notify(errorObj.response?.data?.message || 'Không hủy được lịch hẹn');
    }
  };

  const handlePayVNPay = async (appointmentId: number) => {
    try {
      const payment = await paymentService.createPayment({
        appointmentId,
        paymentMethod: 'VNPAY',
      });
      if (payment.paymentUrl) {
        window.location.assign(payment.paymentUrl);
      } else {
        notify('Đã tạo yêu cầu thanh toán.');
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      notify(errorObj.response?.data?.message || 'Không khởi tạo được thanh toán VNPay');
    }
  };

  return (
    <AppLayout title={t('appointmentsTitle')}>
      <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF', 'ROLE_PATIENT']}>
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 clinic-panel bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-slate-100 border-none text-xs text-slate-700 font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="ALL">{t('allStatuses')}</option>
                  <option value="PENDING">Chờ xác nhận</option>
                  <option value="CONFIRMED">Đã xác nhận</option>
                  <option value="COMPLETED">Hoàn tất</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>
            </div>

            {(user?.role === 'ROLE_PATIENT' || user?.role === 'ROLE_STAFF') && <button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2"
            >
              <span>{t('bookAppointment')}</span>
            </button>}
          </div>

          {notice && <p role="status" className="rounded-xl bg-teal-50 p-4 text-sm text-teal-800">{notice}</p>}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="clinic-panel bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                <span className="text-xs font-semibold">Đang tải lịch hẹn…</span>
              </div>
            ) : appointments.length === 0 ? (
              <div className="p-16 text-center text-slate-400 text-xs font-medium">
                Chưa có lịch hẹn phù hợp.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Mã lịch / Giờ khám</th>
                      <th className="px-6 py-4">{t('patientName')}</th>
                      <th className="px-6 py-4">{t('assignedDoctor')}</th>
                      <th className="px-6 py-4">{t('reasonForVisit')}</th>
                      <th className="px-6 py-4">{t('fee')}</th>
                      <th className="px-6 py-4">{t('status')}</th>
                      {user?.role === 'ROLE_ADMIN' && <th className="px-6 py-4 text-right">Thao tác</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">

                            <div>
                              <p className="font-bold text-slate-900">
                                #{apt.id} • {apt.timeSlot}
                              </p>
                              <p className="text-[11px] text-slate-400">{apt.appointmentDate}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {apt.patientName || `Bệnh nhân #${apt.patientId}`}
                        </td>
                        <td className="px-6 py-4 text-blue-600 font-semibold">
                          {apt.doctorName || `Bác sĩ #${apt.doctorId}`}
                        </td>
                        <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{apt.reason || '-'}</td>
                        <td className="px-6 py-4 font-extrabold text-slate-900">{formatCurrency(apt.consultationFee)}</td>
                        <td className="px-6 py-4">
                          {currentDoctorId === apt.doctorId ? (
                            <button type="button" onClick={() => { setStatusAppointment(apt); setStatusDraft(apt.status); }} aria-label={`Cập nhật trạng thái lịch hẹn ${apt.id}`}>
                              <Badge variant={apt.status} />
                            </button>
                          ) : <Badge variant={apt.status} />}
                          {isPatient && apt.status === 'CONFIRMED' && <button
                            onClick={() => handlePayVNPay(apt.id)}
                            className="ml-2 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100"
                            title="Thanh toán qua VNPay"
                          >VNPay</button>}
                        </td>
                        {user?.role === 'ROLE_ADMIN' && <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleCancel(apt.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Hủy lịch hẹn"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>}
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

        <Modal
          isOpen={!!statusAppointment}
          onClose={() => { if (!statusAppointment || !updatingAppointmentIds.includes(statusAppointment.id)) setStatusAppointment(null); }}
          title="Cập nhật trạng thái lịch hẹn"
          subtitle={statusAppointment ? `Lịch hẹn #${statusAppointment.id} · ${statusAppointment.appointmentDate} · ${statusAppointment.timeSlot}` : undefined}
          maxWidth="sm"
        >
          {statusAppointment && <div className="space-y-5">
            <label className="block text-sm font-medium text-slate-700" htmlFor="appointment-status">Trạng thái</label>
            <select
              id="appointment-status"
              value={statusDraft}
              disabled={updatingAppointmentIds.includes(statusAppointment.id)}
              onChange={(event) => setStatusDraft(event.target.value as AppointmentStatus)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-700 disabled:opacity-60"
            >
              <option value="PENDING">Chờ xác nhận</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="COMPLETED">Hoàn tất</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setStatusAppointment(null)} disabled={updatingAppointmentIds.includes(statusAppointment.id)} className="btn-secondary">Đóng</button>
              <button type="button" onClick={() => void handleStatusChange(statusAppointment.id, statusDraft)} disabled={statusDraft === statusAppointment.status || updatingAppointmentIds.includes(statusAppointment.id)} className="btn-primary inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60">
                {updatingAppointmentIds.includes(statusAppointment.id) && <Loader2 className="h-4 w-4 animate-spin" />}
                Lưu trạng thái
              </button>
            </div>
          </div>}
        </Modal>

        {isModalOpen && <BookingDialog onClose={() => setIsModalOpen(false)} onSuccess={() => { setIsModalOpen(false); setNotice('Đã gửi yêu cầu đặt lịch. Bạn có thể theo dõi trạng thái tại đây.'); void fetchAppointments(); }} />}
      </RoleGuard>
    </AppLayout>
  );
}
