import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  MapPin,
  ArrowDownToLine,
  ArrowUpFromLine,
  ClipboardCheck,
  ArrowLeftRight,
  ShieldCheck,
  FileText,
  History,
  Building2,
  Users,
  QrCode,
  RefreshCw,
  Settings,
  X,
  Package2,
} from 'lucide-react';
import { useApp } from '@/app/providers/AppContext';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { metrics, currentUser } = useApp();
  const location = useLocation();

  const isAllowed = (restrictedTo?: string[]) => {
    if (!restrictedTo) return true;
    return restrictedTo.includes(currentUser.role);
  };

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Inventory',
      items: [
        { label: 'Item Master', path: '/inventory/items', icon: Boxes },
        { label: 'Stok per Site', path: '/inventory/stock', icon: MapPin },
        { label: 'Penerimaan (Inbound)', path: '/inventory/receiving', icon: ArrowDownToLine },
        { label: 'Pengeluaran (Outbound)', path: '/inventory/issuing', icon: ArrowUpFromLine },
        { label: 'Stock Opname', path: '/inventory/stock-opname', icon: ClipboardCheck },
      ],
    },
    {
      title: 'Transfers',
      items: [
        { label: 'Daftar Transfer', path: '/transfers', icon: ArrowLeftRight },
        {
          label: 'Approval Inbox',
          path: '/approvals',
          icon: ShieldCheck,
          badge: metrics.pendingApprovalsCount > 0 ? metrics.pendingApprovalsCount : undefined,
          badgeColor: 'bg-amber-500 text-white',
        },
      ],
    },
    {
      title: 'Reports',
      items: [
        { label: 'Laporan Stok', path: '/reports/stock', icon: FileText },
        { label: 'Riwayat Transaksi', path: '/reports/transactions', icon: History },
      ],
    },
    {
      title: 'Administration',
      items: [
        { label: 'Site & Gudang', path: '/admin/sites', icon: Building2 },
        { label: 'User & Role', path: '/admin/users', icon: Users },
        { label: 'Cetak QR Label', path: '/admin/qr-labels', icon: QrCode },
      ],
    },
    {
      title: 'System',
      items: [
        {
          label: 'Sync Center',
          path: '/system/sync',
          icon: RefreshCw,
          badge: metrics.pendingSyncCount > 0 ? metrics.pendingSyncCount : undefined,
          badgeColor: 'bg-teal text-white',
        },
        { label: 'Demo Settings', path: '/system/demo-settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-deep/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-navy-deep text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-navy-light/40 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal text-white shadow-sm">
              <Package2 className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-xs font-semibold tracking-wider text-teal-light uppercase">
                PT FAMOES PRATAMA ENG.
              </span>
              <span className="block text-sm font-bold text-white">
                Multi-Site WMS
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-navy-light hover:text-white lg:hidden"
            aria-label="Tutup Menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-5">
              <div className="px-3 pb-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.path === '/transfers'
                      ? location.pathname === '/transfers' ||
                        (location.pathname.startsWith('/transfers/') &&
                          location.pathname !== '/transfers/new')
                      : location.pathname.startsWith(item.path);

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={clsx(
                        'group flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors',
                        isActive
                          ? 'bg-teal text-white shadow-sm'
                          : 'text-slate-300 hover:bg-navy-light/50 hover:text-white'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={clsx(
                            'h-4 w-4 shrink-0 transition-colors',
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                          )}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={clsx(
                            'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold',
                            item.badgeColor
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Persona & Role Footer */}
        <div className="border-t border-navy-light/40 bg-navy/60 p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-teal-light">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <p className="truncate text-[11px] text-slate-300">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
