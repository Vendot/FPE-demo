import React, { useState } from 'react';
import { useApp } from '@/app/providers/AppContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { SiteBadge, StatusBadge } from '@/components/data-display/StatusBadge';
import { ArrowDownToLine, CheckCircle2, AlertCircle, Clock, Plus } from 'lucide-react';

export const GoodsReceivingPage: React.FC = () => {
  const { sites, items, stockBalances, transactions, recordReceipt, isOffline } = useApp();

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

  // Receiving history
  const receiptHistory = transactions.filter((tx) => tx.type === 'GOODS_RECEIPT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceNumber.trim()) {
      setFeedback({ type: 'error', message: 'Nomor referensi / Surat Jalan wajib diisi' });
      return;
    }
    if (quantity <= 0) {
      setFeedback({ type: 'error', message: 'Kuantitas penerimaan harus lebih dari 0' });
      return;
    }

    const res = recordReceipt({
      siteId,
      itemId,
      quantity,
      referenceNumber,
      note,
    });

    if (!res.success) {
      setFeedback({ type: 'error', message: res.error || 'Gagal menyimpan penerimaan barang' });
    } else {
      setFeedback({
        type: 'success',
        message: isOffline
          ? `Penerimaan ${quantity} ${selectedItem?.unit} dicatat lokal (Mode Offline - Pending Sync).`
          : `Penerimaan ${quantity} ${selectedItem?.unit} berhasil dicatat. Saldo on-hand telah diperbarui.`,
      });
      setReferenceNumber('');
      setNote('');
      setQuantity(1);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Penerimaan Barang (Goods Receiving / Inbound)"
        subtitle="Pencatatan material dan suku cadang masuk dari supplier atau vendor ke gudang site"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Receiving Form */}
        <div className="lg:col-span-1 rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <ArrowDownToLine className="h-5 w-5 text-teal" />
            <h3 className="font-bold text-navy text-sm">Form Catat Barang Masuk</h3>
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
                Gudang Site Tujuan <span className="text-rose-500">*</span>
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

            {/* Current Stock Context */}
            <div className="rounded-lg bg-slate-50 p-2.5 border border-border/80 flex items-center justify-between text-slate-600">
              <span>Saldo On-Hand Saat Ini di Site:</span>
              <span className="font-bold text-navy tabular-nums text-sm">
                {onHand} {selectedItem?.unit}
              </span>
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Kuantitas Diterima <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border border-border p-2 text-xs focus:border-teal focus:outline-none font-bold"
                  required
                />
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 border border-border">
                  {selectedItem?.unit}
                </span>
              </div>
            </div>

            {/* Reference */}
            <div>
              <label className="block font-semibold text-text-primary mb-1">
                No. Referensi (Surat Jalan / PO) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: SJ-PO-9921 / PO-2026-104"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full rounded-lg border border-border p-2 text-xs focus:border-teal focus:outline-none"
                required
              />
            </div>

            {/* Note */}
            <div>
              <label className="block font-semibold text-text-primary mb-1">Catatan Penerimaan</label>
              <textarea
                rows={2}
                placeholder="Kondisi kemasan, nama driver vendor, dll..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-lg border border-border p-2 text-xs focus:border-teal focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-teal py-2.5 font-bold text-white hover:bg-teal-hover transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>{isOffline ? 'Simpan Lokal (Mode Offline)' : 'Simpan Penerimaan Barang'}</span>
            </button>
          </form>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <div>
              <h3 className="font-bold text-navy text-sm">Riwayat Dokumen Penerimaan Barang</h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Audit trail dokumen penerimaan barang di seluruh site
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              {receiptHistory.length} Transaksi
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-slate-50/75 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">No. Transaksi / Ref</th>
                  <th className="py-2.5 px-3">Item Suku Cadang</th>
                  <th className="py-2.5 px-3">Site Penerima</th>
                  <th className="py-2.5 px-3 text-right">Kuantitas</th>
                  <th className="py-2.5 px-3">Waktu</th>
                  <th className="py-2.5 px-3 text-center">Status Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {receiptHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Belum ada catatan penerimaan barang.
                    </td>
                  </tr>
                ) : (
                  receiptHistory.map((tx) => {
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
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-700 tabular-nums text-sm">
                          +{tx.quantity} {item?.unit}
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
