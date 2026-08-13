'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency } from '@/lib/format';
import { appointmentService } from '@/services/appointmentService';
import { paymentService } from '@/services/paymentService';
import { Appointment, Payment } from '@/types/api';
import { useAuthStore } from '@/store/useAuthStore';
import { CreditCard, ExternalLink, Search, Loader2 } from 'lucide-react';

export default function PaymentsPage() {
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isPatient = user?.role === 'ROLE_PATIENT';
  const isAdminOrStaff = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_STAFF';

  // Pagination & Search
  const [search, setSearch] = useState('');
  const [appointmentIdInput, setAppointmentIdInput] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchPaymentAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await appointmentService.filterAppointments({
        page,
        size: pageSize,
      });
      const rawItems = res.items || res.content || [];
      if (isPatient) {
        // Filter personal payments for patient
        const myItems = rawItems.filter(
          (apt) =>
            apt.patientName === user?.name ||
            apt.patientId?.toString() === user?.id ||
            apt.patientId?.toString() === user?.citizenId
        );
        setAppointments(myItems);
      } else {
        setAppointments(rawItems);
      }
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      setError(errorObj.response?.data?.message || errorObj.message || 'Failed to fetch payment records');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, isPatient, user?.name, user?.id, user?.citizenId]);

  useEffect(() => {
    fetchPaymentAppointments();
  }, [fetchPaymentAppointments]);

  const handleVnPayCheckout = async (apptId: number) => {
    try {
      const res: Payment = await paymentService.createPayment({
        appointmentId: apptId,
        paymentMethod: 'VNPAY',
      });
      if (res.paymentUrl) {
        window.location.href = res.paymentUrl;
      } else {
        alert('Payment ID created: ' + (res.paymentId || res.id));
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errorObj.response?.data?.message || 'Failed to initialize VNPay payment');
    }
  };

  const filtered = appointments.filter(
    (apt) =>
      (apt.patientName?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (apt.doctorName?.toLowerCase().includes(search.toLowerCase()) || false) ||
      apt.id.toString().includes(search)
  );

  return (
    <AppLayout title={t('paymentsTitle')}>
      <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_PATIENT']}>
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('searchPaymentPlaceholder')}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 border-none text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
              />
            </div>

            {isAdminOrStaff && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="number"
                  placeholder="Appointment ID..."
                  value={appointmentIdInput}
                  onChange={(e) => setAppointmentIdInput(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 border-none text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (appointmentIdInput) handleVnPayCheckout(Number(appointmentIdInput));
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition flex items-center gap-1.5 shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Create VNPay Link</span>
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Payment Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-16 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                <span className="text-xs font-semibold">Loading payment appointments...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-16 text-center text-slate-400 text-xs font-medium">
                No appointment payment records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Appointment / Order</th>
                      <th className="px-6 py-4">{t('patientName')}</th>
                      <th className="px-6 py-4">{t('assignedDoctor')}</th>
                      <th className="px-6 py-4">{t('amount')}</th>
                      <th className="px-6 py-4">{t('status')}</th>
                      <th className="px-6 py-4 text-right">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filtered.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md inline-block">
                              #APT-{apt.id}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5">{apt.appointmentDate}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900">{apt.patientName || `Patient #${apt.patientId}`}</p>
                        </td>
                        <td className="px-6 py-4 text-blue-600 font-semibold">
                          {apt.doctorName || `Doctor #${apt.doctorId}`}
                        </td>
                        <td className="px-6 py-4 font-extrabold text-slate-900">{formatCurrency(apt.amount)}</td>
                        <td className="px-6 py-4">
                          <Badge variant={apt.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleVnPayCheckout(apt.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 transition inline-flex items-center gap-1.5 shadow-sm"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{t('payWithVnPay')}</span>
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
      </RoleGuard>
    </AppLayout>
  );
}
