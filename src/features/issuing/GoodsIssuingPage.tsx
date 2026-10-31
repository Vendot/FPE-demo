import React, { useState } from 'react';
import { useApp } from '@/app/providers/AppContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { SiteBadge, StatusBadge } from '@/components/data-display/StatusBadge';
import { ArrowUpFromLine, CheckCircle2, AlertCircle, AlertTriangle, Minus } from 'lucide-react';

export const GoodsIssuingPage: React.FC = () => {
  const { sites, items, stockBalances, transactions, recordIssue, isOffline } = useApp();

  const [siteId, setSiteId] = useState(sites[0].id);
  const [itemId, setItemId] = useState(items[0].id);
  const [quantity, setQuantity] = useState<number>(1);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [note, setNote] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const selectedItem = items.find((i) => i.id === itemId);
  const currentBal = stockBalances.find((b) => b.itemId === itemId && b.siteId === siteId);
  const onHand = currentBal ? currentBal.onHand : 0;
  const isInsufficient = quantity > onHand;

  // Issuing history
  const issueHistory = transactions.filter((tx) => tx.type === 'GOODS_ISSUE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber.trim()) {
      setFeedback({ type: 'error', message: 'Nomor Work Order / Referensi wajib diisi' });
      return;
    }
    if (quantity <= 0) {
      setFeedback({ type: 'error', message: 'Kuantitas pengeluaran harus lebih dari 0' });
      return;
    }
    if (quantity > onHand) {
      setFeedback({
        type: 'error',
        message: `Kuantitas (${quantity}) melebihi stok tersedia (${onHand} ${selectedItem?.unit}). Pengeluaran stok negatif dicegah oleh sistem.`,
      });
      return;
    }

    const res = recordIssue({
      siteId,
      itemId,
      quantity,
      referenceNumber,
      note,
    });

    if (!res.success) {
      setFeedback({ type: 'error', message: res.error || 'Gagal mencatat pengeluaran barang' });
    } else {
      setFeedback({
        type: 'success',
        message: isOffline
          ? `Pengeluaran ${quantity} ${selectedItem?.unit} dicatat lokal (Mode Offline - Pending Sync).`
          : `Pengeluaran ${quantity} ${selectedItem?.unit} berhasil dicatat. Stok on-hand telah dikurangi.`,
      });
      setReferenceNumber('');
      setNote('');
      setQuantity(1);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengeluaran Barang (Goods Issuing / Outbound)"
        subtitle="Pencatatan pemakaian suku cadang dan material untuk unit alat berat atau operasional lapangan"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issuing Form */}
        <div className="lg:col-span-1 rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <ArrowUpFromLine className="h-5 w-5 text-amber-600" />
            <h3 className="font-bold text-navy text-sm">Form Catat Barang Keluar</h3>
          </div>

          {feedback && (
            <div
              className={`mb-4 flex items-start gap-2.5 rounded-lg p-3 text-xs ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              )}
              <div className="flex-1 font-medium">{feedback.message}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Site Selector */}
            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Gudang Site Sumber <span className="text-rose-500">*</span>
              </label>
              <select
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface p-2 text-xs focus:border-teal focus:outline-none"
              >
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Item Selector */}
            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Pilih Item / Suku Cadang <span className="text-rose-500">*</span>
              </label>
              <select
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface p-2 text-xs focus:border-teal focus:outline-none"
              >
                {items.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.code} — {i.name} ({i.partNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* Available Stock Warning Box */}
            <div
              className={`rounded-lg p-3 border text-xs flex items-center justify-between ${
                onHand === 0
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : onHand <= 2
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-slate-50 border-border text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Stok On-Hand Tersedia:</span>
              </div>
              <span className="font-bold text-sm tabular-nums">
                {onHand} {selectedItem?.unit}
              </span>
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Kuantitas Keluar <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max={onHand > 0 ? onHand : undefined}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className={`w-full rounded-lg border p-2 text-xs focus:outline-none font-bold ${
                    isInsufficient
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-border focus:border-teal'
                  }`}
                  required
                />
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 border border-border">
                  {selectedItem?.unit}
                </span>
              </div>
              {isInsufficient && (
                <p className="mt-1 text-[11px] font-semibold text-rose-600">
                  Melebihi stok tersedia ({onHand} {selectedItem?.unit}).
                </p>
              )}
            </div>

            {/* Purpose / Reference */}
            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Keperluan / No. Work Order (WO) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: WO-2026-884 / Unit Excavator EX-02"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full rounded-lg border border-border p-2 text-xs focus:border-teal focus:outline-none"
                required
              />
            </div>

            {/* Note */}
            <div>
              <label className="block font-semibold text-text-primary mb-1">Catatan Tambahan</label>
              <textarea
                rows={2}
                placeholder="Teknisi pemohon, nomor lambung alat, lokasi PIT..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-lg border border-border p-2 text-xs focus:border-teal focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={onHand === 0}
              className={`w-full rounded-lg py-2.5 font-bold text-white transition-colors shadow-sm flex items-center justify-center gap-1.5 ${
                onHand === 0
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              <Minus className="h-4 w-4" />
              <span>
                {onHand === 0
                  ? 'Stok Kosong — Tidak Dapat Dikeluarkan'
                  : isOffline
                  ? 'Simpan Lokal (Mode Offline)'
                  : 'Simpan Pengeluaran Barang'}
              </span>
            </button>
          </form>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <div>
              <h3 className="font-bold text-navy text-sm">Riwayat Dokumen Pengeluaran Barang</h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Audit trail pengeluaran material untuk keperluan pemeliharaan dan operasional
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              {issueHistory.length} Transaksi
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-slate-50/75 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">No. Transaksi / WO</th>
                  <th className="py-2.5 px-3">Item Suku Cadang</th>
                  <th className="py-2.5 px-3">Site Asal</th>
                  <th className="py-2.5 px-3 text-right">Kuantitas</th>
                  <th className="py-2.5 px-3">Waktu</th>
                  <th className="py-2.5 px-3 text-center">Status Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {issueHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Belum ada catatan pengeluaran barang.
                    </td>
                  </tr>
                ) : (
                  issueHistory.map((tx) => {
                    const item = items.find((i) => i.id === tx.itemId);
                    const site = sites.find((s) => s.id === tx.siteId);

                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="font-mono font-bold text-navy">{tx.transactionNumber}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{tx.referenceNumber}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-navy">{item?.name}</div>
                          <div className="text-[10px] font-mono text-slate-400">{item?.partNumber}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <SiteBadge siteCode={site?.code || ''} siteName={site?.name} />
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-rose-700 tabular-nums text-sm">
                          -{tx.quantity} {item?.unit}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">
                          {new Date(tx.createdAt).toLocaleString('id-ID')}
                        </td>
                        <td className="py-2.5 px-3 text-center">
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
    </div>
  );
};
