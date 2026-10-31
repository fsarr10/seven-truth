'use client';

import React from 'react';
import { useLabelStore } from '@/lib/store/useLabelStore';
import { UserRole } from '@/lib/types';
import { ShieldCheck, Eye, UserCheck, Smartphone } from 'lucide-react';

export function RoleSwitcherBanner() {
  const { currentRole, currentUserName, setCurrentRole } = useLabelStore();

  const roles: { id: UserRole; label: string; desc: string; icon: any }[] = [
    { id: 'admin', label: 'Admin (Gérant)', desc: 'Tout contrôler & administrer', icon: ShieldCheck },
    { id: 'patron', label: 'Le Patron (Investisseur)', desc: 'Lecture seule & transparence totale', icon: Eye },
    { id: 'staff', label: 'Staff (Ingé / Cadreur)', desc: 'Saisie séances, pas de suppression', icon: UserCheck },
    { id: 'client', label: 'Client', desc: 'Réservation & consultation', icon: Smartphone }
  ];

  return (
    <div className="bg-surface-secondary/90 backdrop-blur-md border-b border-surface-border text-xs px-3 sm:px-4 py-2 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="font-semibold text-white">Mode Test RLS :</span>
          <span className="text-zinc-400 hidden sm:inline">Connecté en tant que :</span>
          <span className="text-gold font-bold">{currentUserName}</span>
          {currentRole === 'patron' && (
            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Lecture Seule Transparence
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <span className="text-zinc-500 text-[11px] hidden md:inline">Changer de rôle :</span>
          {roles.map(r => {
            const Icon = r.icon;
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setCurrentRole(r.id)}
                title={r.desc}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gold text-background font-bold shadow-sm shadow-gold/20'
                    : 'bg-surface border border-surface-border text-zinc-300 hover:text-white hover:border-zinc-600'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
