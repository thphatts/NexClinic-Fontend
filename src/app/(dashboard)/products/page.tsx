'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency } from '@/lib/format';
import { Search, Pill, Filter } from 'lucide-react';
import { Product } from '@/types/api';

export default function ProductsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [products] = useState<Product[]>([
    { id: 10, name: 'Paracetamol 500mg (Panadol Extra)', price: 3000, status: 'AVAILABLE', categoryName: 'Analgesic / Antipyretic' },
    { id: 11, name: 'Ibuprofen 400mg', price: 5000, status: 'AVAILABLE', categoryName: 'NSAID / Painkiller' },
    { id: 12, name: 'Amoxicillin 500mg (Antibiotic)', price: 9000, status: 'AVAILABLE', categoryName: 'Antibiotics' },
    { id: 13, name: 'Cetirizine 10mg (Zyrtec)', price: 4500, status: 'AVAILABLE', categoryName: 'Antihistamines' },
    { id: 14, name: 'Omeprazole 20mg', price: 7000, status: 'AVAILABLE', categoryName: 'Gastrointestinal' },
    { id: 15, name: 'Bromhexine 8mg Syrup (100ml)', price: 99000, status: 'AVAILABLE', categoryName: 'Respiratory Syrup' },
  ]);

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || p.categoryName === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <AppLayout title={t('productsTitle')}>
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchDrugPlaceholder')}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 border-none text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-slate-100 border-none text-xs text-slate-700 font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="ALL">{t('allCategories')}</option>
              <option value="Analgesic / Antipyretic">Analgesic / Antipyretic</option>
              <option value="Antibiotics">Antibiotics</option>
              <option value="Antihistamines">Antihistamines</option>
              <option value="Gastrointestinal">Gastrointestinal</option>
              <option value="Respiratory Syrup">Respiratory Syrup</option>
            </select>
          </div>
        </div>

        {/* Product Catalog Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                <tr>
                  <th className="px-6 py-4">{t('drugCode')}</th>
                  <th className="px-6 py-4">{t('medicineName')}</th>
                  <th className="px-6 py-4">{t('category')}</th>
                  <th className="px-6 py-4">{t('unitPrice')}</th>
                  <th className="px-6 py-4 text-right">{t('status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md">
                        #MED-{prod.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                          <Pill className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900">{prod.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {prod.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-900">{formatCurrency(prod.price)}</td>
                    <td className="px-6 py-4 text-right">
                      <Badge variant="SUCCESS" label={prod.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
