'use client';

import { useState, type FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { CalendarClock, Plus } from 'lucide-react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { AppLayout } from '@/components/layout/AppLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { useFeedback } from '@/providers/FeedbackProvider';
import { doctorService, type DoctorScheduleCreateParams } from '@/services/doctorService';
import type { Doctor, DoctorSchedule } from '@/types/api';

const DAYS = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
const PAGE_SIZE = 20;

function scheduleError(error: unknown, fallback: string) {
  return isAxiosError<{ message?: string }>(error) ? error.response?.data?.message || fallback : fallback;
}

function timeText(value: string) {
  return value.endsWith(':00') && value.length === 8 ? value.slice(0, 5) : value;
}

function timeSeconds(value: string) {
  const [hours, minutes, seconds = 0] = value.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

function DoctorShifts({ doctor }: { doctor: Doctor }) {
  const { confirmAction, notify } = useFeedback();
  const queryClient = useQueryClient();
  const [editor, setEditor] = useState<DoctorSchedule | 'new' | null>(null);
  const [formError, setFormError] = useState('');
  const queryKey = ['doctors', doctor.id, 'schedules'];
  const schedules = useQuery({ queryKey, queryFn: () => doctorService.getSchedules(doctor.id) });
  const refresh = () => queryClient.invalidateQueries({ queryKey });
  const save = useMutation({
    mutationFn: ({ id, data }: { id?: number; data: DoctorScheduleCreateParams }) => id === undefined
      ? doctorService.createSchedule(doctor.id, data)
      : doctorService.updateSchedule(doctor.id, id, data),
    onSuccess: async (_schedule, { id }) => {
      await refresh();
      setEditor(null);
      notify(id === undefined ? 'Đã thêm ca trực.' : 'Đã cập nhật ca trực.');
    },
    onError: (error) => setFormError(scheduleError(error, 'Không thể lưu ca trực. Vui lòng thử lại.')),
  });
  const remove = useMutation({
    mutationFn: (id: number) => doctorService.deleteSchedule(doctor.id, id),
    onSuccess: async () => {
      await refresh();
      notify('Đã xóa ca trực.');
    },
    onError: (error) => notify(scheduleError(error, 'Không thể xóa ca trực. Vui lòng thử lại.')),
  });

  const selectedShift = editor === 'new' ? null : editor;
  const busy = save.isPending || remove.isPending;

  function openEditor(shift: DoctorSchedule | 'new') {
    setFormError('');
    setEditor(shift);
  }

  function submitShift(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !editor) return;
    const fields = new FormData(event.currentTarget);
    const startTime = String(fields.get('startTime'));
    const endTime = String(fields.get('endTime'));
    const slotDurationMinutes = Number(fields.get('slotDurationMinutes'));
    const seconds = timeSeconds(endTime) - timeSeconds(startTime);
    if (seconds <= 0) {
      setFormError('Giờ kết thúc phải sau giờ bắt đầu.');
      return;
    }
    if (slotDurationMinutes * 60 > seconds) {
      setFormError('Thời lượng mỗi lượt khám không được vượt quá thời gian của ca trực.');
      return;
    }
    setFormError('');
    save.mutate({
      id: selectedShift?.id,
      data: { dayOfWeek: Number(fields.get('dayOfWeek')), startTime, endTime, slotDurationMinutes },
    });
  }

  async function deleteShift(shift: DoctorSchedule) {
    const accepted = await confirmAction(
      `Xóa ca trực ${DAYS[shift.dayOfWeek - 1]}, ${timeText(shift.startTime)}–${timeText(shift.endTime)} của ${doctor.fullName}?`,
    );
    if (accepted) remove.mutate(shift.id);
  }

  return (
    <section className="clinic-panel min-w-0 max-w-full overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 rounded-xl bg-[#e8eee2] p-3 text-[#285b47]"><CalendarClock size={20} aria-hidden="true" /></span>
          <div className="min-w-0">
            <h2 className="break-words font-medium">Lịch trực tuần của {doctor.fullName}</h2>
            <p className="mt-1 text-xs text-slate-500">
              {schedules.data && !schedules.isError ? `${schedules.data.length} ca trực · ` : ''}Lặp lại hằng tuần
            </p>
          </div>
        </div>
        <button type="button" className="btn-primary" disabled={busy} onClick={() => openEditor('new')}>
          <Plus size={16} aria-hidden="true" /> Thêm ca trực
        </button>
      </div>

      {schedules.isPending ? (
        <div className="space-y-3 p-6" role="status" aria-label="Đang tải ca trực">
          <Skeleton className="h-12" /><Skeleton className="h-12" />
        </div>
      ) : schedules.isError ? (
        <div className="p-5"><ErrorState title="Chưa thể tải ca trực" onRetry={() => void schedules.refetch()} /></div>
      ) : !schedules.data.length ? (
        <div className="p-5"><EmptyState title="Bác sĩ chưa có ca trực" description="Chọn Thêm ca trực để thiết lập giờ làm việc trong tuần." /></div>
      ) : (
        <div className="min-w-0 max-w-full overflow-x-auto">
          <table className="w-full text-left" aria-label={`Lịch trực tuần của ${doctor.fullName}`}>
            <thead><tr>
              <th scope="col" className="whitespace-nowrap px-5 py-4">Thứ</th>
              <th scope="col" className="whitespace-nowrap px-4 py-4">Giờ làm việc</th>
              <th scope="col" className="whitespace-nowrap px-4 py-4">Thời lượng mỗi lượt</th>
              <th scope="col" className="whitespace-nowrap px-4 py-4">Trạng thái</th>
              <th scope="col" className="whitespace-nowrap px-5 py-4 text-right">Thao tác</th>
            </tr></thead>
            <tbody>
              {schedules.data.map((shift) => (
                <tr key={shift.id} className="border-t border-slate-100">
                  <td className="whitespace-nowrap px-5 font-medium">{DAYS[shift.dayOfWeek - 1]}</td>
                  <td className="whitespace-nowrap px-4 tabular-nums">{timeText(shift.startTime)} – {timeText(shift.endTime)}</td>
                  <td className="whitespace-nowrap px-4 text-slate-600">{shift.slotDurationMinutes} phút</td>
                  <td className="whitespace-nowrap px-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${shift.active ? 'bg-[#e8eee2] text-[#285b47]' : 'bg-slate-100 text-slate-600'}`}>
                      {shift.active ? 'Đang áp dụng' : 'Ngừng áp dụng'}
                    </span>
                  </td>
                  <td className="px-5">
                    <div className="flex justify-end gap-2">
                      <button type="button" className="btn-secondary !px-3 !py-2" disabled={busy} onClick={() => openEditor(shift)}>
                        Sửa<span className="sr-only"> ca trực {DAYS[shift.dayOfWeek - 1]} lúc {timeText(shift.startTime)}</span>
                      </button>
                      <button type="button" className="btn-secondary !px-3 !py-2 !text-rose-700" disabled={busy} onClick={() => void deleteShift(shift)}>
                        Xóa<span className="sr-only"> ca trực {DAYS[shift.dayOfWeek - 1]} lúc {timeText(shift.startTime)}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={editor !== null}
        onClose={() => { if (!save.isPending) setEditor(null); }}
        title={selectedShift ? 'Sửa ca trực' : 'Thêm ca trực'}
        subtitle={`Lịch trực hằng tuần của ${doctor.fullName}`}
      >
        <form onSubmit={submitShift} className="space-y-4">
          <fieldset disabled={save.isPending} className="space-y-4">
            <div>
              <label htmlFor="shift-day" className="field-label">Thứ trong tuần</label>
              <select id="shift-day" name="dayOfWeek" className="field-input" defaultValue={selectedShift?.dayOfWeek ?? 1}>
                {DAYS.map((day, index) => <option key={day} value={index + 1}>{day}</option>)}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="shift-start" className="field-label">Giờ bắt đầu</label>
                <input id="shift-start" name="startTime" type="time" step="1" required className="field-input" defaultValue={selectedShift?.startTime ?? '08:00'} />
              </div>
              <div>
                <label htmlFor="shift-end" className="field-label">Giờ kết thúc</label>
                <input id="shift-end" name="endTime" type="time" step="1" required className="field-input" defaultValue={selectedShift?.endTime ?? '12:00'} />
              </div>
            </div>
            <div>
              <label htmlFor="shift-duration" className="field-label">Thời lượng mỗi lượt khám (phút)</label>
              <input id="shift-duration" name="slotDurationMinutes" type="number" min={5} required className="field-input" defaultValue={selectedShift?.slotDurationMinutes ?? 30} />
            </div>
          </fieldset>
          {formError && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{formError}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" disabled={save.isPending} onClick={() => setEditor(null)}>Hủy</button>
            <button type="submit" className="btn-primary" disabled={save.isPending}>{save.isPending ? 'Đang lưu…' : 'Lưu ca trực'}</button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

function ScheduleDashboard() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [doctorId, setDoctorId] = useState<number>();
  const doctors = useQuery({
    queryKey: ['doctors', 'schedule-picker', page, search],
    queryFn: () => doctorService.getAllDoctors({ page, size: PAGE_SIZE, search }),
  });
  const options = doctors.data?.items ?? doctors.data?.content ?? [];
  const doctor = options.find((option) => option.id === doctorId) ?? options[0];

  function searchDoctors(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(String(new FormData(event.currentTarget).get('search')).trim());
    setPage(1);
  }

  return (
    <div className="space-y-5 max-w-full overflow-x-clip">
      <div className="clinic-panel grid items-end gap-4 p-5 lg:grid-cols-2">
        <form onSubmit={searchDoctors} role="search" aria-label="Tìm bác sĩ">
          <label htmlFor="doctor-search" className="field-label">Tìm bác sĩ</label>
          <div className="flex gap-2">
            <input id="doctor-search" name="search" type="search" placeholder="Nhập tên hoặc chuyên khoa" className="field-input min-w-0" />
            <button type="submit" className="btn-secondary shrink-0">Tìm</button>
          </div>
        </form>
        <div>
          <label htmlFor="schedule-doctor" className="field-label">Bác sĩ</label>
          <select
            id="schedule-doctor"
            className="field-input"
            value={doctor?.id ?? ''}
            onChange={(event) => setDoctorId(Number(event.target.value))}
            disabled={doctors.isPending || doctors.isError || !doctor}
          >
            {!doctor && <option value="">{doctors.isPending ? 'Đang tải bác sĩ…' : 'Không có bác sĩ để chọn'}</option>}
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.fullName}{option.specialization ? ` — ${option.specialization}` : ''}
              </option>
            ))}
          </select>
        </div>
        {doctors.data && doctors.data.totalPages > 1 && (
          <div className="lg:col-span-2">
            <Pagination currentPage={page} totalPages={doctors.data.totalPages} totalElements={doctors.data.totalElements} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </div>
        )}
      </div>

      {doctors.isError ? <ErrorState title="Chưa thể tải danh sách bác sĩ" onRetry={() => void doctors.refetch()} />
        : doctors.isPending ? <div role="status" aria-label="Đang tải bác sĩ"><Skeleton className="h-40" /></div>
        : doctor ? <DoctorShifts key={doctor.id} doctor={doctor} />
        : <EmptyState title="Không tìm thấy bác sĩ" description={search ? 'Thử tìm bằng tên hoặc chuyên khoa khác.' : 'Cần có hồ sơ bác sĩ trước khi thiết lập ca trực.'} />}
    </div>
  );
}

export default function DoctorSchedulesPage() {
  return (
    <AppLayout title="Ca trực bác sĩ">
      <RoleGuard allowedRoles={['ROLE_ADMIN']} fallback={<ErrorState title="Bạn không có quyền truy cập" message="Trang này dành cho quản trị viên." />}>
        <ScheduleDashboard />
      </RoleGuard>
    </AppLayout>
  );
}
