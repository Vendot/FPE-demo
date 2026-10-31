import React, { useState, useMemo } from 'react';
import { useApp } from '@/app/providers/AppContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge, SiteBadge } from '@/components/data-display/StatusBadge';
import { Download, Search, History, Filter } from 'lucide-react';
import { TransactionType } from '@/domain/types';

export const TransactionHistoryPage: React.FC = () => {
  const { transactions, items, sites, users, selectedSiteId } = useApp();

  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [siteFilter, setSiteFilter] = useState<string>(selectedSiteId);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync if topbar changes
  React.useEffect(() => {
    setSiteFilter(selectedSiteId);
  }, [selectedSiteId]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchType = typeFilter === 'ALL' || tx.type === typeFilter;
      const matchSite = siteFilter === 'ALL' || tx.siteId === siteFilter;

      const item = items.find((i) => i.id === tx.itemId);
      const matchSearch =
        tx.transactionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.referenceNumber && tx.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item && item.code.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchType && matchSite && matchSearch;
    });
  }, [transactions, items, typeFilter, siteFilter, searchQuery]);

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = [
      'No Transaksi',
      'Waktu',
      'Jenis Mutasi',
      'Item',
      'Part Number',
      'Site',
      'Arah',
      'Kuantitas',
      'Satuan',
      'No Referensi',
      'Actor/Petugas',
      'Catatan',
      'Status Sync',
    ];

    const csvData = filteredTransactions.map((tx) => {
      const item = items.find((i) => i.id === tx.itemId);
      const site = sites.find((s) => s.id === tx.siteId);
      const actor = users.find((u) => u.id === tx.actorId);

      return [
        `"${tx.transactionNumber}"`,
        `"${tx.createdAt}"`,
        `"${tx.type}"`,
        `"${item?.name || '-'}"`,
        `"${item?.partNumber || '-'}"`,
        `"${site?.code || '-'}"`,
        `"${tx.direction}"`,
        tx.quantity,
        `"${item?.unit || '-'}"`,
        `"${tx.referenceNumber || '-'}"`,
        `"${actor?.name || '-'}"`,
        `"${tx.note || '-'}"`,
        `"${tx.syncStatus}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...csvData.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `FPE_Riwayat_Transaksi_${siteFilter}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Riwayat Transaksi & Buku Besar (Audit Trail)"
        subtitle="Catatan mutasi stok material lengkap: penerimaan, pengeluaran, pengiriman transfer, dan penyesuaian opname"
        actions={
          <button
            onClick={handleExportCSV}
            className="rounded-lg bg-teal px-3.5 py-2 text-xs font-semibold text-white hover:bg-teal-hover transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" />
            <span>Ekspor CSV ({filteredTransactions.length} Transaksi)</span>
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari transaksi, no surat jalan, atau nama item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border pl-9 pr-3 py-2 text-xs text-text-primary focus:border-teal focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-primary focus:border-teal focus:outline-none"
          >
            <option value="ALL">Semua Jenis Transaksi</option>
            <option value="GOODS_RECEIPT">Goods Receipt (Barang Masuk)</option>
            <option value="GOODS_ISSUE">Goods Issue (Barang Keluar)</option>
            <option value="TRANSFER_DISPATCH">Transfer Dispatch (Kirim Transfer)</option>
            <option value="TRANSFER_RECEIPT">Transfer Receipt (Terima Transfer)</option>
            <option value="STOCK_ADJUSTMENT">Stock Adjustment (Penyesuaian Opname)</option>
          </select>

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
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-slate-50/75 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">No. Transaksi</th>
                <th className="py-3 px-3">Waktu</th>
                <th className="py-3 px-3">Jenis Mutasi</th>
                <th className="py-3 px-3">Item Suku Cadang</th>
                <th className="py-3 px-3">Site</th>
                <th className="py-3 px-3 text-right">Kuantitas</th>
                <th className="py-3 px-3">No. Referensi / Ket</th>
                <th className="py-3 px-3 text-center">Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-secondary">
                    <History className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    <p className="font-medium">Tidak ada transaksi yang cocok dengan filter riwayat.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const item = items.find((i) => i.id === tx.itemId);
                  const site = sites.find((s) => s.id === tx.siteId);

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-navy">
                        {tx.transactionNumber}
                      </td>
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-700 block">
                          {tx.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-navy">{item?.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{item?.partNumber}</div>
                      </td>
                      <td className="py-3 px-3">
                        <SiteBadge siteCode={site?.code || ''} siteName={site?.name} />
                      </td>
                      <td className="py-3 px-3 text-right font-bold tabular-nums text-sm">
                        <span
                          className={
                            tx.direction === 'IN'
                              ? 'text-emerald-700'
                              : tx.direction === 'OUT'
                              ? 'text-rose-700'
                              : 'text-blue-700'
                          }
                        >
                          {tx.direction === 'IN' ? '+' : tx.direction === 'OUT' ? '-' : '±'}
                          {tx.quantity} {item?.unit}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs">
                        <div className="font-medium truncate">{tx.referenceNumber || '-'}</div>
                        {tx.note && <div className="text-[10px] text-slate-400 truncate">{tx.note}</div>}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <StatusBadge status={tx.syncStatus} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
