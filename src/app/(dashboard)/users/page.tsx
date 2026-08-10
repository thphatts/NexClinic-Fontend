'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useLanguage } from '@/context/LanguageContext';
import { Search, Plus } from 'lucide-react';
import { User as UserModel } from '@/types/api';

export default function UsersPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [users] = useState<UserModel[]>([
    {
      id: 'usr-1',
      name: 'System Admin',
      username: 'admin',
      email: 'admin@nexclinic.com',
      phoneNumber: '0901111111',
      citizenId: '001090001111',
      role: 'ROLE_ADMIN',
    },
    {
      id: 'usr-2',
      name: 'Dr. Nguyen Minh Tuan',
      username: 'dr.tuan',
      email: 'tuan.nguyen@nexclinic.com',
      phoneNumber: '0903112233',
      citizenId: '001085002222',
      role: 'ROLE_DOCTOR',
    },
    {
      id: 'usr-3',
      name: 'Le Thi Staff',
      username: 'reception.lan',
      email: 'reception@nexclinic.com',
      phoneNumber: '0905556677',
      citizenId: '001092003333',
      role: 'ROLE_STAFF',
    },
    {
      id: 'usr-4',
      name: 'Nguyen Van An',
      username: 'patient.an',
      email: 'van.an@gmail.com',
      phoneNumber: '0901234567',
      citizenId: '001095012345',
      role: 'ROLE_PATIENT',
    },
  ]);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout title={t('usersTitle')}>
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchUsersPlaceholder')}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 border-none text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('createUser')}</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                <tr>
                  <th className="px-6 py-4">{t('user')}</th>
                  <th className="px-6 py-4">{t('username')}</th>
                  <th className="px-6 py-4">{t('contactEmailPhone')}</th>
                  <th className="px-6 py-4">{t('citizenId')}</th>
                  <th className="px-6 py-4">{t('assignedRole')}</th>
                  <th className="px-6 py-4 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center">
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">@{u.username}</td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900 font-medium">{u.email}</p>
                      <p className="text-[11px] text-slate-400">{u.phoneNumber || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-600">{u.citizenId || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <Badge variant={u.role} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => alert(`Edit user: ${u.username}`)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px] hover:bg-blue-600 hover:text-white transition"
                      >
                        {t('edit')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create User Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('createUser')}
        subtitle="Provision account credentials and role authorization."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('User account created successfully!');
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
              <label className="block font-semibold text-slate-700 mb-1">{t('username')}</label>
              <input
                required
                type="text"
                placeholder="e.g. dr.tuan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t('assignedRole')}</label>
              <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white">
                <option value="ROLE_ADMIN">ROLE_ADMIN (Full Management)</option>
                <option value="ROLE_DOCTOR">ROLE_DOCTOR (Physician)</option>
                <option value="ROLE_STAFF">ROLE_STAFF (Receptionist)</option>
                <option value="ROLE_PATIENT">ROLE_PATIENT (Patient Portal)</option>
              </select>
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
