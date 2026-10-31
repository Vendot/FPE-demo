import React from 'react';
import clsx from 'clsx';
import { TransferStatus, SyncStatus, StockCountStatus } from '@/domain/types';

interface StatusBadgeProps {
  status:
    | TransferStatus
    | SyncStatus
    | StockCountStatus
    | 'LOW_STOCK'
    | 'NORMAL'
    | 'OUT_OF_STOCK';
  labelOverride?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, labelOverride }) => {
  let label: string = labelOverride || status;
  let bgClass = 'bg-slate-100 text-slate-700';

  switch (status) {
    case 'DRAFT':
      label = labelOverride || 'Draft';
      bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
      break;
    case 'COUNTING':
      label = labelOverride || 'Sedang Dihitung';
      bgClass = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'SUBMITTED':
      label = labelOverride || 'Diajukan';
      bgClass = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'APPLIED':
      label = labelOverride || 'Diterapkan';
      bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      break;
    case 'PENDING_APPROVAL':
      label = labelOverride || 'Menunggu Approval';
      bgClass = 'bg-amber-50 text-amber-800 border-amber-300';
      break;
    case 'APPROVED':
      label = labelOverride || 'Disetujui';
      bgClass = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'REJECTED':
      label = labelOverride || 'Ditolak';
      bgClass = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'IN_TRANSIT':
      label = labelOverride || 'Dalam Pengiriman';
      bgClass = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
    case 'PARTIALLY_RECEIVED':
      label = labelOverride || 'Diterima Sebagian';
      bgClass = 'bg-amber-50 text-amber-700 border-amber-300';
      break;
    case 'COMPLETED':
      label = labelOverride || 'Selesai';
      bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      break;
    case 'CANCELLED':
      label = labelOverride || 'Dibatalkan';
      bgClass = 'bg-slate-100 text-slate-600 border-slate-200';
      break;
    case 'PENDING_SYNC':
      label = labelOverride || 'Menunggu Sinkronisasi';
      bgClass = 'bg-amber-50 text-amber-700 border-amber-300';
      break;
    case 'SYNCED':
      label = labelOverride || 'Tersinkronisasi';
      bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'CONFLICT':
      label = labelOverride || 'Perlu Rekonsiliasi';
      bgClass = 'bg-rose-50 text-rose-700 border-rose-300';
      break;
    case 'LOW_STOCK':
      label = labelOverride || 'Di Bawah Minimum';
      bgClass = 'bg-amber-50 text-amber-800 border-amber-300';
      break;
    case 'OUT_OF_STOCK':
      label = labelOverride || 'Stok Kosong (0)';
      bgClass = 'bg-rose-50 text-rose-800 border-rose-300';
      break;
    case 'NORMAL':
      label = labelOverride || 'Optimal';
      bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
        bgClass
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
};

export const SiteBadge: React.FC<{ siteCode: string; siteName?: string }> = ({
  siteCode,
  siteName,
}) => {
  return (
    <span
      className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-mono font-medium text-slate-700 border border-slate-200"
      title={siteName}
    >
      <span className="font-semibold text-teal">{siteCode}</span>
      {siteName && (
        <span className="font-sans text-slate-600 hidden sm:inline">{siteName.split(' ')[0]}</span>
      )}
    </span>
  );
};
