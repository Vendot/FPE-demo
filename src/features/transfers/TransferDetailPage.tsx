import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/app/providers/AppContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge, SiteBadge } from '@/components/data-display/StatusBadge';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Check,
  Building,
  FileText,
} from 'lucide-react';

export const TransferDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    transfers,
    sites,
    items,
    users,
    currentUser,
    isOffline,
    approveTransfer,
    rejectTransfer,
    dispatchTransfer,
    receiveTransfer,
  } = useApp();
  const navigate = useNavigate();

  const transfer = transfers.find((t) => t.id === id);

  const [approvalNote, setApprovalNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [dispatchNote, setDispatchNote] = useState('');
  const [receivedQtys, setReceivedQtys] = useState<Record<string, number>>({});
  const [receiptNote, setReceiptNote] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // Initialize received quantities when transfer loads
  React.useEffect(() => {
    if (transfer) {
      const initialQtys: Record<string, number> = {};
      transfer.lines.forEach((l) => {
        initialQtys[l.itemId] = l.dispatchedQty ?? l.requestedQty;
      });
      setReceivedQtys(initialQtys);
    }
  }, [transfer]);

  if (!transfer) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-lg font-bold text-navy">Data transfer tidak ditemukan</h2>
        <button
          onClick={() => navigate('/transfers')}
          className="mt-4 text-xs font-semibold text-teal hover:underline"
        >
          &larr; Kembali ke Daftar Transfer
        </button>
      </div>
    );
  }

  const srcSite = sites.find((s) => s.id === transfer.sourceSiteId);
  const dstSite = sites.find((s) => s.id === transfer.destinationSiteId);
  const requester = users.find((u) => u.id === transfer.requestedBy);
  const approver = users.find((u) => u.id === transfer.approvedBy);

  // Authorization checks for demo persona
  const canApprove =
    (currentUser.role === 'SITE_APPROVER' || currentUser.role === 'ADMIN') && !isOffline;
  const isApproverRole = currentUser.role === 'SITE_APPROVER' || currentUser.role === 'ADMIN';

  // Handlers
  const handleApprove = () => {
    setFeedback(null);
    const res = approveTransfer(transfer.id, approvalNote);
    if (!res.success) {
      setFeedback({ type: 'error', message: res.error || 'Gagal menyetujui transfer' });
    } else {
      setFeedback({ type: 'success', message: 'Permintaan transfer berhasil disetujui (Approved)!' });
    }
  };

  const handleReject = () => {
    setFeedback(null);
    if (!rejectionReason.trim()) {
      setFeedback({ type: 'error', message: 'Alasan penolakan transfer wajib diisi' });
      return;
    }
    const res = rejectTransfer(transfer.id, rejectionReason);
    if (!res.success) {
      setFeedback({ type: 'error', message: res.error || 'Gagal menolak transfer' });
    } else {
      setFeedback({ type: 'success', message: 'Permintaan transfer telah ditolak (Rejected).' });
    }
  };

  const handleDispatch = () => {
    setFeedback(null);
    const res = dispatchTransfer(transfer.id, dispatchNote);
    if (!res.success) {
      setFeedback({ type: 'error', message: res.error || 'Gagal melakukan dispatch transfer' });
    } else {
      setFeedback({
        type: 'success',
        message:
          'Barang berhasil dikirim (Dispatched). Stok on-hand di site asal telah dikurangi dan kuantitas in-transit telah bertambah.',
      });
    }
  };

  const handleReceive = () => {
    setFeedback(null);
    const res = receiveTransfer({
      transferId: transfer.id,
      receivedQuantities: receivedQtys,
      receiptNote,
    });
    if (!res.success) {
      setFeedback({ type: 'error', message: res.error || 'Gagal mengonfirmasi penerimaan transfer' });
    } else {
      setFeedback({
        type: 'success',
        message:
          'Penerimaan barang berhasil dikonfirmasi. Kuantitas in-transit telah dikurangi dan stok on-hand di site tujuan telah bertambah.',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <button
          onClick={() => navigate('/transfers')}
          className="mb-2 text-xs font-semibold text-teal hover:text-teal-hover flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Daftar Transfer</span>
        </button>
        <PageHeader
          title={transfer.transferNumber}
          subtitle={`Rute: ${srcSite?.name} (${srcSite?.code}) ke ${dstSite?.name} (${dstSite?.code})`}
          badge={<StatusBadge status={transfer.status} />}
        />
      </div>

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

      {/* Rute & Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Gudang Pengirim (Source)
          </span>
          <div className="font-bold text-navy text-sm">{srcSite?.name}</div>
          <div className="text-xs text-slate-500 mt-0.5">{srcSite?.locationLabel}</div>
          <div className="mt-2">
            <SiteBadge siteCode={srcSite?.code || ''} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Gudang Penerima (Destination)
          </span>
          <div className="font-bold text-navy text-sm">{dstSite?.name}</div>
          <div className="text-xs text-slate-500 mt-0.5">{dstSite?.locationLabel}</div>
          <div className="mt-2">
            <SiteBadge siteCode={dstSite?.code || ''} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Pemohon & Tanggal
          </span>
          <div className="font-bold text-navy text-sm">{requester?.name || 'Staff Gudang'}</div>
          <div className="text-xs text-slate-500 mt-0.5">
            {new Date(transfer.requestedAt).toLocaleString('id-ID')}
          </div>
          <div className="mt-2 text-xs text-slate-600 italic truncate" title={transfer.reason}>
            "{transfer.reason}"
          </div>
        </div>
      </div>

      {/* Item Lines Table */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <h3 className="font-bold text-navy text-sm mb-3">Daftar Suku Cadang Ditransfer</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Item Suku Cadang</th>
                <th className="py-2.5 px-3 text-center">Part Number</th>
                <th className="py-2.5 px-3 text-right">Diminta (Req)</th>
                <th className="py-2.5 px-3 text-right">Dikirim (Dsp)</th>
                <th className="py-2.5 px-3 text-right">Diterima (Rcv)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {transfer.lines.map((line) => {
                const item = items.find((i) => i.id === line.itemId);
                return (
                  <tr key={line.itemId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-navy block">{item?.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item?.code}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                      {item?.partNumber}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-navy tabular-nums">
                      {line.requestedQty} {item?.unit}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600 tabular-nums">
                      {line.dispatchedQty !== undefined ? `${line.dispatchedQty} ${item?.unit}` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {line.receivedQty !== undefined ? (
                        <span
                          className={`font-bold ${
                            line.receivedQty < (line.dispatchedQty || line.requestedQty)
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {line.receivedQty} {item?.unit}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Lifecycle Action Panels based on Status */}
      {/* 1. APPROVAL PANEL */}
      {transfer.status === 'PENDING_APPROVAL' && (
        <div className="rounded-xl border border-amber-300 bg-amber-50/40 p-5 shadow-sm text-xs">
          <div className="flex items-center gap-2 mb-3 text-amber-900 font-bold text-sm">
            <ShieldCheck className="h-5 w-5 text-amber-600" />
            <span>Panel Persetujuan Transfer (Site Approver / Admin)</span>
          </div>

          {isOffline && (
            <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-rose-800 font-medium">
              Persetujuan transfer tidak dapat dilakukan saat mode offline untuk mencegah
              inkonsistensi status cross-site. Harap beralih ke mode Online terlebih dahulu.
            </div>
          )}

          {!isApproverRole && (
            <div className="mb-4 rounded-lg bg-slate-100 p-3 text-slate-700">
              Role Anda saat ini (<strong>{currentUser.role}</strong>) tidak memiliki hak untuk
              menyetujui atau menolak transfer. Gunakan role switcher di pojok kanan atas untuk
              beralih ke <strong>Siti Approver</strong> atau <strong>Demo Administrator</strong>.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {/* Approve Box */}
            <div className="rounded-lg border border-border bg-surface p-4 shadow-sm space-y-3">
              <h4 className="font-bold text-navy text-xs flex items-center gap-1.5 text-emerald-800">
                <Check className="h-4 w-4" />
                <span>Setujui Permintaan Transfer</span>
              </h4>
              <p className="text-[11px] text-text-secondary">
                Menyetujui permohonan ini dan memberikan otorisasi kepada staf gudang Site Asal
                untuk mengirim barang.
              </p>
              <input
                type="text"
                placeholder="Catatan persetujuan (opsional)..."
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                className="w-full rounded border border-border p-2 text-xs focus:border-teal focus:outline-none"
              />
              <button
                type="button"
                disabled={!canApprove}
                onClick={handleApprove}
                className="w-full rounded bg-emerald-600 py-2 font-bold text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Setujui Transfer (Approve)
              </button>
            </div>

            {/* Reject Box */}
            <div className="rounded-lg border border-border bg-surface p-4 shadow-sm space-y-3">
              <h4 className="font-bold text-navy text-xs flex items-center gap-1.5 text-rose-800">
                <XCircle className="h-4 w-4" />
                <span>Tolak Permintaan Transfer</span>
              </h4>
              <p className="text-[11px] text-text-secondary">
                Menolak permohonan transfer. Alasan penolakan wajib dicantumkan untuk audit trail.
              </p>
              <input
                type="text"
                placeholder="Alasan penolakan (wajib diisi)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full rounded border border-border p-2 text-xs focus:border-teal focus:outline-none"
              />
              <button
                type="button"
                disabled={!canApprove}
                onClick={handleReject}
                className="w-full rounded bg-rose-600 py-2 font-bold text-white hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Tolak Transfer (Reject)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DISPATCH PANEL */}
      {transfer.status === 'APPROVED' && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-5 shadow-sm text-xs">
          <div className="flex items-center gap-2 mb-2 text-blue-900 font-bold text-sm">
            <Truck className="h-5 w-5 text-blue-600" />
            <span>Pengiriman Barang (Dispatch) — Gudang Site Asal ({srcSite?.name})</span>
          </div>
          <p className="text-text-secondary mb-4">
            Konfirmasi bahwa suku cadang fisik telah disiapkan, dikemas, dan diserahkan ke kurir /
            armada logistik. Pada tahap ini, stok fisik on-hand di {srcSite?.code} akan berkurang
            dan masuk ke status <strong>In-Transit</strong>.
          </p>

          <div className="max-w-md space-y-3">
            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Nomor Surat Jalan / Ekspedisi / Catatan Pengiriman
              </label>
              <input
                type="text"
                placeholder="Contoh: SJ-TRF-0912 / Ekspedisi Darat Truk #04"
                value={dispatchNote}
                onChange={(e) => setDispatchNote(e.target.value)}
                className="w-full rounded border border-border bg-surface p-2 text-xs focus:border-teal focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleDispatch}
              className="rounded-lg bg-teal px-5 py-2.5 font-bold text-white hover:bg-teal-hover transition-colors shadow-sm flex items-center gap-2"
            >
              <Truck className="h-4 w-4" />
              <span>Konfirmasi Dispatch (Kirim Barang)</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. RECEIVING PANEL */}
      {(transfer.status === 'IN_TRANSIT' || transfer.status === 'PARTIALLY_RECEIVED') && (
        <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-5 shadow-sm text-xs">
          <div className="flex items-center gap-2 mb-2 text-purple-900 font-bold text-sm">
            <CheckCircle2 className="h-5 w-5 text-purple-600" />
            <span>Penerimaan Barang — Gudang Site Tujuan ({dstSite?.name})</span>
          </div>
          <p className="text-text-secondary mb-4">
            Periksa kuantitas fisik yang tiba di site tujuan. Anda dapat menerima secara penuh
            (Completed) atau mencatat penerimaan sebagian (Partially Received) jika terdapat
            selisih/kerusakan.
          </p>

          <div className="space-y-4 max-w-xl">
            {transfer.lines.map((line) => {
              const item = items.find((i) => i.id === line.itemId);
              const dispatched = line.dispatchedQty ?? line.requestedQty;
              const currentVal = receivedQtys[line.itemId] ?? dispatched;

              return (
                <div
                  key={line.itemId}
                  className="rounded-lg border border-border bg-surface p-3 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-navy block">{item?.name}</span>
                    <span className="text-[11px] text-slate-500">
                      Dikirim dari site asal: <strong>{dispatched}</strong> {item?.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-slate-500 font-medium">Qty Diterima:</label>
                    <input
                      type="number"
                      min="0"
                      max={dispatched}
                      value={currentVal}
                      onChange={(e) =>
                        setReceivedQtys({
                          ...receivedQtys,
                          [line.itemId]: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-20 rounded border border-border p-1.5 text-xs text-right font-bold tabular-nums focus:border-teal focus:outline-none"
                    />
                    <span className="text-slate-500 font-medium">{item?.unit}</span>
                  </div>
                </div>
              );
            })}

            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Catatan Penerimaan / Berita Acara Selisih
              </label>
              <input
                type="text"
                placeholder="Kondisi barang, catatan bila ada part yang tertinggal atau rusak..."
                value={receiptNote}
                onChange={(e) => setReceiptNote(e.target.value)}
                className="w-full rounded border border-border bg-surface p-2 text-xs focus:border-teal focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleReceive}
              className="rounded-lg bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Konfirmasi Penerimaan Barang di Site</span>
            </button>
          </div>
        </div>
      )}

      {/* Activity Timeline Audit Trail */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <h3 className="font-bold text-navy text-sm mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-teal" />
          <span>Timeline Aktivitas & Audit Trail Transfer</span>
        </h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {transfer.events.map((evt, idx) => {
            const actor = users.find((u) => u.id === evt.actorId);

            return (
              <div key={evt.id || idx} className="relative">
                <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-teal shadow-sm" />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-navy text-xs uppercase tracking-wide">
                    {evt.type}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(evt.timestamp).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Dilakukan oleh: <strong className="text-text-primary">{actor?.name || 'Sistem'}</strong> (
                  {actor?.role})
                </div>
                {evt.note && (
                  <div className="mt-1 rounded bg-slate-50 p-2 text-xs text-slate-700 border border-slate-100">
                    {evt.note}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
