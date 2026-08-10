'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Modal } from '@/components/ui/Modal';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency } from '@/lib/format';
import { Search, Plus, Phone, Award, Eye } from 'lucide-react';
import { Doctor } from '@/types/api';

export default function DoctorsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [doctors] = useState<Doctor[]>([
    {
      id: 1,
      fullName: 'Dr. Nguyen Minh Tuan',
      specialization: 'Cardiology',
      degree: 'MD, PhD',
      phone: '0903112233',
      email: 'tuan.nguyen@nexclinic.com',
      experienceYears: 12,
      consultationFee: 300000,
    },
    {
      id: 2,
      fullName: 'Dr. Le Thi Lan',
      specialization: 'Dermatology',
      degree: 'MSc, MD',
      phone: '0904445566',
      email: 'lan.le@nexclinic.com',
      experienceYears: 8,
      consultationFee: 250000,
    },
    {
      id: 3,
      fullName: 'Dr. Pham Hoang Nam',
      specialization: 'Neurology',
      degree: 'MD',
      phone: '0907778899',
      email: 'nam.pham@nexclinic.com',
      experienceYears: 15,
      consultationFee: 400000,
    },
    {
      id: 4,
      fullName: 'Dr. Tran Van Duc',
      specialization: 'Pediatrics',
      degree: 'MD, Specialist II',
      phone: '0901112244',
      email: 'duc.tran@nexclinic.com',
      experienceYears: 10,
      consultationFee: 280000,
    },
  ]);

  const filteredDoctors = doctors.filter(
    (d) =>
      d.fullName.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout title={t('doctorsTitle')}>
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchDoctorsPlaceholder')}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 border-none text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addNewDoctor')}</span>
          </button>
        </div>

        {/* Doctor Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-blue-500/20">
                  {doc.fullName.charAt(4) || 'D'}
                </div>

                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                    {doc.specialization}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{doc.fullName}</h3>
                  <p className="text-xs text-slate-500">{doc.degree}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <p className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doc.experienceYears} {t('experienceYears')}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doc.phone}</span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400">{t('consultationFee')}</p>
                  <p className="text-sm font-extrabold text-slate-900">{formatCurrency(doc.consultationFee)}</p>
                </div>

                <Link
                  href={`/doctors/${doc.id}`}
                  className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-blue-600 hover:text-white transition flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t('viewDetails')}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Doctor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('addNewDoctor')}
        subtitle="Enter professional details to add doctor to clinic system."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Saved successfully!');
            setIsModalOpen(false);
          }}
          className="space-y-4 text-xs"
        >
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('fullName')}</label>
            <input
              required
              type="text"
              placeholder="e.g. Dr. Nguyen Minh Tuan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('specialization')}</label>
              <input
                required
                type="text"
                placeholder="e.g. Cardiology"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('degree')}</label>
              <input
                required
                type="text"
                placeholder="e.g. MD, PhD"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
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
