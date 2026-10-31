import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/providers/AppContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/data-display/StatusBadge';
import { Search, Filter, QrCode, Eye, ArrowUpDown, Boxes } from 'lucide-react';

export const ItemsPage: React.FC = () => {
  const { items, categories, stockBalances, selectedSiteId } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'LOW' | 'NORMAL' | 'EMPTY'>('ALL');

  // Compute stock per item
  const itemsWithStock = useMemo(() => {
    return items.map((item) => {
      const balances = selectedSiteId === 'ALL'
        ? stockBalances.filter((b) => b.itemId === item.id)
        : stockBalances.filter((b) => b.itemId === item.id && b.siteId === selectedSiteId);

      const totalOnHand = balances.reduce((sum, b) => sum + b.onHand, 0);
      const sitesWithStockCount = balances.filter((b) => b.onHand > 0).length;
      const isAnyLow = balances.some((b) => b.onHand <= b.minimumStock && b.minimumStock > 0);
      const isOut = totalOnHand === 0;

      let status: 'NORMAL' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'NORMAL';
      if (isOut) status = 'OUT_OF_STOCK';
      else if (isAnyLow) status = 'LOW_STOCK';

      const category = categories.find((c) => c.id === item.categoryId);

      return {
        ...item,
        categoryName: category?.name || '-',
        totalOnHand,
        sitesWithStockCount,
        status,
      };
    });
  }, [items, categories, stockBalances, selectedSiteId]);

  // Filter items
  const filteredItems = useMemo(() => {
    return itemsWithStock.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.partNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'ALL' || item.categoryId === selectedCategory;

      const matchesStock =
        stockFilter === 'ALL' ||
        (stockFilter === 'LOW' && item.status === 'LOW_STOCK') ||
        (stockFilter === 'EMPTY' && item.status === 'OUT_OF_STOCK') ||
        (stockFilter === 'NORMAL' && item.status === 'NORMAL');

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [itemsWithStock, searchQuery, selectedCategory, stockFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Item & Suku Cadang"
        subtitle="Katalog item operasional FPE dengan visibilitas stok terkonsolidasi lintas site"
        actions={
          <button
            onClick={() => navigate('/admin/qr-labels')}
            className="rounded-lg bg-teal px-3.5 py-2 text-xs font-semibold text-white hover:bg-teal-hover transition-colors shadow-sm flex items-center gap-1.5"
          >
            <QrCode className="h-4 w-4" />
            <span>Cetak QR Label</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, kode item (SP-xxxx), atau part number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border pl-9 pr-3 py-2 text-xs text-text-primary focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-primary focus:border-teal focus:outline-none"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-primary focus:border-teal focus:outline-none"
          >
            <option value="ALL">Semua Status Stok</option>
            <option value="LOW">Di Bawah Minimum</option>
            <option value="NORMAL">Optimal / Aman</option>
            <option value="EMPTY">Stok Kosong (0)</option>
          </select>
        </div>
      </div>

      {/* Items Table */}
      <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-slate-50/75 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Kode Item</th>
                <th className="py-3 px-4">Nama Item & Deskripsi</th>
                <th className="py-3 px-4">Part Number</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-right">Total On-Hand</th>
                <th className="py-3 px-4 text-center">Sebaran Site</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-secondary">
                    <Boxes className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    <p className="font-medium">Tidak ada item yang sesuai dengan kriteria pencarian.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/inventory/items/${item.id}`)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-navy">
                      {item.code}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-navy group-hover:text-teal transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        {item.description}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 font-medium">
                      {item.partNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                        {item.categoryName}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-navy tabular-nums">
                      {item.totalOnHand.toLocaleString('id-ID')}{' '}
                      <span className="font-normal text-slate-500">{item.unit}</span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600 font-medium">
                      {item.sitesWithStockCount} dari 6 site
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/inventory/items/${item.id}`)}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-navy transition-colors"
                          title="Lihat Detail Saldo per Site"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/qr-labels?item=${item.id}`)}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-teal transition-colors"
                          title="Cetak Label QR"
                        >
                          <QrCode className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
