'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { appointmentService } from '@/services/appointmentService';
import { patientService } from '@/services/patientService';
import { doctorService } from '@/services/doctorService';
import { useAuthStore } from '@/store/useAuthStore';
import { navigation } from '@/lib/navigation';
import { clinicDate, displayDate } from '@/lib/clinic-date';
import type { Appointment } from '@/types/api';

export default function DashboardPage() {
  const { user, hasRole } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [total, setTotal] = useState(0);
  const [doctors, setDoctors] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const isPatient = user?.role === 'ROLE_PATIENT';
  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true); setError(false);
      try {
        const profile = isPatient ? await patientService.getMyPatientProfile() : null;
        const [result, doctorResult] = await Promise.all([
          appointmentService.filterAppointments({ fromDate: clinicDate(), toDate: clinicDate(), patientId: profile?.id, page: 1, size: 6 }),
          doctorService.getAllDoctors({ page: 1, size: 1 }).catch(() => null),
        ]);
        if (active) { setAppointments(result.items || result.content || []); setTotal(result.totalElements); setDoctors(doctorResult?.totalElements ?? null); }
      } catch { if (active) setError(true); }
      finally { if (active) setLoading(false); }
    }
    void load();
    return () => { active = false; };
  }, [isPatient, refresh]);
  const shortcuts = navigation.filter((item) => ['/appointments', '/doctors', '/medical-records', '/chat', '/patients', '/payments'].includes(item.href) && (!item.roles || hasRole(item.roles))).slice(0, 4);
  return <AppLayout title="Tổng quan">
    <div className="space-y-8 dashboard-overview">
      <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">{displayDate(clinicDate())}</p><h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">Xin chào, {user?.name || user?.username || 'bạn'}.</h1><p className="mt-3 text-sm text-slate-500">Hôm nay, dành một chút quan tâm cho sức khỏe.</p></div><Link href="/appointments?book=1" className="btn-primary">Đặt lịch khám</Link></div>
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl bg-[#e8eee2] p-7 sm:p-9"><p className="eyebrow">CHĂM SÓC CHỦ ĐỘNG</p><h2 className="display-heading relative z-10 mt-5 max-w-md text-4xl">Mọi hành trình tốt<br />bắt đầu từ sự quan tâm.</h2><p className="relative z-10 mt-5 max-w-sm text-sm leading-7 text-[#6d7d66]">Chọn bác sĩ phù hợp và một thời gian dành riêng cho bạn.</p><Link href="/doctors" className="btn-secondary relative z-10 mt-7 !bg-white/70">Khám phá đội ngũ bác sĩ →</Link><div aria-hidden="true" className="auth-orbit !h-64 !w-64 !-bottom-24" /></div>
        <div className="clinic-panel flex flex-col justify-between p-7"><p className="eyebrow">NHỊP CHĂM SÓC HÔM NAY</p>{loading ? <Skeleton className="my-7 h-20" /> : error ? <p className="my-7 text-sm text-slate-500">Chưa tải được thông tin lịch khám.</p> : <div className="my-7"><p className="text-6xl font-light tracking-tighter text-[#285b47]">{total}<span className="ml-3 text-sm font-normal tracking-normal text-slate-500">lịch hẹn hôm nay</span></p></div>}<div className="flex justify-between border-t border-slate-100 pt-5 text-xs"><span className="text-slate-500">Bác sĩ trong hệ thống</span><span className="font-medium">{loading ? '…' : doctors ?? 'Chưa tải được'}</span></div></div>
      </div>
      <section><div className="mb-4 flex items-center justify-between"><h2 className="text-base font-medium">Bạn muốn làm gì hôm nay?</h2><span className="text-xs text-slate-400">Truy cập nhanh</span></div><div className="stagger-children grid grid-cols-2 gap-3 lg:grid-cols-4">{shortcuts.map((item, index) => <Link href={item.href} key={item.href} className="clinic-panel interactive-lift p-5"><p className="text-xs text-[#95a28b]">0{index + 1}</p><p className="mb-2 mt-6 text-sm font-medium">{item.label}</p><p className="text-xs leading-6 text-slate-500">{item.description}</p></Link>)}</div></section>
      <section className="clinic-panel overflow-hidden"><div className="flex items-center justify-between border-b border-slate-100 p-6"><div><h2 className="text-base font-medium">Lịch khám hôm nay</h2><p className="mt-1 text-xs text-slate-500">{isPatient ? 'Các cuộc hẹn của bạn' : 'Những cuộc hẹn trong ngày'}</p></div><Link href="/appointments" className="text-xs text-teal-800">Xem tất cả →</Link></div>
        {loading ? <div className="space-y-3 p-6"><Skeleton className="h-14" /><Skeleton className="h-14" /><Skeleton className="h-14" /></div> : error ? <ErrorState onRetry={() => setRefresh(refresh + 1)} /> : !appointments.length ? <div className="px-6 py-14 text-center"><p className="text-sm font-medium">Hôm nay chưa có lịch hẹn</p><p className="mt-2 text-xs text-slate-500">Một khoảng trống để chủ động sắp xếp ngày của bạn.</p><Link href="/appointments?book=1" className="btn-secondary mt-5">Đặt lịch mới</Link></div> : <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr><th className="px-6 py-4">Giờ khám</th><th className="px-6 py-4">Bệnh nhân</th><th className="px-6 py-4">Bác sĩ</th><th className="px-6 py-4">Trạng thái</th></tr></thead><tbody>{appointments.map((item) => <tr key={item.id} className="border-t border-slate-100"><td className="whitespace-nowrap px-6 font-medium">{item.timeSlot}</td><td className="px-6">{item.patientName || `Bệnh nhân #${item.patientId}`}</td><td className="px-6">{item.doctorName || `Bác sĩ #${item.doctorId}`}</td><td className="px-6"><Badge variant={item.status} /></td></tr>)}</tbody></table></div>}
      </section>
      <Link href="/ai" className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#dce6d6] bg-[#eff3eb] p-6"><div><p className="text-sm font-medium text-[#3e6148]">Có câu hỏi trước buổi khám?</p><p className="mt-2 text-xs text-slate-500">NexAI hỗ trợ tìm hiểu triệu chứng và chuẩn bị thông tin.</p></div><span className="text-xs font-medium text-teal-800">Trò chuyện với NexAI →</span></Link>
    </div>
  </AppLayout>;
}
