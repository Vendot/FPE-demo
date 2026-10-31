import React, { useState } from 'react';
import {
  Menu,
  Wifi,
  WifiOff,
  Building,
  UserCheck,
  RotateCcw,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '@/app/providers/AppContext';
import { DemoRole } from '@/domain/types';

interface TopbarProps {
  onOpenSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenSidebar }) => {
  const {
    sites,
    selectedSiteId,
    setSelectedSiteId,
    users,
    currentUser,
    setCurrentUser,
    isOffline,
    setIsOffline,
    lastSyncedTimestamp,
    resetAllDemoData,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showSiteMenu, setShowSiteMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const activeSiteName =
    selectedSiteId === 'ALL'
      ? 'Semua Site (6 Lokasi)'
      : sites.find((s) => s.id === selectedSiteId)?.name || 'Pilih Site';

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-surface px-4 lg:px-6 shadow-sm">
        {/* Left: Mobile hamburger & Site selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="rounded-lg p-2 text-text-secondary hover:bg-slate-100 lg:hidden"
            aria-label="Buka Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Site Context Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSiteMenu(!showSiteMenu);
                setShowRoleMenu(false);
              }}
              className="flex items-center gap-2 rounded-lg border border-border bg-slate-50 px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-slate-100 transition-colors"
            >
              <Building className="h-3.5 w-3.5 text-teal" />
              <span>{activeSiteName}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {showSiteMenu && (
              <div
                className="absolute left-0 mt-1.5 w-60 rounded-lg border border-border bg-surface p-1.5 shadow-lg z-50 text-xs"
                onMouseLeave={() => setShowSiteMenu(false)}
              >
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase">
                  Pilih Lingkup Site
                </div>
                <button
                  onClick={() => {
                    setSelectedSiteId('ALL');
                    setShowSiteMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between ${
                    selectedSiteId === 'ALL'
                      ? 'bg-teal/10 font-bold text-teal'
                      : 'text-text-primary hover:bg-slate-100'
                  }`}
                >
                  <span>Semua Site (Konsolidasi 6 Site)</span>
                  {selectedSiteId === 'ALL' && <span className="h-1.5 w-1.5 rounded-full bg-teal" />}
                </button>
                <div className="my-1 border-t border-slate-100" />
                {sites.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => {
                      setSelectedSiteId(site.id);
                      setShowSiteMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between ${
                      selectedSiteId === site.id
                        ? 'bg-teal/10 font-bold text-teal'
                        : 'text-text-primary hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{site.name}</div>
                      <div className="text-[10px] text-slate-400">{site.locationLabel}</div>
                    </div>
                    {selectedSiteId === site.id && <span className="h-1.5 w-1.5 rounded-full bg-teal" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Demo environment pill */}
          <div className="hidden sm:inline-flex items-center gap-1 rounded border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-800">
            DEMO ENVIRONMENT
          </div>
        </div>

        {/* Right: Controls & Switchers */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Online/Offline Toggle */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all shadow-sm ${
              isOffline
                ? 'bg-amber-500 text-white ring-2 ring-amber-300 animate-pulse'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
            }`}
            title={
              isOffline
                ? 'Mode Offline aktif: Transaksi lokal diantrekan ke Sync Center'
                : 'Mode Online: Data tersinkronisasi'
            }
          >
            {isOffline ? (
              <>
                <WifiOff className="h-3.5 w-3.5" />
                <span>Simulasi Offline</span>
              </>
            ) : (
              <>
                <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                <span>Online</span>
              </>
            )}
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowSiteMenu(false);
              }}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-text-primary hover:bg-slate-50 transition-colors"
            >
              <UserCheck className="h-3.5 w-3.5 text-navy" />
              <div className="hidden md:flex flex-col text-left">
                <span className="font-semibold text-text-primary leading-tight">{currentUser.name}</span>
                <span className="text-[10px] text-slate-500">{currentUser.role.replace('_', ' ')}</span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div
                className="absolute right-0 mt-1.5 w-64 rounded-lg border border-border bg-surface p-1.5 shadow-xl z-50 text-xs"
                onMouseLeave={() => setShowRoleMenu(false)}
              >
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase">
                  Ganti Persona Demo
                </div>
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setCurrentUser(user.id);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-md transition-colors ${
                      currentUser.id === user.id
                        ? 'bg-teal/10 text-teal font-semibold'
                        : 'text-text-primary hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-mono">
                        {user.role}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Scope:{' '}
                      {user.siteIds.length === sites.length
                        ? 'Semua Site'
                        : user.siteIds.map((id) => id.replace('site-', 'S')).join(', ')}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 rounded-lg border border-border p-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-navy transition-colors"
            title="Reset Data Simulasi ke Standar"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* Persistent Offline / Stale Data Alert Bar */}
      {isOffline && (
        <div className="bg-amber-500 text-white px-4 py-1.5 text-xs flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              <strong>Mode Offline Simulasi Aktif:</strong> Data lintas-site mungkin tidak mutakhir
              (Stale). Transaksi Goods Receipt & Issue disimpan lokal di antrean sync. Approval &
              Dashboard terpusat ditangguhkan.
            </span>
          </div>
          <button
            onClick={() => setIsOffline(false)}
            className="rounded bg-white/20 px-2 py-0.5 text-[11px] font-bold hover:bg-white/30"
          >
            Kembali Online
          </button>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-surface p-6 shadow-2xl border border-border">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <RotateCcw className="h-6 w-6" />
              <h3 className="text-base font-bold text-text-primary">Reset Data Simulasi?</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mb-5">
              Tindakan ini akan mengembalikan seluruh saldo stok 6 site, daftar transfer, transaksi
              inbound/outbound, dan antrean offline ke keadaan seed awal (canonical initial state).
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-semibold text-text-secondary hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  resetAllDemoData();
                  setShowResetConfirm(false);
                }}
                className="rounded-lg bg-status-danger px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700 shadow-sm"
              >
                Ya, Reset Data Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
