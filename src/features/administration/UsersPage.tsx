import React from 'react';
import { useApp } from '@/app/providers/AppContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Users, UserCheck, Shield, Check, X } from 'lucide-react';
import { DemoRole } from '@/domain/types';

export const UsersPage: React.FC = () => {
  const { users, currentUser, setCurrentUser, sites } = useApp();

  const permissionsMatrix = [
    {
      feature: 'Lihat Dashboard & Ringkasan Metrik',
      staff: 'Terbatas (Site)',
      approver: 'Ya',
      management: 'Ya',
      admin: 'Ya',
    },
    {
      feature: 'Katalog Item & Saldo Multi-Site',
      staff: 'Site Ditugaskan',
      approver: 'Site Ditugaskan',
      management: 'Semua 6 Site',
      admin: 'Semua 6 Site',
    },
    {
      feature: 'Input Inbound (Goods Receiving)',
      staff: 'Ya',
      approver: 'Ya',
      management: 'Tidak',
      admin: 'Ya',
    },
    {
      feature: 'Input Outbound (Goods Issuing)',
      staff: 'Ya',
      approver: 'Ya',
      management: 'Tidak',
      admin: 'Ya',
    },
    {
      feature: 'Ajukan Permintaan Transfer (Request)',
      staff: 'Ya',
      approver: 'Ya',
      management: 'Tidak',
      admin: 'Ya',
    },
    {
      feature: 'Otorisasi Persetujuan Transfer (Approval)',
      staff: 'Tidak',
      approver: 'Ya',
      management: 'Read-only',
      admin: 'Ya',
    },
    {
      feature: 'Konfirmasi Dispatch & Penerimaan Transfer',
      staff: 'Ya (Site Terkait)',
      approver: 'Ya',
      management: 'Tidak',
      admin: 'Ya',
    },
    {
      feature: 'Stock Opname Fisik & Input Hitungan',
      staff: 'Ya',
      approver: 'Ya',
      management: 'Tidak',
      admin: 'Ya',
    },
    {
      feature: 'Setujui & Terapkan Penyesuaian Opname',
      staff: 'Tidak',
      approver: 'Ya',
      management: 'Read-only',
      admin: 'Ya',
    },
    {
      feature: 'Ekspor Laporan & Riwayat CSV',
      staff: 'Site Ditugaskan',
      approver: 'Site Ditugaskan',
      management: 'Semua 6 Site',
      admin: 'Semua 6 Site',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengguna & Matriks Hak Akses (RBAC)"
        subtitle="Manajemen persona demo dan visualisasi kontrol izin berbasis peran (Role-Based Access Control)"
      />

      {/* Users Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {users.map((user) => {
          const isSelected = currentUser.id === user.id;
          const siteScope =
            user.siteIds.length === sites.length
              ? 'Semua 6 Site'
              : user.siteIds.map((id) => id.replace('site-', 'S')).join(', ');

          return (
            <div
              key={user.id}
              className={`rounded-xl border p-4 shadow-sm transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-teal bg-teal/5 ring-2 ring-teal/20'
                  : 'border-border bg-surface hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-navy text-sm">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {user.role}
                  </span>
                </div>

                <h4 className="font-bold text-navy text-sm">{user.name}</h4>
                <div className="text-[11px] text-slate-400 mt-0.5">{user.email}</div>

                <div className="mt-3 pt-3 border-t border-border/70 text-xs">
                  <span className="text-[11px] text-slate-400 block">Lingkup Akses Site:</span>
                  <span className="font-semibold text-teal mt-0.5 block">{siteScope}</span>
                </div>
              </div>

              <div className="pt-4 mt-3">
                <button
                  onClick={() => setCurrentUser(user.id)}
                  className={`w-full rounded-lg py-1.5 text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-teal text-white shadow-sm'
                      : 'border border-border text-navy hover:bg-slate-50'
                  }`}
                >
                  {isSelected ? 'Persona Aktif Saat Ini' : 'Ganti ke Persona Ini'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix Table (05-BUSINESS-RULES-AND-WORKFLOWS.md Section 7) */}
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
          <Shield className="h-4 w-4 text-teal" />
          <h3 className="font-bold text-navy text-sm">
            Matriks Otoritas Berdasarkan Peran (Role Matrix)
          </h3>
        </div>
        <p className="text-xs text-text-secondary mb-4">
          Matriks ini adalah rancangan prototipe demo untuk memperlihatkan kontrol izin operasional.
          Struktur approval matrix aktual FPE akan dikonfirmasi lebih lanjut saat tahap discovery.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Fungsi / Tindakan Operasional</th>
                <th className="py-2.5 px-3 text-center">Warehouse Staff</th>
                <th className="py-2.5 px-3 text-center">Site Approver</th>
                <th className="py-2.5 px-3 text-center">Management</th>
                <th className="py-2.5 px-3 text-center">System Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-navy">{row.feature}</td>
                  <td className="py-2.5 px-3 text-center text-slate-700">{row.staff}</td>
                  <td className="py-2.5 px-3 text-center font-semibold text-teal">
                    {row.approver}
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-600">{row.management}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-navy">{row.admin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
