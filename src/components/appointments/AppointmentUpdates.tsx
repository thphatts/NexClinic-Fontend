'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import { patientService } from '@/services/patientService';
import { appointmentService } from '@/services/appointmentService';
import { displayDate } from '@/lib/clinic-date';
import type { Appointment } from '@/types/api';

export function AppointmentUpdates({ onClose }: { onClose: () => void }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    async function load() {
      try {
        const patient = await patientService.getMyPatientProfile();
        const result = await appointmentService.filterAppointments({ patientId: patient.id, status: 'CONFIRMED', page: 1, size: 20, sortDir: 'desc' });
        if (active) setAppointments(result.items || result.content || []);
      } catch { if (active) setError('Chưa tải được lịch đã xác nhận. Hãy kiểm tra hồ sơ bệnh nhân và thử lại.'); }
      finally { if (active) setLoading(false); }
    }
    void load();
    return () => { active = false; };
  }, [retry]);
  return <Modal isOpen onClose={onClose} title="Cập nhật lịch hẹn" subtitle="Các lịch khám đã được xác nhận của bạn." maxWidth="lg">
    {loading ? <p role="status" className="py-10 text-center text-sm text-slate-500">Đang tải lịch hẹn…</p> : error ? <div role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}<button onClick={() => setRetry(retry + 1)} className="mt-3 block underline">Thử lại</button></div> : !appointments.length ? <div className="py-10 text-center"><p className="text-sm font-medium">Chưa có lịch đã xác nhận</p><p className="mt-3 text-xs text-slate-500">Lịch đang chờ xử lý được hiển thị trong danh sách lịch hẹn.</p></div> : <div className="space-y-3">{appointments.map((appointment) => <article key={appointment.id} className="rounded-xl border border-[#e3e9df] p-4"><p className="text-xs font-medium text-teal-800">Đã xác nhận · Lịch #{appointment.id}</p><h3 className="mt-3 text-sm font-medium">{appointment.doctorName || `Bác sĩ #${appointment.doctorId}`}</h3><p className="mt-2 text-xs text-slate-500">{displayDate(appointment.appointmentDate)} · {appointment.timeSlot}</p></article>)}</div>}
    <Link href="/appointments" onClick={onClose} className="btn-secondary mt-5 w-full">Xem danh sách lịch hẹn</Link>
  </Modal>;
}
