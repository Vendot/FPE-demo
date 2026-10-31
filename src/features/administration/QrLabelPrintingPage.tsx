import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '@/app/providers/AppContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Printer, CheckSquare, Square, QrCode, Info, Package } from 'lucide-react';
import QRCodeLib from 'qrcode';

interface ItemQrCardProps {
  item: import('@/domain/types').Item;
  categoryName: string;
}

const ItemQrCard: React.FC<ItemQrCardProps> = ({ item, categoryName }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    QRCodeLib.toDataURL(item.qrValue || `FPE:ITEM:${item.code}`, {
      width: 130,
      margin: 1,
      color: { dark: '#17324D', light: '#FFFFFF' },
    }).then(setQrUrl).catch(console.error);
  }, [item]);

  return (
    <div className="rounded-xl border-2 border-slate-300 bg-white p-4 shadow-sm break-inside-avoid print:border-black print:shadow-none flex flex-col justify-between">
      <div className="flex items-start justify-between border-b pb-2 mb-2">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block">
            PT FPE — WAREHOUSE
          </span>
          <h4 className="font-bold text-navy text-sm leading-tight mt-0.5">{item.name}</h4>
        </div>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 font-mono">
          {item.unit}
        </span>
      </div>

      <div className="flex items-center gap-3 my-2">
        <div className="shrink-0 bg-white p-1 rounded border border-slate-200">
          {qrUrl ? (
            <img src={qrUrl} alt={`QR ${item.code}`} className="h-24 w-24 object-contain" />
          ) : (
            <div className="h-24 w-24 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
              Generating...
            </div>
          )}
        </div>
        <div className="space-y-1 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Kode Item:</span>
            <span className="font-mono font-bold text-navy text-sm">{item.code}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Part Number:</span>
            <span className="font-mono font-bold text-slate-700">{item.partNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Kategori:</span>
            <span className="text-slate-600 font-medium">{categoryName}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t text-[9px] text-slate-400 flex items-center justify-between font-mono">
        <span>FPE-TAG-V1</span>
        <span>SCAN VIA INDUSTRIAL TERMINAL</span>
      </div>
    </div>
  );
};

export const QrLabelPrintingPage: React.FC = () => {
  const { items, categories } = useApp();
  const [searchParams] = useSearchParams();
  const preselectedItemId = searchParams.get('item');

  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (preselectedItemId && items.some((i) => i.id === preselectedItemId)) {
      return [preselectedItemId];
    }
    return items.map((i) => i.id);
  });

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedItems = items.filter((i) => selectedIds.includes(i.id));

  return (
    <div className="space-y-6">
      <div className="no-print">
        <PageHeader
          title="Cetak Label QR Suku Cadang"
          subtitle="Generate dan cetak label identitas inventaris untuk penempelan fisik pada rak atau kemasan material"
          actions={
            <button
              disabled={selectedItems.length === 0}
              onClick={handlePrint}
              className="rounded-lg bg-teal px-4 py-2 text-xs font-bold text-white hover:bg-teal-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak / Simpan PDF ({selectedItems.length} Label)</span>
            </button>
          }
        />
      </div>

      {/* Item selector bar (Hidden in print) */}
      <div className="no-print rounded-xl border border-border bg-surface p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="font-semibold text-teal hover:underline flex items-center gap-1"
            >
              {selectedIds.length === items.length ? (
                <>
                  <CheckSquare className="h-4 w-4" />
                  <span>Batalkan Semua</span>
                </>
              ) : (
                <>
                  <Square className="h-4 w-4" />
                  <span>Pilih Semua Item ({items.length})</span>
                </>
              )}
            </button>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">
              Terpilih: <strong>{selectedIds.length}</strong> item
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Info className="h-3.5 w-3.5 text-teal" />
            <span>Format label dioptimalkan untuk kertas stiker / print thermal A4</span>
          </div>
        </div>

        {/* Checkbox pills */}
        <div className="flex flex-wrap gap-2">
          {items.map((item) => {
            const isChecked = selectedIds.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleToggle(item.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors flex items-center gap-1.5 border ${
                  isChecked
                    ? 'bg-teal/10 border-teal text-teal font-semibold'
                    : 'bg-surface border-border text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{item.code}</span>
                <span className="text-slate-400">—</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Printable Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 print:grid-cols-2 print:gap-4">
        {selectedItems.map((item) => {
          const category = categories.find((c) => c.id === item.categoryId);
          return (
            <ItemQrCard
              key={item.id}
              item={item}
              categoryName={category?.name || 'Suku Cadang'}
            />
          );
        })}
      </div>
    </div>
  );
};
