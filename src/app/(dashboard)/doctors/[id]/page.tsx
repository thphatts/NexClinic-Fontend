'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/format';
import { UserCheck, Award, Calendar, Clock, ArrowLeft, Plus } from 'lucide-react';
import { DoctorSchedule } from '@/types/api';

export default function DoctorDetailPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'appointments'>('schedule');

  const doctor = {
    id: 1,
    fullName: 'Dr. Nguyen Minh Tuan',
    specialization: 'Cardiology',
    degree: 'MD, PhD',
    phone: '0903112233',
    email: 'tuan.nguyen@nexclinic.com',
    experienceYears: 12,
    consultationFee: 300000,
  };

  const [schedules] = useState<DoctorSchedule[]>([
    { id: 1, doctorId: 1, dayOfWeek: 1, startTime: '08:00', endTime: '12:00', slotDurationMinutes: 30, active: true },
    { id: 2, doctorId: 1, dayOfWeek: 1, startTime: '13:30', endTime: '17:00', slotDurationMinutes: 30, active: true },
    { id: 3, doctorId: 1, dayOfWeek: 2, startTime: '08:00', endTime: '12:00', slotDurationMinutes: 30, active: true },
    { id: 4, doctorId: 1, dayOfWeek: 3, startTime: '08:00', endTime: '12:00', slotDurationMinutes: 30, active: true },
    { id: 5, doctorId: 1, dayOfWeek: 4, startTime: '08:00', endTime: '12:00', slotDurationMinutes: 30, active: true },
    { id: 6, doctorId: 1, dayOfWeek: 5, startTime: '08:00', endTime: '12:00', slotDurationMinutes: 30, active: true },
  ]);

  const daysOfWeek = [
    { num: 1, label: 'Monday' },
    { num: 2, label: 'Tuesday' },
    { num: 3, label: 'Wednesday' },
    { num: 4, label: 'Thursday' },
    { num: 5, label: 'Friday' },
    { num: 6, label: 'Saturday' },
    { num: 7, label: 'Sunday' },
  ];

  return (
    <AppLayout title={`Doctor Profile — ${doctor.fullName}`}>
      <div className="space-y-6">
        {/* Back Link */}
        <Link
          href="/doctors"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Doctors Directory</span>
        </Link>

        {/* Doctor Profile Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              {doctor.fullName.charAt(4)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-slate-900">{doctor.fullName}</h1>
                <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {doctor.specialization}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {doctor.degree} • <strong className="text-slate-700">{doctor.experienceYears} Years Experience</strong>
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Consultation Rate</p>
            <p className="text-xl font-extrabold text-blue-600">{formatCurrency(doctor.consultationFee)}</p>
          </div>
        </div>

        {/* Doctor Tabs Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="flex border-b border-slate-100 px-6 pt-4 gap-4 bg-slate-50/50">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                activeTab === 'schedule'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Weekly Work Schedule</span>
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Professional Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                activeTab === 'appointments'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Assigned Appointments</span>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Doctor Duty Hours & Slot Duration</h3>
                    <p className="text-xs text-slate-500">Configured time slots: 30 minutes duration per consultation</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition flex items-center gap-1.5 shadow-sm">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Shift Slot</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {daysOfWeek.map((day) => {
                    const daySchedules = schedules.filter((s) => s.dayOfWeek === day.num);

                    return (
                      <div
                        key={day.num}
                        className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3"
                      >
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                          <span className="font-bold text-xs text-slate-900">{day.label}</span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {daySchedules.length > 0 ? 'Active' : 'Off'}
                          </span>
                        </div>

                        {daySchedules.length > 0 ? (
                          <div className="space-y-2 text-xs">
                            {daySchedules.map((s) => (
                              <div
                                key={s.id}
                                className="bg-white p-2.5 rounded-xl border border-slate-200/80 font-medium text-slate-700 flex justify-between items-center"
                              >
                                <span>{s.startTime} — {s.endTime}</span>
                                <span className="text-[10px] text-blue-600 font-bold">{s.slotDurationMinutes}m</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 italic py-2">No shift scheduled</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-slate-400 mb-1">Direct Phone</p>
                    <p className="font-bold text-slate-900">{doctor.phone}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-slate-400 mb-1">Email Address</p>
                    <p className="font-bold text-slate-900">{doctor.email}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900">Nguyen Van An (General Checkup)</p>
                    <p className="text-slate-500">2026-02-10 at 09:00 AM</p>
                  </div>
                  <Badge variant="CONFIRMED" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
