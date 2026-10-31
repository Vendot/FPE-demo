import React, { useState } from 'react';
import { useApp } from '@/app/providers/AppContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge, SiteBadge } from '@/components/data-display/StatusBadge';
import {
  RefreshCw,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  Clock,
  HelpCircle,
  FileText,
  Building,
  ShieldAlert,
} from 'lucide-react';

export const SyncCenterPage: React.FC = () => {
  const {
    sites,
    users,
    syncQueue,
    isOffline,
    setIsOffline,
    lastSyncedTimestamp,
    syncOfflineQueue,
  } = useApp();

  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [conflictReviewItem, setConflictReviewItem] = useState<any | null>(null);

  const pendingItems = syncQueue.filter((item) => item.status === 'PENDING_SYNC');
  const conflictItems = syncQueue.filter((item) => item.status === 'CONFLICT');
  const syncedItems = syncQueue.filter((item) => item.status === 'SYNCED');

  const handleTriggerSync = () => {
    if (isOffline) {
      setSyncFeedback('Tidak dapat sinkronisasi saat mode offline. Silakan aktifkan mode Online terlebih dahulu.');
      return;
    }

    const { syncedCount } = syncOfflineQueue();
    setSyncFeedback(
      syncedCount > 0
        ? `Sinkronisasi berhasil! ${syncedCount} transaksi lokal telah diproses dan dimutasi ke buku besar pusat.`
        : 'Tidak ada transaksi baru di antrean pending yang perlu disinkronkan.'
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sync Center & Simulasi Offline-First"
        subtitle="Monitoring antrean transaksi lokal, status sinkronisasi multi-site, dan rekonsiliasi data"
        actions={
          <button
            disabled={isOffline || pendingItems.length === 0}
            onClick={handleTriggerSync}
            className="rounded-lg bg-teal px-4 py-2 text-xs font-bold text-white hover:bg-teal-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Sinkronisasi Sekarang ({pendingItems.length} Pending)</span>
          </button>
        }
      />

      {syncFeedback && (
        <div className="flex items-start gap-2.5 rounded-xl border border-teal/40 bg-teal/10 p-4 text-xs text-navy font-semibold shadow-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-teal mt-0.5" />
          <div>{syncFeedback}</div>
        </div>
      )}

      {/* Simulator Safeguard Notice Banner */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 shadow-sm flex items-start gap-3">
        <HelpCircle className="h-5 w-5 text-teal shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Catatan Arsitektur Simulasi:</strong> Halaman ini mensimulasikan mekanisme
          offline-first untuk lokasi site tambang terpencil dengan koneksi internet terbatas.
          Pencatatan Goods Receiving, Issuing, dan Stock Opname disimpan di antrean lokal browser
          dan dimutasi saat kembali online. Ini adalah <em>single-browser simulation</em> tanpa
          klaim sinkronisasi multi-device otomatis di tingkat infrastruktur.
        </div>
      </div>

      {/* Connection State & Sites Sync Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Toggle Card */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Status Konektivitas
              </span>
              <span
                className={`flex h-2.5 w-2.5 rounded-full ${
                  isOffline ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                }`}
              />
            </div>
            <div className="flex items-center gap-2 font-bold text-navy text-lg">
              {isOffline ? (
                <>
                  <WifiOff className="h-5 w-5 text-amber-500" />
                  <span>Mode Offline Simulasi</span>
                </>
              ) : (
                <>
                  <Wifi className="h-5 w-5 text-emerald-600" />
                  <span>Online (Terhubung)</span>
                </>
              )}
            </div>
            <p className="text-xs text-text-secondary mt-1">
              {isOffline
                ? 'Transaksi lokal diantrekan. Otorisasi approval cross-site dinonaktifkan.'
                : 'Data siap disinkronkan ke seluruh site secara terpusat.'}
            </p>
          </div>

          <div className="pt-4 border-t border-border mt-3">
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`w-full rounded-lg py-2 text-xs font-bold transition-colors ${
                isOffline
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-amber-500 text-white hover:bg-amber-600'
              }`}
            >
              {isOffline ? 'Beralih ke Online' : 'Simulasikan Putus Koneksi (Offline)'}
            </button>
          </div>
        </div>

        {/* Sync Summary Card */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm space-y-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Antrean Data Lokal
          </span>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-amber-50 p-2.5 border border-amber-200">
              <span className="text-lg font-bold text-amber-700 tabular-nums block">
                {pendingItems.length}
              </span>
              <span className="text-[10px] text-amber-800 font-medium">Pending Sync</span>
            </div>
            <div className="rounded-lg bg-rose-50 p-2.5 border border-rose-200">
              <span className="text-lg font-bold text-rose-700 tabular-nums block">
                {conflictItems.length}
              </span>
              <span className="text-[10px] text-rose-800 font-medium">Perlu Review</span>
            </div>
            <div className="rounded-lg bg-emerald-50 p-2.5 border border-emerald-200">
              <span className="text-lg font-bold text-emerald-700 tabular-nums block">
                {syncedItems.length}
              </span>
              <span className="text-[10px] text-emerald-800 font-medium">Tersinkron</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            Waktu Sync Terakhir:{' '}
            <strong className="text-slate-600">
              {new Date(lastSyncedTimestamp).toLocaleString('id-ID')}
            </strong>
          </div>
        </div>

        {/* 6 Sites Last Synced Table Card */}
        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Status Waktu Sync Per Site
          </span>
          <div className="space-y-1.5 text-xs max-h-36 overflow-y-auto pr-1">
            {sites.map((site) => (
              <div
                key={site.id}
                className="flex items-center justify-between py-1 border-b border-border/60 last:border-0"
              >
                <div className="flex items-center gap-1.5">
                  <SiteBadge siteCode={site.code} />
                  <span className="font-semibold text-navy truncate max-w-[100px]">
                    {site.name.split(' ')[0]}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(site.lastSyncedAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Sync Queue Table */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
          <h3 className="font-bold text-navy text-sm flex items-center gap-2">
            <Clock className="h-4 w-4 text-teal" />
            <span>Daftar Antrean Transaksi Offline (Sync Queue)</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Total {syncQueue.length} Entri di Antrean
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Tipe & Deskripsi Transaksi</th>
                <th className="py-2.5 px-3">Site Asal</th>
                <th className="py-2.5 px-3">Petugas (Actor)</th>
                <th className="py-2.5 px-3">Waktu Pencatatan Lokal</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {syncQueue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Antrean kosong. Tidak ada transaksi yang menunggu sinkronisasi.
                  </td>
                </tr>
              ) : (
                syncQueue.map((item) => {
                  const site = sites.find((s) => s.id === item.siteId);
                  const actor = users.find((u) => u.id === item.actorId);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-navy block">{item.description}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {item.id}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <SiteBadge siteCode={site?.code || ''} siteName={site?.name} />
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {actor?.name || 'Staff Lapangan'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono">
                        {new Date(item.createdAt).toLocaleString('id-ID')}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {item.status === 'CONFLICT' ? (
                          <button
                            onClick={() => setConflictReviewItem(item)}
                            className="rounded bg-rose-50 border border-rose-200 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                          >
                            Review Konflik
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conflict Review Modal */}
      {conflictReviewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-surface p-6 shadow-2xl border border-border">
            <div className="flex items-center gap-3 text-rose-600 mb-3 pb-2 border-b border-border">
              <ShieldAlert className="h-6 w-6" />
              <h3 className="text-base font-bold text-navy">
                Review Discrepancy / Konflik Sinkronisasi
              </h3>
            </div>
            <div className="space-y-3 text-xs text-text-secondary leading-relaxed">
              <div className="rounded-lg bg-rose-50 p-3 border border-rose-200 text-rose-800">
                <strong className="block mb-1">Penyebab Konflik:</strong>
                {conflictReviewItem.conflictReason}
              </div>

              <div>
                <span className="font-semibold text-navy block">Deskripsi Transaksi:</span>
                <p>{conflictReviewItem.description}</p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-border text-slate-600">
                <strong className="text-navy block mb-1">Simulasi Rekonsiliasi:</strong>
                Dalam implementasi riil produksi, supervisor gudang FPE akan diberikan pilihan:
                (1) Membuat penyesuaian opname darurat, atau (2) Membatalkan transaksi dengan memo
                penolakan. Pada prototype demo ini, item tetap dipertahankan di antrean audit agar
                discrepancy terlihat transparan.
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setConflictReviewItem(null)}
                className="rounded-lg bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-navy-light"
              >
                Tutup Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
