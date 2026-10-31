import React, { useState } from 'react';
import { useApp } from '@/app/providers/AppContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { RotateCcw, CheckCircle2, ShieldCheck, Database, Info, Layers, Check } from 'lucide-react';
import { SEED_VERSION } from '@/data/seed/initialData';

export const DemoSettingsPage: React.FC = () => {
  const { sites, items, stockBalances, transfers, transactions, users, resetAllDemoData } = useApp();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    resetAllDemoData();
    setShowConfirm(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Pengaturan Lingkungan Demo & Reset"
        subtitle="Kelola state prototipe, verifikasi kepatuhan ruang lingkup paket Professional, dan pulihkan dataset awal"
      />

      {resetSuccess && (
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-800 shadow-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          <div className="font-semibold">
            Data demo berhasil di-reset ke kondisi canonical seed awal (Versi: {SEED_VERSION}).
            Seluruh saldo, transaksi, dan transfer telah dipulihkan.
          </div>
        </div>
      )}

      {/* Reset Section Card */}
      <div className="rounded-xl border border-rose-200 bg-surface p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
          <RotateCcw className="h-5 w-5" />
          <span>Reset Seluruh Data Simulasi Demo</span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          Gunakan tombol ini sebelum memulai sesi presentasi baru kepada stakeholder PT FAMOES
          PRATAMA ENGINEERING untuk memastikan dataset kembali ke baseline awal yang bersih.
        </p>

        <button
          onClick={() => setShowConfirm(true)}
          className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-sm"
        >
          Reset Data ke Snapshot Standar (Seed Initial)
        </button>
      </div>

      {/* Current Dataset Breakdown */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
          <Database className="h-4 w-4 text-teal" />
          <h3 className="font-bold text-navy text-sm">Snapshot Dataset Tersimpan Saat Ini</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="rounded-lg bg-slate-50 p-3 border border-border">
            <span className="text-slate-400 block text-[11px]">Site Operasional</span>
            <span className="font-bold text-navy text-lg">{sites.length} Lokasi</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Kalimantan Barat</span>
          </div>

          <div className="rounded-lg bg-slate-50 p-3 border border-border">
            <span className="text-slate-400 block text-[11px]">Master Item SKU</span>
            <span className="font-bold text-navy text-lg">{items.length} SKU</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Suku Cadang & APD</span>
          </div>

          <div className="rounded-lg bg-slate-50 p-3 border border-border">
            <span className="text-slate-400 block text-[11px]">Kombinasi Saldo Stok</span>
            <span className="font-bold text-navy text-lg">{stockBalances.length} Entri</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Saldo on-hand & min stock</span>
          </div>

          <div className="rounded-lg bg-slate-50 p-3 border border-border">
            <span className="text-slate-400 block text-[11px]">Daftar Transfer Antar-Site</span>
            <span className="font-bold text-navy text-lg">{transfers.length} Dokumen</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Berbagai status alur</span>
          </div>

          <div className="rounded-lg bg-slate-50 p-3 border border-border">
            <span className="text-slate-400 block text-[11px]">Buku Besar Transaksi</span>
            <span className="font-bold text-navy text-lg">{transactions.length} Entri</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Inbound, issue & transfer</span>
          </div>

          <div className="rounded-lg bg-slate-50 p-3 border border-border">
            <span className="text-slate-400 block text-[11px]">Persona Demo Pengguna</span>
            <span className="font-bold text-navy text-lg">{users.length} Role</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Admin, Approver, Staff, Mgmt</span>
          </div>
        </div>
      </div>

      {/* Scope Compliance Matrix (Professional Guard) */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 mb-1 pb-2 border-b border-border">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <h3 className="font-bold text-navy text-sm">
            Kepatuhan Ruang Lingkup Komersial (Professional Package Scope)
          </h3>
        </div>
        <p className="text-xs text-text-secondary">
          Prototipe ini secara ketat membatasi fungsionalitas pada paket Professional sesuai proposal
          (Phase 1 --- Rp68.000.000). Modul tingkat lanjut (Advanced) dan fase berikutnya dipisahkan:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg bg-emerald-50/60 border border-emerald-200 p-3">
            <h4 className="font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
              <Check className="h-4 w-4" />
              <span>Termasuk Dalam Paket Professional (Aktif)</span>
            </h4>
            <ul className="space-y-1 text-slate-700 text-[11px]">
              <li>• Multi-site inventory hingga 6 lokasi</li>
              <li>• Transfer antar-site lengkap (Request, Approval, Dispatch, Receive)</li>
              <li>• Role-based approval untuk transaksi utama</li>
              <li>• Peringatan ambang batas minimum stock per site</li>
              <li>• Stock opname fisik dan rekonsiliasi selisih</li>
              <li>• Riwayat transaksi lengkap dan ekspor CSV</li>
              <li>• Cetak QR labels PDF untuk penandaan fisik</li>
              <li>• Simulasi offline-first untuk transaksi lokal</li>
            </ul>
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
            <h4 className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <Info className="h-4 w-4 text-slate-500" />
              <span>Di Luar Professional (Advanced / Phase 2+)</span>
            </h4>
            <ul className="space-y-1 text-slate-500 text-[11px]">
              <li>• Valuasi nilai persediaan finansial (Valuation)</li>
              <li>• Analisis umur persediaan (Stock Aging & Slow-moving)</li>
              <li>• Scanning kamera langsung via smartphone (Camera barcode scanning)</li>
              <li>• Procurement workflow lengkap (PO, PR, Quotation - Phase 2)</li>
              <li>• Maintenance & heavy equipment breakdown management (Phase 3)</li>
              <li>• Predictive demand forecasting berbasis AI</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-surface p-6 shadow-2xl border border-border">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <RotateCcw className="h-6 w-6" />
              <h3 className="text-base font-bold text-navy">Konfirmasi Reset Demo</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mb-5">
              Apakah Anda yakin ingin mengatur ulang data? Semua perubahan data lokal yang Anda buat
              saat demonstrasi akan digantikan dengan data seed awal.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-semibold text-text-secondary hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={handleReset}
                className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 shadow-sm"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
