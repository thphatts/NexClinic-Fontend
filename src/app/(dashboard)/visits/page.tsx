'use client';

import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { visitService } from '@/services/visitService';
import { conceptService } from '@/services/conceptService';
import { ConceptFields } from '@/components/medical-records/ConceptFields';
import { serializeObservations, ConceptFormValues } from '@/lib/observations';
import { EncounterType } from '@/types/api';
import { Modal } from '@/components/ui/Modal';
import { useFeedback } from '@/providers/FeedbackProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

const encounterLabels: Record<string, string> = {
  VITALS: 'Sinh hiệu',
  CONSULTATION: 'Khám lâm sàng',
  LAB_RESULT: 'Kết quả xét nghiệm',
  DISCHARGE: 'Kết thúc khám',
};

export default function VisitsPage() {
  const queryClient = useQueryClient();
  const { notify } = useFeedback();
  const { user } = useAuthStore();
  const [selectedVisit, setSelectedVisit] = useState<number | null>(null);
  const [encounterType, setEncounterType] = useState<EncounterType>('VITALS');
  const [formValues, setFormValues] = useState<ConceptFormValues>({});
  const [saving, setSaving] = useState(false);
  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['visits', 'active'],
    queryFn: visitService.getActiveVisits,
  });
  const dictionary = useQuery({
    queryKey: ['concepts', 'dictionary', 'ALL'],
    queryFn: () => conceptService.getDictionary(),
    enabled: selectedVisit !== null,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  const openEncounter = (visitId: number, type: EncounterType) => {
    setSelectedVisit(visitId);
    setEncounterType(type);
    setFormValues({});
  };

  const saveEncounter = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedVisit === null || !dictionary.data) return;
    setSaving(true);
    try {
      const observations = serializeObservations(formValues, dictionary.data);
      await visitService.createEncounter(selectedVisit, encounterType, observations);
      await queryClient.invalidateQueries({ queryKey: ['visits', 'active'] });
      setSelectedVisit(null);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      notify(err.response?.data?.message || err.message || 'Không lưu được phiên khám.');
    } finally {
      setSaving(false);
    }
  };

  const closeVisit = async (visitId: number) => {
    try {
      await visitService.closeVisit(visitId);
      await queryClient.invalidateQueries({ queryKey: ['visits', 'active'] });
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      notify(err.response?.data?.message || err.message || 'Không thể kết thúc lượt khám.');
    }
  };

  return <AppLayout title="Đang khám">
    <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_RECEPTIONIST', 'ROLE_NURSE', 'ROLE_STAFF']}>
      <section className="clinic-panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div><h2 className="text-sm font-semibold">Lượt khám đang mở</h2><p className="mt-1 text-xs text-slate-500">{data.length} bệnh nhân đang chờ hoặc được khám</p></div>
          <button type="button" onClick={() => void refetch()} className="btn-secondary">Làm mới</button>
        </div>
        {isLoading ? <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-teal-700" /></div>
          : isError ? <div className="p-8 text-center text-sm text-rose-700">Không tải được hàng đợi lượt khám. <button onClick={() => void refetch()} className="underline">Thử lại</button></div>
          : data.length === 0 ? <p className="p-12 text-center text-sm text-slate-500">Hiện chưa có lượt khám đang mở.</p>
          : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-5 py-3">Mã lượt</th><th className="px-5 py-3">Bệnh nhân</th><th className="px-5 py-3">Bắt đầu</th><th className="px-5 py-3">Tiến trình</th><th className="px-5 py-3">Thao tác</th></tr></thead><tbody>{data.map((visit) => <tr key={visit.visitId} className="border-t border-slate-100"><td className="px-5 py-4 font-medium">#{visit.visitId}</td><td className="px-5 py-4">{visit.patientName}<span className="ml-2 text-xs text-slate-400">#{visit.patientId}</span></td><td className="px-5 py-4 text-slate-600">{new Date(visit.startTime).toLocaleString('vi-VN')}</td><td className="px-5 py-4"><div className="flex flex-wrap gap-2">{visit.encounters.length ? visit.encounters.map((encounter, index) => <span key={`${encounter}-${index}`} className="rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-800">{encounterLabels[encounter] || encounter}</span>) : <span className="text-xs text-slate-400">Chưa có phiên khám</span>}</div></td><td className="space-x-2 whitespace-nowrap px-5 py-4">{(user?.role === 'ROLE_NURSE' || user?.role === 'ROLE_DOCTOR') && !visit.encounters.includes('VITALS') && <button onClick={() => openEncounter(visit.visitId, 'VITALS')} className="btn-secondary">Sinh hiệu</button>}{user?.role === 'ROLE_DOCTOR' && !visit.encounters.includes('CONSULTATION') && <button onClick={() => openEncounter(visit.visitId, 'CONSULTATION')} className="btn-primary">Khám</button>}{user?.role !== 'ROLE_PATIENT' && visit.encounters.includes('CONSULTATION') && <button onClick={() => void closeVisit(visit.visitId)} className="btn-secondary">Kết thúc</button>}</td></tr>)}</tbody></table></div>}
      </section>
    </RoleGuard>
    <Modal isOpen={selectedVisit !== null} onClose={() => { if (!saving) setSelectedVisit(null); }} title={encounterType === 'VITALS' ? 'Ghi nhận sinh hiệu' : 'Khám lâm sàng'} subtitle="Nhập dữ liệu theo danh mục lâm sàng hiện hành.">
      {dictionary.isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-5 w-5 animate-spin" /></div> : dictionary.isError ? <p role="alert" className="text-sm text-rose-700">Không tải được danh mục Concept. <button onClick={() => void dictionary.refetch()} className="underline">Thử lại</button></p> : <form onSubmit={(event) => void saveEncounter(event)} className="space-y-5">
        {dictionary.data && <ConceptFields concepts={dictionary.data} values={formValues} onChange={(id, value) => setFormValues((current) => ({ ...current, [id]: value }))} />}
        <div className="flex justify-end gap-2"><button type="button" disabled={saving} onClick={() => setSelectedVisit(null)} className="btn-secondary">Hủy</button><button disabled={saving} className="btn-primary">{saving ? 'Đang lưu…' : 'Lưu phiên khám'}</button></div>
      </form>}
    </Modal>
  </AppLayout>;
}
