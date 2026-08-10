'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency } from '@/lib/format';
import { Printer, Download } from 'lucide-react';
import { Prescription } from '@/types/api';

export default function PrescriptionsPage() {
  const { t } = useLanguage();

  const prescription: Prescription = {
    id: 1,
    medicalRecordId: 101,
    patientName: 'Nguyen Van An',
    doctorName: 'Dr. Nguyen Minh Tuan',
    notes: 'Take medications strictly after meals with warm water. Complete the 7-day course.',
    totalAmount: 285000,
    items: [
      {
        id: 1,
        productId: 10,
        productName: 'Paracetamol 500mg (Panadol Extra)',
        quantity: 20,
        dosage: '1 tablet x 2 times/day after meals',
        unitPrice: 3000,
        totalPrice: 60000,
      },
      {
        id: 2,
        productId: 12,
        productName: 'Amoxicillin 500mg (Antibiotic)',
        quantity: 14,
        dosage: '1 capsule x 2 times/day (every 12 hrs)',
        unitPrice: 9000,
        totalPrice: 126000,
      },
      {
        id: 3,
        productId: 15,
        productName: 'Bromhexine 8mg (Cough Syrup)',
        quantity: 1,
        dosage: '10ml x 3 times/day after meals',
        unitPrice: 99000,
        totalPrice: 99000,
      },
    ],
    createdAt: '2026-08-10',
  };

  return (
    <AppLayout title={t('prescriptionsTitle')}>
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900">{t('officialPrescription')}</h2>
            <p className="text-xs text-slate-500">Record ID: #RX-00{prescription.id}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>{t('printPrescription')}</span>
            </button>
            <button
              onClick={() => alert('PDF Exported!')}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{t('exportPdf')}</span>
            </button>
          </div>
        </div>

        {/* Medical Document Container */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg max-w-4xl mx-auto space-y-8 print:border-none print:shadow-none">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-extrabold text-2xl tracking-tight">
                <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">✦</span>
                NexClinic
              </div>
              <p className="text-xs text-slate-500 mt-1">AI-Powered Precision Healthcare Center</p>
              <p className="text-[11px] text-slate-400">123 Health Science Avenue, Ho Chi Minh City</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-200">
                #RX-00{prescription.id}
              </span>
              <p className="text-xs text-slate-500 mt-2">{t('date')}: {prescription.createdAt}</p>
            </div>
          </div>

          {/* Patient & Doctor Metadata Grid */}
          <div className="grid grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs">
            <div>
              <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">{t('patientName')}</p>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">{prescription.patientName}</p>
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">{t('attendingPhysician')}</p>
              <p className="text-sm font-extrabold text-blue-600 mt-0.5">{prescription.doctorName}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">{t('prescribedMedications')}</h3>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">{t('medicineName')}</th>
                  <th className="p-3">{t('qty')}</th>
                  <th className="p-3">{t('dosageInstructions')}</th>
                  <th className="p-3">{t('unitPrice')}</th>
                  <th className="p-3 text-right rounded-r-xl">{t('totalPrice')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {prescription.items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-3 font-bold text-slate-900">{item.productName}</td>
                    <td className="p-3 font-mono font-bold">{item.quantity}</td>
                    <td className="p-3 text-purple-700 font-semibold">{item.dosage}</td>
                    <td className="p-3 text-slate-600">{formatCurrency(item.unitPrice)}</td>
                    <td className="p-3 text-right font-extrabold text-slate-900">{formatCurrency(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Instructions & Total */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-6 border-t border-slate-200">
            <div className="space-y-1 text-xs max-w-md">
              <p className="font-bold text-slate-900">{t('doctorNotes')}:</p>
              <p className="text-slate-600 italic leading-relaxed bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 text-amber-900">
                "{prescription.notes}"
              </p>
            </div>

            <div className="text-right space-y-1">
              <p className="text-xs text-slate-500">{t('totalAmount')}</p>
              <p className="text-2xl font-extrabold text-blue-600">{formatCurrency(prescription.totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
