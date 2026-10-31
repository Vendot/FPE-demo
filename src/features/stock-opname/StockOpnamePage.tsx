import React, { useState } from 'react';
import { useApp } from '@/app/providers/AppContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge, SiteBadge } from '@/components/data-display/StatusBadge';
import {
  ClipboardCheck,
  Plus,
  CheckCircle2,
  AlertTriangle,
  History,
  Check,
  Clock,
  Layers,
} from 'lucide-react';

export const StockOpnamePage: React.FC = () => {
  const {
    sites,
    items,
    stockBalances,
    stockCountSessions,
    currentUser,
    createStockCount,
    submitStockCount,
    applyStockAdjustment,
  } = useApp();

  const [activeSiteId, setActiveSiteId] = useState(sites[0].id);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(items.map((i) => i.id));
  const [physicalCounts, setPhysicalCounts] = useState<Record<string, number>>({});
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const canApproveAdjustment =
    currentUser.role === 'SITE_APPROVER' || currentUser.role === 'ADMIN';

  // Active session object if any
  const currentSession = stockCountSessions.find((s) => s.id === activeSessionId);

  const handleStartSession = () => {
    setFeedback(null);
    const res = createStockCount({
      siteId: activeSiteId,
      itemIds: selectedItemIds,
    });
    if (!res.success) {
      setFeedback({ type: 'error', message: res.error || 'Gagal memulai sesi Stock Opname' });
    } else if (res.session) {
      setActiveSessionId(res.session.id);
      // Pre-fill physical counts with system counts
      const initialCounts: Record<string, number> = {};
      res.session.lines.forEach((l) => {
        initialCounts[l.itemId] = l.systemQty;
      });
      setPhysicalCounts(initialCounts);
      setFeedback({
        type: 'success',
        message: `Sesi Stock Opname ${res.session.sessionNumber} berhasil dibuat untuk ${sites.find((s) => s.id === activeSiteId)?.name}. Masukkan hasil perhitungan fisik.`,
      });
    }
  };

  const handleSubmitCounts = () => {
    if (!activeSessionId) return;
    setFeedback(null);
    const res = submitStockCount(activeSessionId, physicalCounts);
    if (!res.success) {
      setFeedback({ type: 'error', message: res.error || 'Gagal menyimpan hasil perhitungan' });
    } else {
      setFeedback({
        type: 'success',
        message: 'Hasil perhitungan fisik telah diajukan (Submitted) untuk review dan persetujuan penyesuaian stok.',
      });
    }
  };

  const handleApplyAdjustment = (sessionId: string) => {
    setFeedback(null);
    const res = applyStockAdjustment(sessionId);
    if (!res.success) {
      setFeedback({ type: 'error', message: res.error || 'Gagal menerapkan penyesuaian stok' });
    } else {
      setFeedback({
        type: 'success',
        message: 'Penyesuaian stok berhasil diterapkan (Applied) ke buku besar dan saldo on-hand.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Opname & Rekonsiliasi Fisik"
        subtitle="Pencatatan hasil perhitungan fisik berkala dan rekonsiliasi selisih (variance) terhadap sistem"
      />

      {feedback && (
        <div
          className={`flex items-start gap-2.5 rounded-xl border p-4 text-xs shadow-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
          )}
          <div className="font-semibold">{feedback.message}</div>
        </div>
      )}

      {/* Active Counting Section or Create Session Card */}
      {!currentSession || currentSession.status === 'APPLIED' ? (
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <ClipboardCheck className="h-5 w-5 text-teal" />
            <h3 className="font-bold text-navy text-sm">Mulai Sesi Stock Opname Baru</h3>
          </div>
          <p className="text-xs text-text-secondary mb-4">
            Pilih site gudang yang akan dilakukan stock opname fisik. Sistem akan mengambil snapshot
            saldo buku (system quantity) sebagai acuan pembanding.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Pilih Site Operasional
              </label>
              <select
                value={activeSiteId}
                onChange={(e) => setActiveSiteId(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface p-2 text-xs focus:border-teal focus:outline-none"
              >
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Cakupan Item
              </label>
              <div className="rounded-lg border border-border p-2 text-xs text-slate-600 bg-slate-50">
                Semua Item Terdaftar ({items.length} SKU)
              </div>
            </div>

            <div>
              <button
                onClick={handleStartSession}
                className="w-full rounded-lg bg-teal py-2 text-xs font-bold text-white hover:bg-teal-hover transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>Buka Sesi Perhitungan Fisik</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Active Session Form */
        <div className="rounded-xl border border-teal/40 bg-surface p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-navy text-sm">
                  {currentSession.sessionNumber}
                </span>
                <StatusBadge status={currentSession.status} />
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Site: <strong>{sites.find((s) => s.id === currentSession.siteId)?.name}</strong> •
                Dibuat: {new Date(currentSession.createdAt).toLocaleString('id-ID')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {currentSession.status === 'DRAFT' && (
                <button
                  onClick={handleSubmitCounts}
                  className="rounded-lg bg-teal px-4 py-2 text-xs font-bold text-white hover:bg-teal-hover transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Ajukan Hasil Perhitungan (Submit)</span>
                </button>
              )}

              {currentSession.status === 'SUBMITTED' && (
                <button
                  disabled={!canApproveAdjustment}
                  onClick={() => handleApplyAdjustment(currentSession.id)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Setujui & Terapkan Penyesuaian ke Ledger</span>
                </button>
              )}
            </div>
          </div>

          {!canApproveAdjustment && currentSession.status === 'SUBMITTED' && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 font-medium">
              Sesi telah diajukan. Hanya <strong>Site Approver</strong> atau{' '}
              <strong>Admin</strong> yang berhak menyetujui dan menerapkan penyesuaian stok fisik
              ke sistem. Ganti persona demo untuk melanjutkan.
            </div>
          )}

          {/* Table of items to count */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Item Suku Cadang</th>
                  <th className="py-2.5 px-3 text-right">Saldo Sistem</th>
                  <th className="py-2.5 px-3 text-right">Hitungan Fisik Aktual</th>
                  <th className="py-2.5 px-3 text-right">Selisih (Variance)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {currentSession.lines.map((line) => {
                  const item = items.find((i) => i.id === line.itemId);
                  const phys = physicalCounts[line.itemId] ?? line.systemQty;
                  const variance = phys - line.systemQty;

                  return (
                    <tr key={line.itemId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-navy block">{item?.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item?.code} • {item?.partNumber}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-600 tabular-nums">
                        {line.systemQty} {item?.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {currentSession.status === 'DRAFT' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <input
                              type="number"
                              min="0"
                              value={phys}
                              onChange={(e) =>
                                setPhysicalCounts({
                                  ...physicalCounts,
                                  [line.itemId]: parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-20 rounded border border-border p-1.5 text-xs text-right font-bold tabular-nums focus:border-teal focus:outline-none"
                            />
                            <span className="text-slate-500 font-medium">{item?.unit}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-navy tabular-nums">
                            {line.physicalQty ?? phys} {item?.unit}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold tabular-nums">
                        {variance === 0 ? (
                          <span className="text-slate-400 font-normal">Sesuai (0)</span>
                        ) : variance > 0 ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            +{variance} {item?.unit} (Lebih)
                          </span>
                        ) : (
                          <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            {variance} {item?.unit} (Kurang)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Historical Stock Count Sessions Table */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <h3 className="font-bold text-navy text-sm mb-3 flex items-center gap-2">
          <History className="h-4 w-4 text-teal" />
          <span>Riwayat Sesi Stock Opname Terdahulu</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">No. Sesi</th>
                <th className="py-2.5 px-3">Site Gudang</th>
                <th className="py-2.5 px-3 text-center">Jumlah SKU</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3">Tanggal Dibuat</th>
                <th className="py-2.5 px-3">Tanggal Diterapkan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {stockCountSessions.map((session) => {
                const site = sites.find((s) => s.id === session.siteId);
                return (
                  <tr
                    key={session.id}
                    onClick={() => setActiveSessionId(session.id)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-navy">
                      {session.sessionNumber}
                    </td>
                    <td className="py-2.5 px-3">
                      <SiteBadge siteCode={site?.code || ''} siteName={site?.name} />
                    </td>
                    <td className="py-2.5 px-3 text-center font-medium">
                      {session.lines.length} Item
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <StatusBadge status={session.status} />
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {new Date(session.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {session.appliedAt
                        ? new Date(session.appliedAt).toLocaleDateString('id-ID')
                        : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
