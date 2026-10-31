import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/providers/AppContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge, SiteBadge } from '@/components/data-display/StatusBadge';
import { ArrowLeftRight, Plus, Search, Filter, ArrowRight, Eye } from 'lucide-react';
import { TransferStatus } from '@/domain/types';

export const TransferListPage: React.FC = () => {
  const { transfers, sites, selectedSiteId } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => {
      const isSiteMatch =
        selectedSiteId === 'ALL' ||
        t.sourceSiteId === selectedSiteId ||
        t.destinationSiteId === selectedSiteId;

      const isStatusMatch = statusFilter === 'ALL' || t.status === statusFilter;

      const isSearchMatch =
        t.transferNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.reason.toLowerCase().includes(searchQuery.toLowerCase());

      return isSiteMatch && isStatusMatch && isSearchMatch;
    });
  }, [transfers, selectedSiteId, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Transfer Antar-Site"
        subtitle="Kelola dan pantau seluruh alur perpindahan suku cadang dari pengajuan, persetujuan, pengiriman, hingga penerimaan"
        actions={
          <button
            onClick={() => navigate('/transfers/new')}
            className="rounded-lg bg-teal px-3.5 py-2 text-xs font-semibold text-white hover:bg-teal-hover transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Buat Permintaan Transfer Baru</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor transfer (TRF-xxxx) atau alasan permintaan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border pl-9 pr-3 py-2 text-xs text-text-primary focus:border-teal focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-primary focus:border-teal focus:outline-none"
          >
            <option value="ALL">Semua Status Transfer</option>
            <option value="PENDING_APPROVAL">Menunggu Approval</option>
            <option value="APPROVED">Disetujui (Siap Kirim)</option>
            <option value="IN_TRANSIT">Dalam Pengiriman (In Transit)</option>
            <option value="PARTIALLY_RECEIVED">Diterima Sebagian</option>
            <option value="COMPLETED">Selesai (Completed)</option>
            <option value="REJECTED">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Transfers Table */}
      <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-slate-50/75 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">No. Transfer</th>
                <th className="py-3 px-4">Rute Pengiriman</th>
                <th className="py-3 px-4 text-center">Jumlah Item</th>
                <th className="py-3 px-4">Alasan & Keperluan</th>
                <th className="py-3 px-4 text-center">Status Alur</th>
                <th className="py-3 px-4">Tanggal Pengajuan</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-secondary">
                    <ArrowLeftRight className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    <p className="font-medium">Tidak ada data transfer yang cocok dengan filter.</p>
                  </td>
                </tr>
              ) : (
                filteredTransfers.map((trf) => {
                  const srcSite = sites.find((s) => s.id === trf.sourceSiteId);
                  const dstSite = sites.find((s) => s.id === trf.destinationSiteId);

                  return (
                    <tr
                      key={trf.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/transfers/${trf.id}`)}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-navy group-hover:text-teal transition-colors">
                        {trf.transferNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <SiteBadge siteCode={srcSite?.code || ''} siteName={srcSite?.name} />
                          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                          <SiteBadge siteCode={dstSite?.code || ''} siteName={dstSite?.name} />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-navy tabular-nums">
                        {trf.lines.length} Line
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-600">
                        {trf.reason}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={trf.status} />
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(trf.requestedAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/transfers/${trf.id}`);
                          }}
                          className="rounded-md border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Detail</span>
                        </button>
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
