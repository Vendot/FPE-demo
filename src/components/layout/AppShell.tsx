import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Info } from 'lucide-react';

export const AppShell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Informative Demo Banner (Requirement Section 4 in 07-DEMO-SCENARIOS-AND-ACCEPTANCE.md) */}
        <div className="bg-slate-100 border-b border-border/80 px-4 py-1.5 text-[11px] text-text-secondary flex items-center justify-between no-print">
          <div className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-teal shrink-0" />
            <span>
              <strong>Data Simulasi</strong> — Prototype interaktif paket Professional (FPE Multi-Site WMS). Bukan data operasional aktual FPE.
            </span>
          </div>
          <span className="hidden sm:inline text-[10px] text-slate-400">
            Fikri & Partners Consulting
          </span>
        </div>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 lg:p-6 mx-auto w-full max-w-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
