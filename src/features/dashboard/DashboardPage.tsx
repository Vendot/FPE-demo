import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/providers/AppContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { KpiCard } from '@/components/data-display/KpiCard';
import { StatusBadge, SiteBadge } from '@/components/data-display/StatusBadge';
import {
  Boxes,
  Package,
  AlertTriangle,
  Clock,
  Truck,
  ArrowRight,
  TrendingDown,
  Building,
  ArrowLeftRight,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    sites,
    items,
    stockBalances,
    transfers,
    transactions,
    selectedSiteId,
    metrics,
    lastSyncedTimestamp,
    isOffline,
  } = useApp();
  const navigate = useNavigate();

  const isFiltered = selectedSiteId !== 'ALL';
  const activeSite = sites.find((s) => s.id === selectedSiteId);

  // Filter balances based on site selection
  const relevantBalances = isFiltered
    ? stockBalances.filter((b) => b.siteId === selectedSiteId)
    : stockBalances;

  // Identify low-stock items
  const lowStockBalances = relevantBalances.filter((b) => b.onHand <= b.minimumStock);

  // Transfers needing attention
  const pendingTransfers = transfers.filter(
    (t) =>
      (!isFiltered || t.sourceSiteId === selectedSiteId || t.destinationSiteId === selectedSiteId) &&
      t.status === 'PENDING_APPROVAL'
  );

  const inTransitTransfers = transfers.filter(
    (t) =>
      (!isFiltered || t.sourceSiteId === selectedSiteId || t.destinationSiteId === selectedSiteId) &&
      (t.status === 'IN_TRANSIT' || t.status === 'PARTIALLY_RECEIVED')
  );

  // Recent transactions (last 6)
  const recentTransactions = transactions
    .filter((tx) => !isFiltered || tx.siteId === selectedSiteId)
    .slice(0, 6);

  // Compute breakdown per site for 6 sites summary table
  const siteSummaries = sites.map((site) => {
    const siteBalances = stockBalances.filter((b) => b.siteId === site.id);
    const totalUnits = siteBalances.reduce((sum, b) => sum + b.onHand, 0);
    const lowStockCount = siteBalances.filter((b) => b.onHand <= b.minimumStock).length;
    const inTransitIn = siteBalances.reduce((sum, b) => sum + b.inTransitIn, 0);
    const inTransitOut = siteBalances.reduce((sum, b) => sum + b.inTransitOut, 0);

    return {
      site,
      totalUnits,
      lowStockCount,
      inTransitIn,
      inTransitOut,
      hasRisk: lowStockCount > 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Page Header with contextual subtitle */}
      <PageHeader
        title="Dashboard Operasional"
        subtitle={
          isFiltered
            ? `Menampilkan metrik stok & transfer khusus ${activeSite?.name} (${activeSite?.locationLabel})`
            : 'Ringkasan posisi stok konsolidasian lintas 6 site operasional Kalimantan Barat'
        }
        actions={
          <div className="flex items-center gap-2 text-xs text-text-secondary bg-surface border border-border rounded-lg px-3 py-1.5 shadow-sm">
            <Clock className="h-3.5 w-3.5 text-teal" />
            <span>
              Sinkronisasi Terakhir:{' '}
              <strong className="text-text-primary">
                {new Date(lastSyncedTimestamp).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </strong>
            </span>
            {isOffline && (
              <span className="ml-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                Stale (Offline)
              </span>
            )}
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total SKU Aktif"
          value={metrics.totalSkus}
          unit="SKU"
          icon={Boxes}
          subtext="Item master terdaftar"
          onClick={() => navigate('/inventory/items')}
        />
        <KpiCard
          label="Total Unit Tercatat"
          value={metrics.totalRecordedUnits.toLocaleString('id-ID')}
          unit="Unit Fisik"
          icon={Package}
          subtext={isFiltered ? `Di ${activeSite?.code}` : 'On-Hand di 6 Site'}
          onClick={() => navigate('/inventory/stock')}
        />
        <KpiCard
          label="Item di Bawah Minimum"
          value={metrics.lowStockCount}
          unit="Kombinasi"
          icon={AlertTriangle}
          subtext="Perlu re-order atau transfer"
          badge={metrics.lowStockCount > 0 ? 'Perhatian' : 'Aman'}
          badgeType={metrics.lowStockCount > 0 ? 'danger' : 'success'}
          onClick={() => navigate('/inventory/stock?filter=low-stock')}
        />
        <KpiCard
          label="Transfer Menunggu Action"
          value={metrics.pendingApprovalsCount + metrics.transfersInTransitCount}
          unit="Permintaan"
          icon={Truck}
          subtext={`${metrics.pendingApprovalsCount} Approval • ${metrics.transfersInTransitCount} In Transit`}
          badge={metrics.pendingApprovalsCount > 0 ? 'Pending' : undefined}
          badgeType="warning"
          onClick={() => navigate('/transfers')}
        />
      </div>

      {/* Operational Grids: Site Summary & Low Stock Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 6 Sites Status Overview Table */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                <Building className="h-4 w-4 text-teal" />
                <span>Ringkasan Stok Lintas 6 Site</span>
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Monitoring saldo on-hand dan risiko stok minimum per lokasi
              </p>
            </div>
            <button
              onClick={() => navigate('/inventory/stock')}
              className="text-xs font-semibold text-teal hover:text-teal-hover flex items-center gap-1"
            >
              <span>Lihat Detail Matrix</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-slate-500 font-semibold uppercase tracking-wider text-[11px] bg-slate-50/50">
                  <th className="py-2.5 px-3">Site Operasional</th>
                  <th className="py-2.5 px-3 text-right">Saldo On-Hand</th>
                  <th className="py-2.5 px-3 text-center">Status Risiko</th>
                  <th className="py-2.5 px-3 text-right">In-Transit (Masuk/Keluar)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {siteSummaries.map(({ site, totalUnits, lowStockCount, inTransitIn, inTransitOut }) => (
                  <tr
                    key={site.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    onClick={() => navigate(`/inventory/stock?siteId=${site.id}`)}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-navy">{site.name}</span>
                        <SiteBadge siteCode={site.code} />
                      </div>
                      <span className="text-[11px] text-slate-400">{site.locationLabel}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-navy tabular-nums">
                      {totalUnits.toLocaleString('id-ID')} unit
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {lowStockCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <TrendingDown className="h-3 w-3" />
                          {lowStockCount} Item Rendah
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Stok Aman
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600 font-medium tabular-nums">
                      <span className="text-emerald-700 font-bold">+{inTransitIn}</span> /{' '}
                      <span className="text-amber-700 font-bold">-{inTransitOut}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Urgent Low-Stock Alerts */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Peringatan Stok Minimum</span>
              </h3>
              <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                {lowStockBalances.length} Alert
              </span>
            </div>
            <p className="text-xs text-text-secondary mb-3">
              Item yang berada pada atau di bawah ambang minimum operasional
            </p>

            <div className="space-y-2.5 overflow-y-auto max-h-[300px] pr-1">
              {lowStockBalances.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Tidak ada item di bawah minimum stock saat ini.
                </div>
              ) : (
                lowStockBalances.map((b) => {
                  const item = items.find((i) => i.id === b.itemId);
                  const site = sites.find((s) => s.id === b.siteId);

                  return (
                    <div
                      key={b.id}
                      onClick={() => navigate(`/inventory/items/${b.itemId}`)}
                      className="rounded-lg border border-border p-2.5 hover:border-teal hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-navy truncate">
                          {item?.name}
                        </span>
                        <SiteBadge siteCode={site?.code || ''} />
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[11px]">
                        <span className="text-slate-500 font-mono">{item?.partNumber}</span>
                        <span className="font-bold text-rose-600 tabular-nums">
                          On-Hand: {b.onHand} / Min: {b.minimumStock} {item?.unit}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-3">
            <button
              onClick={() => navigate('/transfers/new')}
              className="w-full rounded-lg bg-teal px-3 py-2 text-xs font-semibold text-white hover:bg-teal-hover transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <span>Buat Transfer Antar-Site untuk Rebalance</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Transfer Status & Recent Transaction Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Transfer Movements */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4 text-teal" />
                <span>Aktivitas Transfer Terkini</span>
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Status perpindahan barang dari pengajuan hingga penerimaan
              </p>
            </div>
            <button
              onClick={() => navigate('/transfers')}
              className="text-xs font-semibold text-teal hover:text-teal-hover flex items-center gap-1"
            >
              <span>Semua Transfer</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {transfers.slice(0, 4).map((trf) => {
              const srcSite = sites.find((s) => s.id === trf.sourceSiteId);
              const dstSite = sites.find((s) => s.id === trf.destinationSiteId);

              return (
                <div
                  key={trf.id}
                  onClick={() => navigate(`/transfers/${trf.id}`)}
                  className="rounded-lg border border-border p-3 hover:border-teal hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-navy">
                      {trf.transferNumber}
                    </span>
                    <StatusBadge status={trf.status} />
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-text-primary">
                    <span className="font-semibold">{srcSite?.name.split(' ')[0]}</span>
                    <ArrowRight className="h-3 w-3 text-slate-400" />
                    <span className="font-semibold">{dstSite?.name.split(' ')[0]}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{trf.lines.length} item line</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 truncate">
                    {trf.reason}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transaction Log */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal" />
                <span>Transaksi Terakhir (Audit Trail)</span>
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Catatan mutasi stok keluar, masuk, dan transfer
              </p>
            </div>
            <button
              onClick={() => navigate('/reports/transactions')}
              className="text-xs font-semibold text-teal hover:text-teal-hover flex items-center gap-1"
            >
              <span>Lihat Ledger</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentTransactions.map((tx) => {
              const item = items.find((i) => i.id === tx.itemId);
              const site = sites.find((s) => s.id === tx.siteId);

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-lg border border-border/80 p-2.5 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        tx.direction === 'IN'
                          ? 'bg-emerald-500'
                          : tx.direction === 'OUT'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <div>
                      <div className="font-bold text-navy flex items-center gap-1.5">
                        <span>{tx.type.replace('_', ' ')}</span>
                        <SiteBadge siteCode={site?.code || ''} />
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item?.name} — {tx.referenceNumber || tx.transactionNumber}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-bold tabular-nums ${
                        tx.direction === 'IN'
                          ? 'text-emerald-700'
                          : tx.direction === 'OUT'
                          ? 'text-rose-700'
                          : 'text-blue-700'
                      }`}
                    >
                      {tx.direction === 'IN' ? '+' : tx.direction === 'OUT' ? '-' : '±'}
                      {tx.quantity} {item?.unit}
                    </span>
                    <div className="text-[10px] text-slate-400">
                      {new Date(tx.createdAt).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
