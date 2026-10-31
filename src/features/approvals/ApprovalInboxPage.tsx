import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/providers/AppContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge, SiteBadge } from '@/components/data-display/StatusBadge';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Eye,
  Inbox,
  Lock,
} from 'lucide-react';

export const ApprovalInboxPage: React.FC = () => {
  const {
    transfers,
    sites,
    items,
    users,
    currentUser,
    isOffline,
    approveTransfer,
    rejectTransfer,
  } = useApp();
  const navigate = useNavigate();

  const [activeRejectId, setActiveRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const isApproverRole = currentUser.role === 'SITE_APPROVER' || currentUser.role === 'ADMIN';
  const canApprove = isApproverRole && !isOffline;

  // Filter transfers in PENDING_APPROVAL status
  const pendingTransfers = transfers.filter((t) => t.status === 'PENDING_APPROVAL');

  const handleQuickApprove = (transferId: string) => {
    setFeedback(null);
    const res = approveTransfer(transferId, 'Disetujui melalui Approval Inbox');
    if (!res.success) {
      setFeedback({ type: 'error', message: res.error || 'Gagal menyetujui transfer' });
    } else {
      setFeedback({ type: 'success', message: 'Transfer berhasil disetujui!' });
    }
  };

  const handleQuickReject = (transferId: string) => {
    if (!rejectReason.trim()) {
      setFeedback({ type: 'error', message: 'Alasan penolakan transfer wajib diisi' });
      return;
    }
    const res = rejectTransfer(transferId, rejectReason);
    if (!res.success) {
      setFeedback({ type: 'error', message: res.error || 'Gagal menolak transfer' });
    } else {
      setFeedback({ type: 'success', message: 'Permintaan transfer telah ditolak' });
      setActiveRejectId(null);
      setRejectReason('');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kotak Masuk Persetujuan (Approval Inbox)"
        subtitle="Otorisasi permohonan transfer antar-site sebelum barang dapat dikemas dan dikirim"
        badge={
          <span className="rounded-full bg-amber-500 text-white px-2.5 py-0.5 text-xs font-bold shadow-sm">
            {pendingTransfers.length} Menunggu Tindakan
          </span>
        }
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

      {/* Offline Warning Notice (TC-13) */}
      {isOffline && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 shadow-sm flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <div>
            <strong>Mode Offline Simulasi Aktif:</strong> Otorisasi persetujuan / penolakan transfer
            dinonaktifkan dalam mode offline untuk menjaga konsistensi state transaksi antar-site.
            Harap beralih ke mode <strong>Online</strong> untuk melakukan approval.
          </div>
        </div>
      )}

      {/* Non-Approver Persona Guard Notice */}
      {!isApproverRole && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-slate-500 shrink-0" />
            <div>
              <span>
                Saat ini Anda menggunakan persona <strong>{currentUser.name}</strong> ({currentUser.role}).
                Hanya <strong>Site Approver</strong> atau <strong>Demo Administrator</strong> yang
                memiliki kewenangan untuk mengeksekusi persetujuan transfer.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Pending Transfers List */}
      <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
        {pendingTransfers.length === 0 ? (
          <div className="py-16 text-center text-text-secondary">
            <Inbox className="mx-auto h-10 w-10 text-slate-300 mb-2" />
            <h4 className="font-bold text-navy text-sm">Tidak ada permohonan transfer pending</h4>
            <p className="text-xs text-slate-400 mt-1">
              Semua permohonan transfer telah selesai diproses atau disetujui.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/70">
            {pendingTransfers.map((trf) => {
              const srcSite = sites.find((s) => s.id === trf.sourceSiteId);
              const dstSite = sites.find((s) => s.id === trf.destinationSiteId);
              const reqUser = users.find((u) => u.id === trf.requestedBy);

              return (
                <div key={trf.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-navy text-sm">
                          {trf.transferNumber}
                        </span>
                        <StatusBadge status={trf.status} />
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span className="text-slate-500">Rute:</span>
                        <SiteBadge siteCode={srcSite?.code || ''} siteName={srcSite?.name} />
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                        <SiteBadge siteCode={dstSite?.code || ''} siteName={dstSite?.name} />
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">
                          Diajukan oleh: <strong>{reqUser?.name || 'Staff Gudang'}</strong>
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-400">
                          {new Date(trf.requestedAt).toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-text-primary bg-slate-50 p-2.5 rounded-lg border border-slate-100 max-w-2xl">
                        <strong className="text-slate-600 block text-[11px] mb-0.5">
                          Alasan Kebutuhan:
                        </strong>
                        {trf.reason}
                      </div>

                      {/* Items requested list */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {trf.lines.map((l) => {
                          const item = items.find((i) => i.id === l.itemId);
                          return (
                            <span
                              key={l.itemId}
                              className="rounded bg-teal/10 px-2.5 py-1 text-[11px] font-semibold text-teal"
                            >
                              {item?.name}: {l.requestedQty} {item?.unit}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => navigate(`/transfers/${trf.id}`)}
                        className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-navy hover:bg-slate-100 transition-colors flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Lihat Detail</span>
                      </button>

                      <button
                        disabled={!canApprove}
                        onClick={() => handleQuickApprove(trf.id)}
                        className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Setujui (Approve)</span>
                      </button>

                      <button
                        disabled={!canApprove}
                        onClick={() => setActiveRejectId(trf.id)}
                        className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Tolak</span>
                      </button>
                    </div>
                  </div>

                  {/* Inline Rejection Reason Modal/Input */}
                  {activeRejectId === trf.id && (
                    <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50/70 p-4 text-xs">
                      <label className="block font-bold text-rose-900 mb-1">
                        Masukkan Alasan Penolakan Transfer <span className="text-rose-600">*</span>
                      </label>
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Contoh: Stok di site asal dialokasikan untuk maintenance darurat unit lain..."
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="flex-1 rounded-lg border border-border p-2 text-xs focus:border-rose-500 focus:outline-none"
                        />
                        <button
                          onClick={() => handleQuickReject(trf.id)}
                          className="rounded-lg bg-rose-600 px-4 py-2 font-bold text-white hover:bg-rose-700"
                        >
                          Konfirmasi Tolak
                        </button>
                        <button
                          onClick={() => {
                            setActiveRejectId(null);
                            setRejectReason('');
                          }}
                          className="rounded-lg border border-border bg-white px-3 py-2 font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
