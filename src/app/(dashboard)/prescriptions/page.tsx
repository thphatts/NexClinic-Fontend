'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency } from '@/lib/format';
import { medicalRecordService } from '@/services/medicalRecordService';
import { MedicalRecord, Prescription } from '@/types/api';
import { Printer, Download, Search, Loader2 } from 'lucide-react';

export default function PrescriptionsPage() {
  const { t } = useLanguage();
  const [recordIdInput, setRecordIdInput] = useState<string>('1');
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrescription = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const record = await medicalRecordService.getMedicalRecordById(id);
      setMedicalRecord(record);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      setError(errorObj.response?.data?.message || 'Medical record not found');
      setMedicalRecord(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrescription(1);
  }, [fetchPrescription]);

  // Build prescription document view from medical record
  const activePrescription: Prescription | null = medicalRecord
    ? {
        id: medicalRecord.id,
        medicalRecordId: medicalRecord.id,
        patientName: medicalRecord.patientName || `Patient #${medicalRecord.patientId}`,
        doctorName: medicalRecord.doctorName || `Doctor #${medicalRecord.doctorId}`,
        notes: medicalRecord.notes || 'Take medications as directed by physician after meals.',
        totalAmount: 150000,
        items: [
          {
            id: 1,
            productId: 1,
            productName: `Medication for ${medicalRecord.diagnosis}`,
            quantity: 14,
            dosage: '1 tablet x 2 times/day after meals',
            unitPrice: 10000,
            totalPrice: 140000,
          },
        ],
        createdAt: medicalRecord.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      }
    : null;

  return (
    <AppLayout title={t('prescriptionsTitle')}>
      <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF']}>
        <div className="space-y-6">
          {/* Actions & Lookup Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  value={recordIdInput}
                  onChange={(e) => setRecordIdInput(e.target.value)}
                  placeholder="Enter Medical Record ID..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 border-none text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <button
                onClick={() => {
                  if (recordIdInput) fetchPrescription(Number(recordIdInput));
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition"
              >
                Fetch
              </button>
            </div>

            <div className="flex gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>{t('printPrescription')}</span>
              </button>
              <button
                onClick={() => alert('Exporting PDF...')}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{t('exportPdf')}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Medical Document Container */}
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200/80">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
              <span className="text-xs text-slate-400 font-semibold">Fetching prescription data...</span>
            </div>
          ) : activePrescription ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg max-w-4xl mx-auto space-y-8 print:border-none print:shadow-none">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 font-extrabold text-2xl tracking-tight">
                    <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm">
                      ✦
                    </span>
                    NexClinic
                  </div>
                  <p className="text-xs text-slate-500 mt-1">AI-Powered Precision Healthcare Center</p>
                  <p className="text-[11px] text-slate-400">123 Health Science Avenue, Ho Chi Minh City</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-200">
                    #RX-00{activePrescription.id}
                  </span>
                  <p className="text-xs text-slate-500 mt-2">
                    {t('date')}: {activePrescription.createdAt}
                  </p>
                </div>
              </div>

              {/* Patient & Doctor Metadata Grid */}
              <div className="grid grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs">
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    {t('patientName')}
                  </p>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">{activePrescription.patientName}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    {t('attendingPhysician')}
                  </p>
                  <p className="text-sm font-extrabold text-blue-600 mt-0.5">{activePrescription.doctorName}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  {t('prescribedMedications')}
                </h3>
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
                    {activePrescription.items.map((item) => (
                      <tr key={item.id}>
                        <td className="p-3 font-bold text-slate-900">{item.productName}</td>
                        <td className="p-3 font-mono font-bold">{item.quantity}</td>
                        <td className="p-3 text-purple-700 font-semibold">{item.dosage}</td>
                        <td className="p-3 text-slate-600">{formatCurrency(item.unitPrice)}</td>
                        <td className="p-3 text-right font-extrabold text-slate-900">
                          {formatCurrency(item.totalPrice)}
                        </td>
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
                    &quot;{activePrescription.notes}&quot;
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-xs text-slate-500">{t('totalAmount')}</p>
                  <p className="text-2xl font-extrabold text-blue-600">
                    {formatCurrency(activePrescription.totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-16 text-center text-slate-400 text-xs font-medium bg-white rounded-3xl border border-slate-200/80">
              No prescription found for the entered medical record ID.
            </div>
          )}
        </div>
      </RoleGuard>
    </AppLayout>
  );
}
