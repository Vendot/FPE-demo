import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/providers/AppContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { SiteBadge } from '@/components/data-display/StatusBadge';
import { Building, MapPin, Eye, ArrowRight, Layers } from 'lucide-react';

export const SitesPage: React.FC = () => {
  const { sites, stockBalances, setSelectedSiteId } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Site & Gudang Operasional"
        subtitle="Struktur 6 lokasi pergudangan site tambang dan hub logistik PT FAMOES PRATAMA ENGINEERING"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sites.map((site) => {
          const siteBalances = stockBalances.filter((b) => b.siteId === site.id);
          const totalUnits = siteBalances.reduce((sum, b) => sum + b.onHand, 0);
          const lowStockCount = siteBalances.filter((b) => b.onHand <= b.minimumStock).length;

          return (
            <div
              key={site.id}
              className="rounded-xl border border-border bg-surface p-5 shadow-sm hover:border-teal transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-border">
                  <div>
                    <h3 className="font-bold text-navy text-sm">{site.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                      <MapPin className="h-3 w-3 text-teal" />
                      <span>{site.locationLabel}</span>
                    </div>
                  </div>
                  <SiteBadge siteCode={site.code} />
                </div>

                <div className="grid grid-cols-2 gap-3 my-4 text-xs">
                  <div className="rounded-lg bg-slate-50 p-2.5">
                    <span className="text-[11px] text-slate-400 block">Total Unit On-Hand</span>
                    <span className="font-bold text-navy text-base tabular-nums mt-0.5 block">
                      {totalUnits.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2.5">
                    <span className="text-[11px] text-slate-400 block">Status Risiko Stok</span>
                    <span
                      className={`font-bold text-base tabular-nums mt-0.5 block ${
                        lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {lowStockCount > 0 ? `${lowStockCount} Item Rendah` : 'Optimal'}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Sinkronisasi Terakhir: {new Date(site.lastSyncedAt).toLocaleString('id-ID')}
                </div>
              </div>

              <div className="pt-4 border-t border-border mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedSiteId(site.id);
                    navigate('/dashboard');
                  }}
                  className="flex-1 rounded-lg bg-teal py-2 text-xs font-semibold text-white hover:bg-teal-hover transition-colors shadow-sm flex items-center justify-center gap-1"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Lihat Dashboard</span>
                </button>
                <button
                  onClick={() => navigate(`/inventory/stock?siteId=${site.id}`)}
                  className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Detail Stok
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
