'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency } from '@/lib/format';
import { CreditCard, ExternalLink, Search, CheckCircle2 } from 'lucide-react';
import { Payment } from '@/types/api';

export default function PaymentsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');

  const [payments] = useState<Payment[]>([
    {
      id: 'a8b3c2d1-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
      appointmentId: 101,
      patientName: 'Nguyen Van An',
      amount: 300000,
      paymentStatus: 'SUCCESS',
      paymentMethod: 'VNPAY',
      gatewayTransactionId: '14829103',
      orderRef: 'NEX-PAY-101-2026',
      createdAt: '2026-08-10 09:05',
      paidAt: '2026-08-10 09:07',
    },
    {
      id: 'b9c4d3e2-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
      appointmentId: 102,
      patientName: 'Tran Thi Binh',
      amount: 250000,
      paymentStatus: 'PENDING',
      paymentMethod: 'VNPAY',
      orderRef: 'NEX-PAY-102-2026',
      createdAt: '2026-08-10 09:32',
    },
    {
      id: 'c0d5e4f3-6a7b-8c9d-0e1f-2a3b4c5d6e7f',
      appointmentId: 104,
      patientName: 'Pham Minh Dung',
      amount: 400000,
      paymentStatus: 'SUCCESS',
      paymentMethod: 'CASH',
      orderRef: 'NEX-PAY-104-2026',
      createdAt: '2026-08-10 11:05',
      paidAt: '2026-08-10 11:06',
    },
  ]);

  const filtered = payments.filter(
    (p) =>
      (p.patientName?.toLowerCase().includes(search.toLowerCase()) || false) ||
      p.id.includes(search) ||
      (p.orderRef?.includes(search) || false)
  );

  const handleVnPayCheckout = (payment: Payment) => {
    alert(`VNPay Checkout: ${payment.orderRef} - ${formatCurrency(payment.amount)}`);
  };

  return (
    <AppLayout title={t('paymentsTitle')}>
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
        </div>

        {/* Payment History Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                <tr>
                  <th className="px-6 py-4">{t('paymentUuidOrderRef')}</th>
                  <th className="px-6 py-4">{t('appointmentAndPatient')}</th>
                  <th className="px-6 py-4">{t('method')}</th>
                  <th className="px-6 py-4">{t('amount')}</th>
                  <th className="px-6 py-4">{t('status')}</th>
                  <th className="px-6 py-4 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[160px] inline-block">
                          {pay.id}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{pay.orderRef}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{pay.patientName}</p>
                      <p className="text-[11px] text-slate-400">Apt #{pay.appointmentId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                        <CreditCard className="w-3 h-3" />
                        {pay.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-900">{formatCurrency(pay.amount)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={pay.paymentStatus} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {pay.paymentStatus === 'PENDING' ? (
                        <button
                          onClick={() => handleVnPayCheckout(pay)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 transition inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{t('payWithVnPay')}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Paid ({pay.paidAt})
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
