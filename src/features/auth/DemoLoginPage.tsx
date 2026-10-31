import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/providers/AppContext';
import { Package2, ArrowRight, ShieldCheck, User, Building, Lock } from 'lucide-react';

export const DemoLoginPage: React.FC = () => {
  const { users, sites, setCurrentUser } = useApp();
  const navigate = useNavigate();

  const handleSelectUser = (userId: string) => {
    setCurrentUser(userId);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal shadow-lg shadow-teal/30">
          <Package2 className="h-8 w-8 text-white" />
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
          FPE Multi-Site WMS
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          PT FAMOES PRATAMA ENGINEERING — Professional Prototype
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-slate-800 border border-slate-700 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          <div className="border-b border-slate-700 pb-4 mb-6">
            <h3 className="text-sm font-semibold text-teal-light uppercase tracking-wider">
              Pilih Persona Demo
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Pilih peran pengguna di bawah untuk melihat antarmuka dan kontrol izin (Role-Based
              Access Control) yang sesuai.
            </p>
          </div>

          <div className="space-y-3">
            {users.map((user) => {
              const siteCount = user.siteIds.length;
              const siteLabel =
                siteCount === sites.length
                  ? 'Semua 6 Site Operasional'
                  : user.siteIds.map((id) => id.replace('site-', 'S')).join(', ');

              return (
                <div
                  key={user.id}
                  onClick={() => handleSelectUser(user.id)}
                  className="group flex items-center justify-between rounded-xl border border-slate-700 bg-slate-850 p-4 hover:border-teal hover:bg-slate-750 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-teal-light font-bold text-sm group-hover:bg-teal group-hover:text-white transition-colors">
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white group-hover:text-teal-light">
                          {user.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 font-mono text-slate-300">
                          {user.role}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>{user.email}</span>
                        <span>•</span>
                        <span className="text-teal-400">{siteLabel}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-teal group-hover:translate-x-1 transition-all" />
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-lg bg-slate-900/60 p-4 border border-slate-700/60 text-xs text-slate-400">
            <div className="flex items-center gap-2 font-semibold text-slate-300 mb-1">
              <Lock className="h-3.5 w-3.5 text-amber-400" />
              <span>Catatan Prototipe Demo</span>
            </div>
            Persona di atas digunakan untuk simulasi alur persetujuan, otorisasi penerimaan/pengeluaran barang, serta pembatasan akses data tanpa login terpusat backend.
          </div>
        </div>
      </div>
    </div>
  );
};
