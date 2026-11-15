'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { doctorService } from '@/services/doctorService';
import { patientService } from '@/services/patientService';
import { appointmentService } from '@/services/appointmentService';
import { useAuthStore } from '@/store/useAuthStore';
import { clinicDate, displayDate } from '@/lib/clinic-date';
import { formatCurrency } from '@/lib/format';
import type { AvailableSlot, Doctor, Patient } from '@/types/api';

export function BookingDialog({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const { user } = useAuthStore();
  const isPatient = user?.role === 'ROLE_PATIENT';
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [doctorId, setDoctorId] = useState(0);
  const [patientId, setPatientId] = useState(0);
  const [date, setDate] = useState(clinicDate());
  const [slot, setSlot] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [slotError, setSlotError] = useState('');
  const [retry, setRetry] = useState(0);
  const [slotRetry, setSlotRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    Promise.all([doctorService.getAllDoctors({ size: 100 }), isPatient ? patientService.getMyPatientProfile().then((patient) => [patient]) : patientService.getAllPatients({ size: 100 }).then((result) => result.items || result.content || [])])
      .then(([result, people]) => {
        if (!active) return;
        const list = result.items || result.content || [];
        setDoctors(list); setPatients(people);
        const selectedPatient = Number(new URLSearchParams(window.location.search).get('patient'));
        setPatientId(isPatient ? people[0]?.id || 0 : people.some((person) => person.id === selectedPatient) ? selectedPatient : 0);
        const selectedDoctor = Number(new URLSearchParams(window.location.search).get('doctor'));
        setDoctorId(list.some((doctor) => doctor.id === selectedDoctor) ? selectedDoctor : 0);
      })
      .catch(() => { if (active) setError('Không tải được thông tin đặt lịch. Nếu chưa có hồ sơ bệnh nhân, vui lòng liên hệ lễ tân.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [isPatient, retry]);
  useEffect(() => {
    let active = true;
    setSlot(''); setSlots([]); setSlotError('');
    if (!doctorId || !date || date < clinicDate() || date > clinicDate(7)) { setLoadingSlots(false); return; }
    setLoadingSlots(true);
    doctorService.getAvailableSlots(doctorId, date).then((result) => {
      if (active) setSlots(result.filter((item) => date !== clinicDate() || new Date(`${date}T${item.startTime}+07:00`).getTime() >= Date.now() + 3600000));
    }).catch(() => { if (active) setSlotError('Không tải được giờ khám. Vui lòng thử lại.'); }).finally(() => { if (active) setLoadingSlots(false); });
    return () => { active = false; };
  }, [doctorId, date, slotRetry]);
  const doctor = doctors.find((item) => item.id === doctorId);
  const patient = patients.find((item) => item.id === patientId);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError('');
    const selectedSlot = slots.find((item) => item.timeSlotLabel === slot);
    if (!patient || !doctor || !selectedSlot || date < clinicDate() || date > clinicDate(7)) { setError('Vui lòng chọn đầy đủ bệnh nhân, bác sĩ, ngày và giờ khám hợp lệ.'); setStep(1); return; }
    if (date === clinicDate() && new Date(`${date}T${selectedSlot.startTime}+07:00`).getTime() < Date.now() + 3600000) { setError('Giờ khám cần cách hiện tại ít nhất một tiếng. Vui lòng chọn lại.'); setSlotRetry(slotRetry + 1); setStep(1); return; }
    if (step === 1) { setStep(2); return; }
    setSubmitting(true);
    try { await appointmentService.createAppointment({ doctorId, patientId, appointmentDate: date, timeSlot: slot, reason }); onSuccess(); }
    catch (failure) {
      const response = failure as { response?: { data?: { message?: string } } };
      setError(response.response?.data?.message || 'Chưa xác định được kết quả đặt lịch. Hãy kiểm tra danh sách lịch hẹn trước khi gửi lại.');
    } finally { setSubmitting(false); }
  };
  return <Modal isOpen onClose={() => { if (!submitting) onClose(); }} title="Đặt lịch khám" subtitle="Dành một khoảng thời gian để chăm sóc bản thân." maxWidth="lg">
    <div className="mb-6 flex gap-6 border-b border-slate-100 pb-4 text-xs"><span className={step === 1 ? 'font-semibold text-teal-800' : 'text-slate-400'}>01 · Chọn lịch khám</span><span className={step === 2 ? 'font-semibold text-teal-800' : 'text-slate-400'}>02 · Kiểm tra thông tin</span></div>
    {loading ? <p role="status" className="py-12 text-center text-sm text-slate-500">Đang chuẩn bị thông tin…</p> : <form onSubmit={submit} className="space-y-5">
      {error && <div role="alert" className="rounded-xl bg-rose-50 p-4 text-xs leading-6 text-rose-700">{error}{!doctors.length && <button type="button" onClick={() => setRetry(retry + 1)} className="ml-2 underline">Thử tải lại</button>}</div>}
      {step === 1 ? <div className="page-enter space-y-5">
        <div><label htmlFor="booking-patient" className="field-label">Người khám</label>{isPatient ? <p id="booking-patient" className="rounded-xl bg-[#f2f5ef] px-4 py-3 text-sm">{patient?.fullName || 'Chưa có hồ sơ bệnh nhân'}</p> : <select id="booking-patient" required value={patientId || ''} onChange={(event) => setPatientId(Number(event.target.value))} className="field-input"><option value="">Chọn bệnh nhân</option>{patients.map((person) => <option key={person.id} value={person.id}>{person.fullName} · {person.phone}</option>)}</select>}</div>
        <div><label htmlFor="booking-doctor" className="field-label">Bác sĩ</label><select id="booking-doctor" required value={doctorId || ''} onChange={(event) => setDoctorId(Number(event.target.value))} className="field-input"><option value="">Chọn bác sĩ phù hợp</option>{doctors.map((item) => <option key={item.id} value={item.id}>{item.fullName} · {item.specialization}</option>)}</select></div>
        <div><label htmlFor="booking-date" className="field-label">Ngày khám</label><input id="booking-date" type="date" required min={clinicDate()} max={clinicDate(7)} value={date} onChange={(event) => setDate(event.target.value)} className="field-input" /><p className="mt-2 text-[11px] leading-5 text-slate-500">Đặt trước tối đa 7 ngày. Lịch hôm nay cần cách hiện tại ít nhất 1 tiếng.</p></div>
        <fieldset><legend className="field-label">Giờ khám còn trống</legend>{loadingSlots ? <p role="status" className="text-xs text-slate-500">Đang tìm giờ khám…</p> : slotError ? <p role="alert" className="text-xs text-rose-700">{slotError} <button type="button" onClick={() => setSlotRetry(slotRetry + 1)} className="underline">Thử lại</button></p> : !slots.length ? <p className="rounded-xl bg-[#f5f7f2] p-4 text-xs leading-6 text-slate-500">{doctorId ? 'Không có giờ khám phù hợp. Bạn có thể chọn ngày hoặc bác sĩ khác.' : 'Chọn bác sĩ và ngày để xem giờ khám.'}</p> : <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{slots.map((item) => <label key={item.timeSlotLabel} className={`cursor-pointer rounded-lg border px-2 py-3 text-center text-xs transition ${slot === item.timeSlotLabel ? 'border-teal-700 bg-teal-50 text-teal-900' : 'border-slate-200 hover:border-teal-400'}`}><input type="radio" name="booking-slot" className="sr-only" required value={item.timeSlotLabel} checked={slot === item.timeSlotLabel} onChange={() => setSlot(item.timeSlotLabel)} />{item.timeSlotLabel}</label>)}</div>}</fieldset>
        <div><label htmlFor="booking-reason" className="field-label">Lý do khám <span className="text-slate-400">· Không bắt buộc</span></label><textarea id="booking-reason" rows={3} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Chia sẻ điều bạn muốn trao đổi với bác sĩ…" className="field-input" /></div>
      </div> : <div className="page-enter rounded-2xl bg-[#f4f7f0] p-5"><p className="eyebrow">THÔNG TIN LỊCH HẸN</p><h3 className="mt-4 text-lg font-medium">{doctor?.fullName}</h3><p className="mt-1 text-xs text-slate-500">{doctor?.specialization}</p><dl className="mt-6 space-y-4 text-sm"><div className="flex justify-between gap-4"><dt className="text-slate-500">Người khám</dt><dd>{patient?.fullName}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Ngày khám</dt><dd>{displayDate(date)}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Giờ khám</dt><dd>{slot}</dd></div>{reason && <div><dt className="text-slate-500">Lý do khám</dt><dd className="mt-2 whitespace-pre-wrap">{reason}</dd></div>}</dl></div>}
      <div className="flex items-center justify-between border-t border-slate-100 pt-5"><div><p className="text-xs text-slate-500">Tổng phí khám</p><p className="mt-1 text-xl font-medium text-teal-900">{doctor ? formatCurrency(doctor.consultationFee) : '—'}</p></div><p className="max-w-40 text-right text-[11px] leading-5 text-slate-500">Không cần thanh toán trước.<br />Lịch gửi đi sẽ chờ xác nhận.</p></div>
      <div className="flex justify-end gap-3">{step === 2 && <button type="button" disabled={submitting} onClick={() => setStep(1)} className="btn-secondary">Quay lại</button>}<button disabled={submitting || loadingSlots || !slot || !patientId || !doctorId} className="btn-primary">{submitting ? 'Đang gửi yêu cầu…' : step === 1 ? 'Kiểm tra thông tin' : 'Gửi yêu cầu đặt lịch'}</button></div>
    </form>}
  </Modal>;
}
