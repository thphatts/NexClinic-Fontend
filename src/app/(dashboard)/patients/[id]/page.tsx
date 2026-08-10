'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/Badge';
import { User, Phone, Mail, MapPin, Shield, Calendar, FileText, Pill, CreditCard, ArrowLeft } from 'lucide-react';

export default function PatientDetailPage() {
  const [activeTab, setActiveTab] = useState<'appointments' | 'records' | 'prescriptions' | 'payments'>('records');

  // Mock Patient details matching spec
  const patient = {
    id: 1,
    fullName: 'Nguyen Van An',
    citizenId: '001095012345',
    phone: '0901234567',
    email: 'van.an@gmail.com',
    dob: '1995-04-12',
    gender: 'MALE',
    address: '123 Le Loi, District 1, Ho Chi Minh City',
    createdAt: '2026-01-15',
  };

  return (
    <AppLayout title={`Patient Profile — ${patient.fullName}`}>
      <div className="space-y-6">
        {/* Back Link */}
        <Link
          href="/patients"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Patients List</span>
        </Link>

        {/* Patient Profile Card Header */}
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
                <span>Registered: {patient.createdAt}</span>
                <span>•</span>
                <span>Gender: <strong className="text-slate-700">{patient.gender}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/appointments"
              className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>
          </div>
        </div>

        {/* Personal & Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Personal Information</h3>
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
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Contact & Address</h3>
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

        {/* Clinic History Section Tabs */}
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
              <span>Medical Records</span>
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
              <span>Appointments History</span>
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                activeTab === 'prescriptions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Pill className="w-4 h-4" />
              <span>Prescriptions</span>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
                activeTab === 'payments'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Payments</span>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'records' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">Diagnosis: Chronic Bronchitis</span>
                    <span className="text-slate-400">Visit Date: 2026-02-10</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Symptoms:</strong> Persistent cough for 2 weeks, afternoon fever.
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Doctor Notes:</strong> Advised Chest X-Ray and CBC test. Prescribed Paracetamol and Cough Syrup.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900">Dr. Nguyen Minh Tuan (Cardiology)</p>
                    <p className="text-slate-500">2026-02-10 at 09:00 AM</p>
                  </div>
                  <Badge variant="COMPLETED" />
                </div>
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div className="p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <p className="font-bold text-slate-900">Prescription #RX-001</p>
                <p className="text-slate-600">Paracetamol 500mg (10 tabs) • 2 tabs/day after meals</p>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="p-3.5 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-900">Appointment Consultation #101</p>
                  <p className="text-slate-400">Method: VNPay Online</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-slate-900">₫300,000</p>
                  <Badge variant="SUCCESS" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
