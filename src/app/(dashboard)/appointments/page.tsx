'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency } from '@/lib/format';
import { Search, Plus, Clock, Filter } from 'lucide-react';
import { Appointment, AppointmentStatus } from '@/types/api';

export default function AppointmentsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 101,
      patientId: 1,
      patientName: 'Nguyen Van An',
      doctorId: 1,
      doctorName: 'Dr. Nguyen Minh Tuan',
      appointmentDate: '2026-08-10',
      timeSlot: '09:00 AM',
      status: 'CONFIRMED',
      reason: 'General cardiovascular checkup & chest pressure',
      amount: 300000,
    },
    {
      id: 102,
      patientId: 2,
      patientName: 'Tran Thi Binh',
      doctorId: 2,
      doctorName: 'Dr. Le Thi Lan',
      appointmentDate: '2026-08-10',
      timeSlot: '09:30 AM',
      status: 'PENDING',
      reason: 'Skin rash consultation',
      amount: 250000,
    },
    {
      id: 103,
      patientId: 3,
      patientName: 'Le Van Cuong',
      doctorId: 1,
      doctorName: 'Dr. Nguyen Minh Tuan',
      appointmentDate: '2026-08-10',
      timeSlot: '10:15 AM',
      status: 'CONFIRMED',
      reason: 'Hypertension follow-up',
      amount: 300000,
    },
    {
      id: 104,
      patientId: 4,
      patientName: 'Pham Minh Dung',
      doctorId: 3,
      doctorName: 'Dr. Pham Hoang Nam',
      appointmentDate: '2026-08-10',
      timeSlot: '11:00 AM',
      status: 'COMPLETED',
      reason: 'Migraine consultation',
      amount: 400000,
    },
  ]);

  const filtered = appointments.filter((apt) => {
    const matchesSearch =
      (apt.patientName?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (apt.doctorName?.toLowerCase().includes(search.toLowerCase()) || false);
    const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: number, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
  };

  return (
    <AppLayout title={t('appointmentsTitle')}>
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('searchAppointmentsPlaceholder')}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 border-none text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('bookAppointment')}</span>
          </button>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                <tr>
                  <th className="px-6 py-4">{t('timeSlotDate')}</th>
                  <th className="px-6 py-4">{t('patientName')}</th>
                  <th className="px-6 py-4">{t('assignedDoctor')}</th>
                  <th className="px-6 py-4">{t('reasonForVisit')}</th>
                  <th className="px-6 py-4">{t('fee')}</th>
                  <th className="px-6 py-4">{t('status')}</th>
                  <th className="px-6 py-4 text-right">{t('updateStatus')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{apt.timeSlot}</p>
                          <p className="text-[11px] text-slate-400">{apt.appointmentDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{apt.patientName}</td>
                    <td className="px-6 py-4 text-blue-600 font-semibold">{apt.doctorName}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{apt.reason}</td>
                    <td className="px-6 py-4 font-extrabold text-slate-900">{formatCurrency(apt.amount)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={apt.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={apt.status}
                        onChange={(e) => handleStatusChange(apt.id, e.target.value as AppointmentStatus)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-blue-600"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Book Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('bookAppointment')}
        subtitle="Reserve a doctor consultation time slot for patient."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Appointment scheduled successfully!');
            setIsModalOpen(false);
          }}
          className="space-y-4 text-xs"
        >
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('selectPatient')}</label>
            <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white">
              <option value="1">Nguyen Van An (0901234567)</option>
              <option value="2">Tran Thi Binh (0912345678)</option>
              <option value="3">Le Van Cuong (0987654321)</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('selectDoctor')}</label>
            <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white">
              <option value="1">Dr. Nguyen Minh Tuan (Cardiology - ₫300,000)</option>
              <option value="2">Dr. Le Thi Lan (Dermatology - ₫250,000)</option>
              <option value="3">Dr. Pham Hoang Nam (Neurology - ₫400,000)</option>
            </select>
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
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-sm"
            >
              {t('save')}
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
