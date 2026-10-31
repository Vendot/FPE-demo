import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/app/providers/AppContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge, SiteBadge } from '@/components/data-display/StatusBadge';
import {
  ArrowLeft,
  QrCode,
  ArrowLeftRight,
  TrendingDown,
  Building,
  History,
  Info,
  Package,
} from 'lucide-react';
import QRCodeLib from 'qrcode';

export const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { items, categories, sites, stockBalances, transfers, transactions } = useApp();
  const navigate = useNavigate();

  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const item = items.find((i) => i.id === id);
  const category = categories.find((c) => c.id === item?.categoryId);

  // Generate QR Data URL
  useEffect(() => {
    if (item) {
      QRCodeLib.toDataURL(item.qrValue || `FPE:${item.code}`, {
        width: 140,
        margin: 1,
        color: { dark: '#17324D', light: '#FFFFFF' },
      }).then(setQrDataUrl).catch(console.error);
    }
  }, [item]);

  if (!item) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-lg font-bold text-navy">Item tidak ditemukan</h2>
        <button
          onClick={() => navigate('/inventory/items')}
          className="mt-4 text-xs font-semibold text-teal hover:underline"
        >
          &larr; Kembali ke Daftar Item
        </button>
      </div>
    );
  }

  // Stock balances across all 6 sites
  const balancesBySite = sites.map((site) => {
    const bal = stockBalances.find((b) => b.itemId === item.id && b.siteId === site.id);
    const onHand = bal ? bal.onHand : 0;
    const minStock = bal ? bal.minimumStock : 0;
    const inTransitIn = bal ? bal.inTransitIn : 0;
    const inTransitOut = bal ? bal.inTransitOut : 0;
    const isLow = onHand <= minStock && minStock > 0;
    const isZero = onHand === 0;

    return {
      site,
      onHand,
      minStock,
      inTransitIn,
      inTransitOut,
      isLow,
      isZero,
    };
  });

  const totalOnHand = balancesBySite.reduce((sum, b) => sum + b.onHand, 0);
  const totalInTransitIn = balancesBySite.reduce((sum, b) => sum + b.inTransitIn, 0);

  // Related transfers
  const relatedTransfers = transfers.filter((t) =>
    t.lines.some((l) => l.itemId === item.id)
  );

  // Related transactions
  const itemTransactions = transactions.filter((tx) => tx.itemId === item.id).slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Back button and page title */}
      <div>
        <button
          onClick={() => navigate('/inventory/items')}
          className="mb-2 text-xs font-semibold text-teal hover:text-teal-hover flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Master Item</span>
        </button>
        <PageHeader
          title={item.name}
          subtitle={`Part Number: ${item.partNumber} • Kode Item: ${item.code}`}
          badge={
            <span className="rounded-md bg-teal/10 px-2 py-0.5 text-xs font-semibold text-teal">
              {category?.name}
            </span>
          }
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/transfers/new?itemId=${item.id}`)}
                className="rounded-lg bg-teal px-3 py-2 text-xs font-semibold text-white hover:bg-teal-hover transition-colors shadow-sm flex items-center gap-1.5"
              >
                <ArrowLeftRight className="h-4 w-4" />
                <span>Minta Transfer Item Ini</span>
              </button>
              <button
                onClick={() => navigate(`/admin/qr-labels?item=${item.id}`)}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-navy hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <QrCode className="h-4 w-4 text-teal" />
                <span>Cetak Label QR</span>
              </button>
            </div>
          }
        />
      </div>

      {/* Top Details Card & QR Code Display */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 rounded-xl border border-border bg-surface p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-navy uppercase tracking-wider text-[11px] text-slate-400">
            Informasi Spesifikasi Teknis
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            {item.description || 'Tidak ada deskripsi tambahan.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-border/80 text-xs">
            <div>
              <span className="block text-slate-400 text-[11px]">Satuan Ukur (UOM)</span>
              <span className="font-bold text-navy mt-0.5 block">{item.unit}</span>
            </div>
            <div>
              <span className="block text-slate-400 text-[11px]">Total On-Hand 6 Site</span>
              <span className="font-bold text-teal mt-0.5 block text-sm">
                {totalOnHand} {item.unit}
              </span>
            </div>
            <div>
              <span className="block text-slate-400 text-[11px]">Total Dalam Perjalanan</span>
              <span className="font-bold text-purple-700 mt-0.5 block text-sm">
                {totalInTransitIn} {item.unit}
              </span>
            </div>
            <div>
              <span className="block text-slate-400 text-[11px]">Status Ketersediaan</span>
              <span className="mt-0.5 block">
                {totalOnHand > 0 ? (
                  <span className="text-emerald-700 font-semibold text-xs">Tersedia di Gudang</span>
                ) : (
                  <span className="text-rose-600 font-semibold text-xs">Stok Habis Total</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-inner">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt={`QR Code ${item.code}`} className="h-28 w-28" />
            ) : (
              <div className="h-28 w-28 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                Generating...
              </div>
            )}
          </div>
          <div className="mt-2 font-mono text-[11px] font-bold text-navy">{item.code}</div>
          <div className="text-[10px] text-slate-400">Identifikasi Standar FPE</div>
        </div>
      </div>

      {/* Cross-Site Inventory Breakdown Table (The core multi-site story) */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-navy flex items-center gap-2">
              <Building className="h-4 w-4 text-teal" />
              <span>Sebaran Stok di 6 Site Operasional</span>
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Perbandingan saldo fisik (On-Hand) dan stok minimum untuk mendeteksi ketimpangan distribusi antar lokasi
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-slate-50/75 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Site & Lokasi</th>
                <th className="py-3 px-4 text-right">Saldo On-Hand</th>
                <th className="py-3 px-4 text-right">Batas Minimum</th>
                <th className="py-3 px-4 text-right">Sedang Dikirim (In-Transit)</th>
                <th className="py-3 px-4 text-center">Status Operasional</th>
                <th className="py-3 px-4 text-center">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {balancesBySite.map(({ site, onHand, minStock, inTransitIn, inTransitOut, isLow, isZero }) => (
                <tr key={site.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy">{site.name}</span>
                      <SiteBadge siteCode={site.code} />
                    </div>
                    <span className="text-[11px] text-slate-400">{site.locationLabel}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-navy tabular-nums text-sm">
                    {onHand} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 tabular-nums font-medium">
                    {minStock} {item.unit}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 tabular-nums">
                    {inTransitIn > 0 && (
                      <span className="text-emerald-700 font-semibold">+{inTransitIn} masuk</span>
                    )}
                    {inTransitIn > 0 && inTransitOut > 0 && ' • '}
                    {inTransitOut > 0 && (
                      <span className="text-amber-700 font-semibold">-{inTransitOut} keluar</span>
                    )}
                    {inTransitIn === 0 && inTransitOut === 0 && '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {isZero ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                        Kosong
                      </span>
                    ) : isLow ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-300">
                        <TrendingDown className="h-3 w-3" />
                        Di Bawah Min ({onHand}/{minStock})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                        Aman
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {isLow ? (
                      <button
                        onClick={() =>
                          navigate(`/transfers/new?destinationSiteId=${site.id}&itemId=${item.id}`)
                        }
                        className="rounded bg-teal/10 px-2.5 py-1 text-[11px] font-semibold text-teal hover:bg-teal hover:text-white transition-colors"
                      >
                        Minta Pasokan
                      </button>
                    ) : onHand > minStock ? (
                      <button
                        onClick={() =>
                          navigate(`/transfers/new?sourceSiteId=${site.id}&itemId=${item.id}`)
                        }
                        className="rounded border border-border px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Kirim ke Site Lain
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement and Transfer History for this item */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Related Transfers */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <h3 className="text-sm font-bold text-navy flex items-center gap-2 mb-3">
            <ArrowLeftRight className="h-4 w-4 text-teal" />
            <span>Riwayat Transfer Terkait</span>
          </h3>
          {relatedTransfers.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              Belum ada riwayat transfer untuk item ini.
            </p>
          ) : (
            <div className="space-y-2.5">
              {relatedTransfers.map((trf) => (
                <div
                  key={trf.id}
                  onClick={() => navigate(`/transfers/${trf.id}`)}
                  className="rounded-lg border border-border p-3 hover:border-teal hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-navy">
                      {trf.transferNumber}
                    </span>
                    <StatusBadge status={trf.status} />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-slate-600">
                    <span>
                      {sites.find((s) => s.id === trf.sourceSiteId)?.code} &rarr;{' '}
                      {sites.find((s) => s.id === trf.destinationSiteId)?.code}
                    </span>
                    <span className="font-medium text-slate-500">
                      {new Date(trf.requestedAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Ledger Audit Trail */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <h3 className="text-sm font-bold text-navy flex items-center gap-2 mb-3">
            <History className="h-4 w-4 text-teal" />
            <span>Mutasi Terakhir di Buku Besar (Ledger)</span>
          </h3>
          {itemTransactions.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              Belum ada riwayat mutasi untuk item ini.
            </p>
          ) : (
            <div className="space-y-2 text-xs">
              {itemTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-lg border border-border/70 p-2.5"
                >
                  <div>
                    <div className="font-semibold text-navy flex items-center gap-1.5">
                      <span>{tx.type.replace('_', ' ')}</span>
                      <SiteBadge siteCode={sites.find((s) => s.id === tx.siteId)?.code || ''} />
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(tx.createdAt).toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div className="text-right font-bold tabular-nums">
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
                      {tx.quantity} {item.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
