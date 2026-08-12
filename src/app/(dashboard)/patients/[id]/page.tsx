'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { patientService } from '@/services/patientService';
import { medicalRecordService } from '@/services/medicalRecordService';
import { appointmentService } from '@/services/appointmentService';
import { Patient, MedicalRecord, Appointment } from '@/types/api';
import { Badge } from '@/components/ui/Badge';
import { Calendar, FileText, Pill, CreditCard, ArrowLeft, Loader2 } from 'lucide-react';

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = Number(params?.id);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'records' | 'appointments'>('records');

  const fetchData = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    try {
      const [patData, recordData, apptData] = await Promise.all([
        patientService.getPatientById(patientId),
        medicalRecordService.getMedicalRecordsByPatientId(patientId).catch(() => []),
        appointmentService.filterAppointments({ patientId, size: 50 }).catch(() => ({ items: [], content: [] })),
      ]);
      setPatient(patData);
      setMedicalRecords(recordData);
      setAppointments(apptData.items || apptData.content || []);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      setError(errorObj.response?.data?.message || errorObj.message || 'Failed to load patient details');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <AppLayout title={`Patient Profile ${patient ? `— ${patient.fullName}` : ''}`}>
      <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF']}>
        <div className="space-y-6">
          <Link
            href="/patients"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Patients List</span>
          </Link>

          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200/80">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
              <span className="text-xs text-slate-400 font-semibold">Loading profile...</span>
            </div>
          ) : error || !patient ? (
            <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-rose-700 text-xs font-semibold">
              {error || 'Patient not found'}
            </div>
          ) : (
            <>
              {/* Header Profile Card */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    {patient.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-extrabold text-slate-900">{patient.fullName}</h1>
                      <span className="bg-slate-100 text-slate-700 font-mono text-xs px-2.5 py-0.5 rounded-full font-semibold">
                        ID: #{patient.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                      <span>Registered: {patient.createdAt?.split('T')[0] || '-'}</span>
                      <span>•</span>
                      <span>
                        Gender: <strong className="text-slate-700">{patient.gender}</strong>
                      </span>
                    </p>
                  </div>
                </div>

                <Link
                  href="/appointments"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </Link>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Personal Information
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="text-slate-400">Citizen ID (CCCD)</p>
                      <p className="font-mono font-bold text-slate-900 mt-0.5">{patient.citizenId}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Date of Birth</p>
                      <p className="font-bold text-slate-900 mt-0.5">{patient.dob}</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Contact & Address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className="text-slate-400">Phone Number</p>
                      <p className="font-bold text-slate-900 mt-0.5">{patient.phone}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Email Address</p>
                      <p className="font-bold text-slate-900 mt-0.5">{patient.email}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Residential Address</p>
                      <p className="font-bold text-slate-900 mt-0.5">{patient.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* History Tabs */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="flex border-b border-slate-100 px-6 pt-4 gap-4 bg-slate-50/50">
                  <button
                    onClick={() => setActiveTab('records')}
                    className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                      activeTab === 'records'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Medical Records ({medicalRecords.length})</span>
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
                    <span>Appointments History ({appointments.length})</span>
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === 'records' && (
                    <div className="space-y-4">
                      {medicalRecords.length === 0 ? (
                        <p className="text-xs text-slate-400 font-medium">No medical records found for this patient.</p>
                      ) : (
                        medicalRecords.map((rec) => (
                          <div key={rec.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-900">Diagnosis: {rec.diagnosis}</span>
                              <span className="text-slate-400">Record #{rec.id} • {rec.createdAt?.split('T')[0]}</span>
                            </div>
                            <p className="text-slate-600">
                              <strong>Symptoms:</strong> {rec.symptoms}
                            </p>
                            {rec.notes && (
                              <p className="text-slate-600">
                                <strong>Doctor Notes:</strong> {rec.notes}
                              </p>
                            )}
                            {rec.doctorName && (
                              <p className="text-slate-500 text-[11px]">Attending Doctor: {rec.doctorName}</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'appointments' && (
                    <div className="space-y-3 text-xs">
                      {appointments.length === 0 ? (
                        <p className="text-xs text-slate-400 font-medium">No appointments recorded.</p>
                      ) : (
                        appointments.map((appt) => (
                          <div key={appt.id} className="p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                            <div>
                              <p className="font-bold text-slate-900">{appt.doctorName || `Doctor #${appt.doctorId}`}</p>
                              <p className="text-slate-500">{appt.appointmentDate} at {appt.timeSlot}</p>
                            </div>
                            <Badge variant={appt.status} />
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </RoleGuard>
    </AppLayout>
  );
}
