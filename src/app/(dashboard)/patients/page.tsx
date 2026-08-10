'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Modal } from '@/components/ui/Modal';
import { useLanguage } from '@/context/LanguageContext';
import { Search, Plus, Eye, Edit2, Phone, Mail } from 'lucide-react';
import { Patient } from '@/types/api';

export default function PatientsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [patients] = useState<Patient[]>([
    {
      id: 1,
      fullName: 'Nguyen Van An',
      citizenId: '001095012345',
      phone: '0901234567',
      email: 'van.an@gmail.com',
      dob: '1995-04-12',
      gender: 'MALE',
      address: '123 Le Loi, Dist 1, HCMC',
      createdAt: '2026-01-15',
    },
    {
      id: 2,
      fullName: 'Tran Thi Binh',
      citizenId: '001198054321',
      phone: '0912345678',
      email: 'thi.binh@gmail.com',
      dob: '1998-08-25',
      gender: 'FEMALE',
      address: '456 Tran Hung Dao, Dist 5, HCMC',
      createdAt: '2026-02-01',
    },
    {
      id: 3,
      fullName: 'Le Van Cuong',
      citizenId: '001088099887',
      phone: '0987654321',
      email: 'cuong.le@yahoo.com',
      dob: '1988-11-30',
      gender: 'MALE',
      address: '789 Nguyen Hue, Dist 1, HCMC',
      createdAt: '2026-02-10',
    },
    {
      id: 4,
      fullName: 'Pham Minh Dung',
      citizenId: '001201011223',
      phone: '0978123456',
      email: 'dung.pham@outlook.com',
      dob: '2001-02-14',
      gender: 'MALE',
      address: '12 Hoang Hoa Tham, Binh Thanh, HCMC',
      createdAt: '2026-03-05',
    },
  ]);

  const filteredPatients = patients.filter(
    (p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.citizenId.includes(search)
  );

  return (
    <AppLayout title={t('patientsTitle')}>
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPatientsPlaceholder')}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 border-none text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addNewPatient')}</span>
          </button>
        </div>

        {/* Patient Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                <tr>
                  <th className="px-6 py-4">{t('patientName')}</th>
                  <th className="px-6 py-4">{t('citizenId')}</th>
                  <th className="px-6 py-4">{t('contact')}</th>
                  <th className="px-6 py-4">{t('dobGender')}</th>
                  <th className="px-6 py-4">{t('registeredDate')}</th>
                  <th className="px-6 py-4 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">
                          {patient.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{patient.fullName}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{patient.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-slate-800 bg-slate-100 px-2 py-1 rounded-md text-[11px]">
                        {patient.citizenId}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-y-0.5">
                      <p className="flex items-center gap-1.5 text-slate-800">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{patient.phone}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{patient.email}</span>
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900">{patient.dob}</p>
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        {patient.gender === 'MALE' ? t('male') : t('female')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{patient.createdAt}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/patients/${patient.id}`}
                        className="p-2 inline-flex rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                        title={t('viewDetails')}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="p-2 inline-flex rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition"
                        title={t('edit')}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Patient Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('registerPatientTitle')}
        subtitle={t('registerPatientSubtitle')}
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
              placeholder="e.g. Nguyen Van An"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('citizenId')}</label>
              <input
                required
                type="text"
                placeholder="12 digit CCCD"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('phone')}</label>
              <input
                required
                type="tel"
                placeholder="0901234567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('dob')}</label>
              <input
                required
                type="date"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('gender')}</label>
              <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white">
                <option value="MALE">{t('male')}</option>
                <option value="FEMALE">{t('female')}</option>
                <option value="OTHER">{t('other')}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('email')}</label>
            <input
              type="email"
              placeholder="patient@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">{t('address')}</label>
            <input
              type="text"
              placeholder="Full home address..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
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
