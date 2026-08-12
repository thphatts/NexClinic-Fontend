'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/Badge';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useLanguage } from '@/context/LanguageContext';
import { patientService } from '@/services/patientService';
import { doctorService } from '@/services/doctorService';
import { appointmentService } from '@/services/appointmentService';
import { Appointment } from '@/types/api';
import {
  Users,
  Calendar,
  Stethoscope,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Heart,
  Brain,
  Baby,
  Loader2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const { t } = useLanguage();

  const [totalPatientsCount, setTotalPatientsCount] = useState<number>(0);
  const [totalDoctorsCount, setTotalDoctorsCount] = useState<number>(0);
  const [todayAppointmentsCount, setTodayAppointmentsCount] = useState<number>(0);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardMetrics() {
      setLoading(true);
      try {
        const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
          patientService.getAllPatients({ page: 1, size: 1 }).catch(() => ({ totalElements: 0 })),
          doctorService.getAllDoctors({ page: 1, size: 1 }).catch(() => ({ totalElements: 0 })),
          appointmentService.filterAppointments({ page: 1, size: 10 }).catch(() => ({ totalElements: 0, items: [], content: [] })),
        ]);
        setTotalPatientsCount(patientsRes.totalElements || 0);
        setTotalDoctorsCount(doctorsRes.totalElements || 0);
        setTodayAppointmentsCount(appointmentsRes.totalElements || 0);
        setRecentAppointments(appointmentsRes.items || appointmentsRes.content || []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadDashboardMetrics();
  }, []);

  const chartData = [
    { name: 'Mon', appointments: 24, emergency: 4 },
    { name: 'Tue', appointments: 32, emergency: 6 },
    { name: 'Wed', appointments: 28, emergency: 3 },
    { name: 'Thu', appointments: 40, emergency: 8 },
    { name: 'Fri', appointments: 45, emergency: 10 },
    { name: 'Sat', appointments: 20, emergency: 2 },
    { name: 'Sun', appointments: 15, emergency: 1 },
  ];

  return (
    <AppLayout title={t('dashboardTitle')}>
      <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF', 'ROLE_PATIENT']}>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t('goodMorning')}</h2>
            <p className="text-sm text-slate-500">{t('overviewSubtitle')}</p>
          </div>

          {/* Core Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Patients */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-sm font-semibold text-slate-600">{t('totalPatients')}</span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">
                  {loading ? '...' : totalPatientsCount}
                </span>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                  <TrendingUp className="w-3 h-3" /> Live
                </span>
              </div>
            </div>

            {/* Card 2: Today Appointments */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-sm font-semibold text-slate-600">{t('todayAppointments')}</span>
                <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">
                  {loading ? '...' : todayAppointmentsCount}
                </span>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold">
                  <TrendingUp className="w-3 h-3" /> System
                </span>
              </div>
            </div>

            {/* Card 3: Active Doctors */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-sm font-semibold text-slate-600">{t('activeDoctors')}</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-900">
                  {loading ? '...' : totalDoctorsCount}
                </span>
                <span className="text-sm font-semibold text-slate-400">Physicians</span>
              </div>
            </div>

            {/* Card 4: Action Requests */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-sm font-semibold text-slate-600">Pending Actions</span>
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">Active</span>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                  AI Ready
                </span>
              </div>
            </div>
          </div>

          {/* Charts & Department Load Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-900">{t('appointmentOverview')}</h3>
                <span className="text-xs font-bold text-slate-500">Weekly Trends</span>
              </div>

              <div className="h-[280px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        fontSize: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="appointments"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="emergency"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Load */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-6 flex flex-col justify-between">
              <h3 className="text-base font-bold text-slate-900">{t('departmentLoad')}</h3>

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-900">Cardiology</span>
                      <span className="text-slate-500">45%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-900">Neurology</span>
                      <span className="text-slate-500">30%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Baby className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-900">Pediatrics</span>
                      <span className="text-slate-500">25%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                Real-time clinic bandwidth allocation
              </div>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">{t('todaysSchedule')}</h3>
                <p className="text-xs text-slate-500">{t('upcomingCheckups')}</p>
              </div>
              <Link
                href="/appointments"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
              >
                <span>{t('viewAll')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-12 flex justify-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : recentAppointments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">No recent appointments.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4">{t('patientName')}</th>
                      <th className="px-6 py-4">{t('doctors')}</th>
                      <th className="px-6 py-4">Reason</th>
                      <th className="px-6 py-4 text-right">{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {recentAppointments.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {row.appointmentDate} ({row.timeSlot})
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {row.patientName || `Patient #${row.patientId}`}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{row.doctorName || `Doctor #${row.doctorId}`}</td>
                        <td className="px-6 py-4 text-slate-600 truncate max-w-xs">{row.reason || '-'}</td>
                        <td className="px-6 py-4 text-right">
                          <Badge variant={row.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </RoleGuard>
    </AppLayout>
  );
}
