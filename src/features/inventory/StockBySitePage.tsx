import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/app/providers/AppContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { SiteBadge } from '@/components/data-display/StatusBadge';
import { Search, Filter, ArrowLeftRight, Building, Layers, AlertCircle } from 'lucide-react';

export const StockBySitePage: React.FC = () => {
  const { items, sites, stockBalances, categories, selectedSiteId, setSelectedSiteId } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'matrix' | 'site-focus'>('matrix');

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.partNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'ALL' || item.categoryId === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [items, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Matriks Stok Lintas Site"
        subtitle="Visibilitas komprehensif saldo on-hand dan ambang batas minimum di seluruh 6 site"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'matrix' ? 'site-focus' : 'matrix')}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-navy hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Layers className="h-4 w-4 text-teal" />
              <span>{viewMode === 'matrix' ? 'Tampilan Per-Site Focus' : 'Tampilan Matriks Grid 6 Site'}</span>
            </button>
            <button
              onClick={() => navigate('/transfers/new')}
              className="rounded-lg bg-teal px-3 py-2 text-xs font-semibold text-white hover:bg-teal-hover transition-colors shadow-sm flex items-center gap-1.5"
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span>Ajukan Transfer Antar-Site</span>
            </button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari item atau part number pada matriks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border pl-9 pr-3 py-2 text-xs text-text-primary focus:border-teal focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-primary focus:border-teal focus:outline-none"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Matrix View (All 6 Sites in columns) */}
      {viewMode === 'matrix' ? (
        <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-slate-50/75 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 min-w-[200px]">Item & Part No.</th>
                  <th className="py-3 px-2 text-center">Unit</th>
                  {sites.map((site) => (
                    <th key={site.id} className="py-3 px-3 text-right min-w-[110px]">
                      <div>{site.code}</div>
                      <div className="text-[9px] text-slate-400 font-normal">{site.name.split(' ')[0]}</div>
                    </th>
                  ))}
                  <th className="py-3 px-4 text-right font-bold text-navy min-w-[120px] bg-slate-100/50">
                    Total 6 Site
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredItems.map((item) => {
                  let totalOnHand = 0;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                      onClick={() => navigate(`/inventory/items/${item.id}`)}
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-navy hover:text-teal transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {item.code} • {item.partNumber}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center text-slate-500 font-mono">
                        {item.unit}
                      </td>

                      {/* 6 Site Columns */}
                      {sites.map((site) => {
                        const bal = stockBalances.find(
                          (b) => b.itemId === item.id && b.siteId === site.id
                        );
                        const onHand = bal ? bal.onHand : 0;
                        const min = bal ? bal.minimumStock : 0;
                        totalOnHand += onHand;

                        const isLow = onHand <= min && min > 0;
                        const isZero = onHand === 0;

                        return (
                          <td key={site.id} className="py-3 px-3 text-right tabular-nums">
                            <span
                              className={`font-semibold inline-block px-1.5 py-0.5 rounded ${
                                isZero
                                  ? 'text-slate-400 bg-slate-100 text-[11px]'
                                  : isLow
                                  ? 'text-rose-700 bg-rose-50 font-bold border border-rose-200'
                                  : 'text-navy'
                              }`}
                            >
                              {onHand}
                            </span>
                            {min > 0 && (
                              <div className="text-[10px] text-slate-400">min: {min}</div>
                            )}
                          </td>
                        );
                      })}

                      {/* Total Column */}
                      <td className="py-3 px-4 text-right font-bold text-teal text-sm tabular-nums bg-slate-50/50">
                        {totalOnHand} {item.unit}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Site-Focus View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sites.map((site) => {
            const siteBalances = stockBalances.filter((b) => b.siteId === site.id);
            const totalUnits = siteBalances.reduce((sum, b) => sum + b.onHand, 0);
            const lowCount = siteBalances.filter((b) => b.onHand <= b.minimumStock).length;

            return (
              <div
                key={site.id}
                className="rounded-xl border border-border bg-surface p-5 shadow-sm hover:border-teal transition-all"
              >
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <h3 className="font-bold text-navy text-sm">{site.name}</h3>
                    <span className="text-[11px] text-slate-400">{site.locationLabel}</span>
                  </div>
                  <SiteBadge siteCode={site.code} />
                </div>

                <div className="grid grid-cols-2 gap-3 my-4 text-xs">
                  <div className="rounded-lg bg-slate-50 p-2.5">
                    <span className="text-slate-400 block text-[11px]">Total Stok Fisik</span>
                    <span className="font-bold text-navy text-base tabular-nums mt-0.5 block">
                      {totalUnits} unit
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2.5">
                    <span className="text-slate-400 block text-[11px]">Item di Bawah Min</span>
                    <span
                      className={`font-bold text-base tabular-nums mt-0.5 block ${
                        lowCount > 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {lowCount} SKU
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedSiteId(site.id);
                    navigate('/dashboard');
                  }}
                  className="w-full rounded-lg border border-border py-1.5 text-xs font-semibold text-teal hover:bg-teal hover:text-white transition-colors"
                >
                  Fokuskan Dashboard ke Site Ini
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
