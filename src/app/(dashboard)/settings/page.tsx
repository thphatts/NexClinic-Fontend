'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/translations';
import { CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLanguage(selectedLang);
    setShowSavedAlert(true);
    setTimeout(() => {
      setShowSavedAlert(false);
    }, 3000);
  };

  return (
    <AppLayout title={t('settingsTitle')}>
      <div className="space-y-8 max-w-4xl">
        {/* Success Alert */}
        {showSavedAlert && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{t('settingsSavedSuccess')}</span>
          </div>
        )}

        {/* Language Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Language Selection Card */}
          <div className="clinic-panel bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">

              <div>
                <h3 className="text-base font-bold text-slate-900">{t('languagePreference')}</h3>
                <p className="text-xs text-slate-500">{t('selectLanguage')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tiếng Việt Option */}
              <label
                onClick={() => setSelectedLang('vi')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedLang === 'vi'
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 font-extrabold text-xs flex items-center justify-center">
                    🇻🇳
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{t('vietnamese')}</p>
                    <p className="text-[11px] text-slate-500">Tiếng Việt cho toàn bộ hệ thống</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="language"
                  value="vi"
                  checked={selectedLang === 'vi'}
                  onChange={() => setSelectedLang('vi')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
              </label>

              {/* English Option */}
              <label
                onClick={() => setSelectedLang('en')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedLang === 'en'
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 font-extrabold text-xs flex items-center justify-center">
                    🇺🇸
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{t('english')}</p>
                    <p className="text-[11px] text-slate-500">Tiếng Anh cho các nội dung hỗ trợ</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="language"
                  value="en"
                  checked={selectedLang === 'en'}
                  onChange={() => setSelectedLang('en')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          <div className="clinic-panel p-6"><h2 className="text-sm font-medium">Múi giờ phòng khám</h2><p className="mt-3 text-sm text-slate-500">Giờ Việt Nam · GMT+7</p><p className="mt-2 text-xs leading-6 text-slate-400">Ngày và giờ đặt lịch được tính theo múi giờ của phòng khám.</p></div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-md flex items-center gap-2"
            >

              <span>{t('saveSettings')}</span>
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
