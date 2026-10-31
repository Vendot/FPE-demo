import React, { useState, useMemo } from 'react';
import { useApp } from '@/app/providers/AppContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge, SiteBadge } from '@/components/data-display/StatusBadge';
import { Download, Search, Filter, FileText, Building } from 'lucide-react';

export const ReportsStockPage: React.FC = () => {
  const { sites, items, stockBalances, categories, selectedSiteId } = useApp();

  const [siteFilter, setSiteFilter] = useState<string>(selectedSiteId);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LOW' | 'NORMAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Keep local site filter synced if topbar changes
  React.useEffect(() => {
    setSiteFilter(selectedSiteId);
  }, [selectedSiteId]);

  // Flatten stock balances with item & site info
  const reportRows = useMemo(() => {
    return stockBalances
      .map((b) => {
        const item = items.find((i) => i.id === b.itemId);
        const site = sites.find((s) => s.id === b.siteId);
        const category = categories.find((c) => c.id === item?.categoryId);
        const isLow = b.onHand <= b.minimumStock && b.minimumStock > 0;
        const status: 'LOW_STOCK' | 'NORMAL' = isLow ? 'LOW_STOCK' : 'NORMAL';

        return {
          id: b.id,
          itemId: b.itemId,
          itemCode: item?.code || '-',
          itemName: item?.name || '-',
          partNumber: item?.partNumber || '-',
          categoryName: category?.name || '-',
          unit: item?.unit || '-',
          siteId: b.siteId,
          siteCode: site?.code || '-',
          siteName: site?.name || '-',
          onHand: b.onHand,
          minimumStock: b.minimumStock,
          inTransitIn: b.inTransitIn,
          inTransitOut: b.inTransitOut,
          status,
          updatedAt: b.updatedAt,
        };
      })
      .filter((row) => {
        const matchSite = siteFilter === 'ALL' || row.siteId === siteFilter;
        const matchCategory =
          categoryFilter === 'ALL' ||
          items.find((i) => i.id === row.itemId)?.categoryId === categoryFilter;
        const matchStatus =
          statusFilter === 'ALL' ||
          (statusFilter === 'LOW' && row.status === 'LOW_STOCK') ||
          (statusFilter === 'NORMAL' && row.status === 'NORMAL');
        const matchSearch =
          row.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.partNumber.toLowerCase().includes(searchQuery.toLowerCase());

        return matchSite && matchCategory && matchStatus && matchSearch;
      });
  }, [stockBalances, items, sites, categories, siteFilter, categoryFilter, statusFilter, searchQuery]);

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = [
      'Kode Item',
      'Nama Item',
      'Part Number',
      'Kategori',
      'Site',
      'Lokasi',
      'Saldo On-Hand',
      'Batas Minimum',
      'Satuan',
      'In-Transit Masuk',
      'In-Transit Keluar',
      'Status Stok',
      'Update Terakhir',
    ];

    const csvData = reportRows.map((r) => [
      `"${r.itemCode}"`,
      `"${r.itemName}"`,
      `"${r.partNumber}"`,
      `"${r.categoryName}"`,
      `"${r.siteCode}"`,
      `"${r.siteName}"`,
      r.onHand,
      r.minimumStock,
      `"${r.unit}"`,
      r.inTransitIn,
      r.inTransitOut,
      `"${r.status}"`,
      `"${r.updatedAt}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...csvData.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `FPE_Laporan_Stok_${siteFilter}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan Posisi Stok Lintas Site"
        subtitle="Laporan inventaris terpadu dengan filter multi-dimensi dan ekspor data spreadsheet"
        actions={
          <button
            onClick={handleExportCSV}
            className="rounded-lg bg-teal px-3.5 py-2 text-xs font-semibold text-white hover:bg-teal-hover transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" />
            <span>Ekspor CSV ({reportRows.length} Baris)</span>
          </button>
        }
      />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari item atau part number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border pl-9 pr-3 py-2 text-xs text-text-primary focus:border-teal focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-primary focus:border-teal focus:outline-none"
          >
            <option value="ALL">Semua Site (6 Lokasi)</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-primary focus:border-teal focus:outline-none"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-primary focus:border-teal focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="LOW">Di Bawah Minimum</option>
            <option value="NORMAL">Optimal / Aman</option>
          </select>
        </div>
      </div>

      {/* Report Table */}
      <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-slate-50/75 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Item Suku Cadang</th>
                <th className="py-3 px-3 font-mono">Part Number</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Site Gudang</th>
                <th className="py-3 px-3 text-right">Saldo On-Hand</th>
                <th className="py-3 px-3 text-right">Batas Min</th>
                <th className="py-3 px-3 text-right">In-Transit</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {reportRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-secondary">
                    <FileText className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    <p className="font-medium">Tidak ada data stok yang sesuai dengan filter laporan.</p>
                  </td>
                </tr>
              ) : (
                reportRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-navy">{row.itemName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{row.itemCode}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 font-medium">
                      {row.partNumber}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {row.categoryName}
                    </td>
                    <td className="py-3 px-3">
                      <SiteBadge siteCode={row.siteCode} siteName={row.siteName} />
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-navy tabular-nums text-sm">
                      {row.onHand} <span className="text-xs font-normal text-slate-500">{row.unit}</span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 tabular-nums">
                      {row.minimumStock} {row.unit}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 tabular-nums">
                      {row.inTransitIn > 0 && (
                        <span className="text-emerald-700 font-semibold">+{row.inTransitIn}</span>
                      )}
                      {row.inTransitIn === 0 && row.inTransitOut === 0 && '-'}
                      {row.inTransitOut > 0 && (
                        <span className="text-amber-700 font-semibold"> -{row.inTransitOut}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
