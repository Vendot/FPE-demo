import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/app/providers/AppContext';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  AlertCircle,
  Building,
  CheckCircle2,
  Package,
} from 'lucide-react';

export const CreateTransferPage: React.FC = () => {
  const { sites, items, stockBalances, requestTransfer } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Initial values from query params if requested from item detail
  const initialSource = searchParams.get('sourceSiteId') || sites[1].id; // Default Site 02
  const initialDest = searchParams.get('destinationSiteId') || sites[0].id; // Default Site 01
  const initialItem = searchParams.get('itemId') || items[0].id;

  const [sourceSiteId, setSourceSiteId] = useState(initialSource);
  const [destinationSiteId, setDestinationSiteId] = useState(initialDest);
  const [reason, setReason] = useState('');
  const [lines, setLines] = useState<Array<{ itemId: string; requestedQty: number }>>([
    { itemId: initialItem, requestedQty: 1 },
  ]);
  const [error, setError] = useState<string | null>(null);

  // Validate when source equals destination
  const isSameSite = sourceSiteId === destinationSiteId;

  const handleAddLine = () => {
    // Pick first item not already in lines or default to first item
    const unusedItem = items.find((i) => !lines.some((l) => l.itemId === i.id)) || items[0];
    setLines([...lines, { itemId: unusedItem.id, requestedQty: 1 }]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length > 1) {
      setLines(lines.filter((_, idx) => idx !== index));
    }
  };

  const handleLineChange = (index: number, field: 'itemId' | 'requestedQty', value: any) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSameSite) {
      setError('Site asal (Source) dan site tujuan (Destination) tidak boleh sama.');
      return;
    }

    if (!reason.trim()) {
      setError('Alasan atau keperluan transfer wajib diisi.');
      return;
    }

    // Validate quantities against source on-hand
    for (const line of lines) {
      if (line.requestedQty <= 0) {
        setError('Kuantitas transfer untuk setiap item harus lebih dari 0.');
        return;
      }
      const bal = stockBalances.find((b) => b.itemId === line.itemId && b.siteId === sourceSiteId);
      const onHand = bal ? bal.onHand : 0;
      if (line.requestedQty > onHand) {
        const itemObj = items.find((i) => i.id === line.itemId);
        setError(
          `Kuantitas ${itemObj?.name} (${line.requestedQty}) melebihi stok tersedia di site asal (${onHand} ${itemObj?.unit}).`
        );
        return;
      }
    }

    const res = requestTransfer({
      sourceSiteId,
      destinationSiteId,
      lines,
      reason,
    });

    if (!res.success) {
      setError(res.error || 'Gagal mengajukan permintaan transfer');
    } else if (res.transfer) {
      navigate(`/transfers/${res.transfer.id}`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <button
          onClick={() => navigate('/transfers')}
          className="mb-2 text-xs font-semibold text-teal hover:text-teal-hover flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Daftar Transfer</span>
        </button>
        <PageHeader
          title="Pengajuan Transfer Antar-Site Baru"
          subtitle="Form permohonan pemindahan suku cadang antar gudang operasional (Draft & Approval workflow)"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 shadow-sm">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
          <div className="font-medium">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Source and Destination Section */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <h3 className="font-bold text-navy text-sm mb-4 flex items-center gap-2">
            <Building className="h-4 w-4 text-teal" />
            <span>Rute Site Pengiriman</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Source Site */}
            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Site Asal (Sumber Stok / Pengirim) <span className="text-rose-500">*</span>
              </label>
              <select
                value={sourceSiteId}
                onChange={(e) => setSourceSiteId(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface p-2.5 text-xs font-medium focus:border-teal focus:outline-none"
              >
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code}) — {s.locationLabel}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Site */}
            <div>
              <label className="block font-semibold text-text-primary mb-1">
                Site Tujuan (Penerima Stok) <span className="text-rose-500">*</span>
              </label>
              <select
                value={destinationSiteId}
                onChange={(e) => setDestinationSiteId(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface p-2.5 text-xs font-medium focus:border-teal focus:outline-none"
              >
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code}) — {s.locationLabel}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isSameSite && (
            <p className="mt-2 text-[11px] font-semibold text-rose-600">
              Perhatian: Site asal dan site tujuan tidak boleh sama.
            </p>
          )}
        </div>

        {/* Item Lines Section */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <h3 className="font-bold text-navy text-sm flex items-center gap-2">
              <Package className="h-4 w-4 text-teal" />
              <span>Daftar Item & Kuantitas yang Diminta</span>
            </h3>
            <button
              type="button"
              onClick={handleAddLine}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-teal hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Baris Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {lines.map((line, idx) => {
              const selectedItemObj = items.find((i) => i.id === line.itemId);
              const sourceBal = stockBalances.find(
                (b) => b.itemId === line.itemId && b.siteId === sourceSiteId
              );
              const onHand = sourceBal ? sourceBal.onHand : 0;
              const isOver = line.requestedQty > onHand;

              return (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center rounded-lg border border-border p-3 bg-slate-50/50"
                >
                  {/* Item selector */}
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Pilih Item #{idx + 1}
                    </label>
                    <select
                      value={line.itemId}
                      onChange={(e) => handleLineChange(idx, 'itemId', e.target.value)}
                      className="w-full rounded-md border border-border bg-surface p-2 text-xs focus:border-teal focus:outline-none"
                    >
                      {items.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.code} — {i.name} ({i.partNumber})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Available Stock Info */}
                  <div className="sm:col-span-3 text-center sm:text-left">
                    <span className="block text-[11px] text-slate-500">Stok Asal Tersedia:</span>
                    <span className="font-bold text-navy tabular-nums">
                      {onHand} {selectedItemObj?.unit}
                    </span>
                  </div>

                  {/* Requested Qty */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Kuantitas
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={onHand > 0 ? onHand : undefined}
                      value={line.requestedQty}
                      onChange={(e) =>
                        handleLineChange(idx, 'requestedQty', parseInt(e.target.value) || 0)
                      }
                      className={`w-full rounded-md border p-2 text-xs font-bold text-right tabular-nums focus:outline-none ${
                        isOver
                          ? 'border-rose-500 bg-rose-50 text-rose-700'
                          : 'border-border focus:border-teal'
                      }`}
                    />
                  </div>

                  {/* Remove line */}
                  <div className="sm:col-span-1 flex justify-center sm:pt-4">
                    <button
                      type="button"
                      disabled={lines.length === 1}
                      onClick={() => handleRemoveLine(idx)}
                      className="rounded p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-slate-400"
                      title="Hapus baris"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Business Reason */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <label className="block font-bold text-navy text-sm mb-1">
            Alasan Kebutuhan Operasional <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-text-secondary mb-2">
            Jelaskan unit alat berat yang membutuhkan suku cadang atau proyek darurat di site tujuan
          </p>
          <textarea
            rows={3}
            placeholder="Contoh: Kebutuhan darurat penggantian hydraulic filter unit excavator EX-200 di Site 01 untuk menghindari downtime..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg border border-border p-2.5 text-xs focus:border-teal focus:outline-none"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/transfers')}
            className="rounded-lg border border-border px-4 py-2.5 font-semibold text-text-secondary hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSameSite}
            className={`rounded-lg px-6 py-2.5 font-bold text-white shadow-sm transition-colors ${
              isSameSite ? 'bg-slate-400 cursor-not-allowed' : 'bg-teal hover:bg-teal-hover'
            }`}
          >
            Ajukan Permintaan Transfer (Kirim ke Approver)
          </button>
        </div>
      </form>
    </div>
  );
};
