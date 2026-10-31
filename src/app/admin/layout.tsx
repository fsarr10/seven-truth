'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLabelStore } from '@/lib/store/useLabelStore';
import { SevenTruthLogo } from '@/components/brand/SevenTruthLogo';
import {
  LayoutDashboard, Calendar, Camera, Package, DollarSign,
  FileText, ShieldCheck, Users, Sliders, ArrowLeft, Menu, X,
  Lock, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentRole, currentUserName } = useLabelStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/admin/calendrier', label: 'Calendrier & Séances', icon: Calendar },
    { href: '/admin/locations', label: 'Location Matériel', icon: Camera },
    { href: '/admin/inventaire', label: 'Inventaire & QR Codes', icon: Package },
    { href: '/admin/finances', label: 'Finances & Caisse', icon: DollarSign },
    { href: '/admin/rapports', label: 'Comptes Rendus (PDF)', icon: FileText },
    { href: '/admin/audit', label: 'Journal d\'Audit', icon: ShieldCheck },
    { href: '/admin/clients', label: 'Clients (CRM)', icon: Users },
    { href: '/admin/parametres', label: 'Paramètres Studio', icon: Sliders },
  ];

  const isPatron = currentRole === 'patron';

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Barre de navigation mobile */}
      <div className="md:hidden flex items-center justify-between p-4 bg-surface-secondary border-b border-surface-border">
        <div className="flex items-center gap-2">
          <SevenTruthLogo variant="mark" size={32} />
          <div>
            <span className="font-bold text-white text-sm block leading-none">SEVEN TRUTH</span>
            <span className="text-[10px] text-gold capitalize mt-0.5 block">{currentUserName}</span>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-surface text-zinc-300"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Barre latérale (Sidebar) */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-surface-secondary border-r border-surface-border flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* En-tête Sidebar */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <SevenTruthLogo variant="compact" size="sm" />
            </Link>
          </div>

          {/* Badge rôle actuel */}
          <div className="p-3 bg-surface rounded-xl border border-surface-border space-y-1">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
              Session Active
            </span>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isPatron ? 'bg-amber-400' : 'bg-green-400'}`} />
              <strong className="text-xs text-white capitalize block truncate">{currentUserName}</strong>
            </div>
            {isPatron && (
              <span className="text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 block text-center">
                Lecture Seule (Patron)
              </span>
            )}
          </div>

          {/* Menu de navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gold text-background font-bold shadow-md shadow-gold/10'
                      : 'text-zinc-400 hover:text-white hover:bg-surface'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Pied de sidebar : Retour au site public */}
        <div className="p-4 border-t border-surface-border">
          <Link
            href="/"
            className="w-full py-2.5 px-3 rounded-xl bg-surface hover:bg-surface-border text-zinc-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-gold" />
            <span>Retour au site public</span>
          </Link>
        </div>
      </aside>

      {/* Contenu principal de la page d'administration */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
