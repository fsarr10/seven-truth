'use client';

import React, { useState } from 'react';
import { useLabelStore } from '@/lib/store/useLabelStore';
import { SettingsConfig } from '@/lib/types';
import { formatFCFA } from '@/lib/utils/currency';
import { Sliders, Save, CheckCircle2, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export function SettingsModule() {
  const { settings, updateSettings, resetToSeed, currentRole } = useLabelStore();
  const isReadOnly = currentRole === 'patron';

  const [formSettings, setFormSettings] = useState<SettingsConfig>(settings);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-gold" />
            Paramètres & Règles d'Exploitation
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Configuration des charges fixes, répartition des bénéfices, plages sonores et contacts WhatsApp.
          </p>
        </div>

        {!isReadOnly && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetToSeed}
              className="px-3.5 py-2 rounded-xl bg-surface border border-surface-border hover:border-red-500 text-zinc-400 hover:text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Réinitialiser les données au seed de démonstration"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser Données Démo</span>
            </button>
          </div>
        )}
      </div>

      {successMsg && (
        <div className="p-3 bg-green-950/60 border border-green-800 rounded-xl text-green-200 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
          <span>Paramètres sauvegardés avec succès et tracés dans le journal d'audit.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Objectifs & Répartition Financière */}
        <div className="p-5 bg-surface-secondary border border-surface-border rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            Finances & Clé de Répartition des Bénéfices
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Charges Fixes Mensuelles Cibles (FCFA)
              </label>
              <input
                type="number"
                disabled={isReadOnly}
                value={formSettings.financial_rules.monthly_fixed_charges_target}
                onChange={(e) => setFormSettings({
                  ...formSettings,
                  financial_rules: {
                    ...formSettings.financial_rules,
                    monthly_fixed_charges_target: parseInt(e.target.value) || 0
                  }
                })}
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white font-mono"
              />
              <span className="text-zinc-500 text-[11px]">Loyer (150k) + électricité, eau, wifi, pub, transport ≈ 300 000 FCFA</span>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Objectif de Chiffre d'Affaires Mensuel (FCFA)
              </label>
              <input
                type="number"
                disabled={isReadOnly}
                value={formSettings.financial_rules.monthly_revenue_goal}
                onChange={(e) => setFormSettings({
                  ...formSettings,
                  financial_rules: {
                    ...formSettings.financial_rules,
                    monthly_revenue_goal: parseInt(e.target.value) || 0
                  }
                })}
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white font-mono"
              />
              <span className="text-zinc-500 text-[11px]">Seuil cible pour rémunération complète (630 000 FCFA)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">% Réserve Matériel</label>
              <input
                type="number"
                disabled={isReadOnly}
                value={formSettings.financial_rules.equipment_reserve_pct}
                onChange={(e) => setFormSettings({
                  ...formSettings,
                  financial_rules: {
                    ...formSettings.financial_rules,
                    equipment_reserve_pct: parseInt(e.target.value) || 0
                  }
                })}
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white font-mono"
              />
              <span className="text-zinc-500 text-[10px]">Par défaut 10%</span>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">% Part Équipe</label>
              <input
                type="number"
                disabled={isReadOnly}
                value={formSettings.financial_rules.team_split_pct}
                onChange={(e) => setFormSettings({
                  ...formSettings,
                  financial_rules: {
                    ...formSettings.financial_rules,
                    team_split_pct: parseInt(e.target.value) || 0
                  }
                })}
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white font-mono"
              />
              <span className="text-zinc-500 text-[10px]">Par défaut 50%</span>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">% Part Patron</label>
              <input
                type="number"
                disabled={isReadOnly}
                value={formSettings.financial_rules.patron_split_pct}
                onChange={(e) => setFormSettings({
                  ...formSettings,
                  financial_rules: {
                    ...formSettings.financial_rules,
                    patron_split_pct: parseInt(e.target.value) || 0
                  }
                })}
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white font-mono"
              />
              <span className="text-zinc-500 text-[10px]">Par défaut 30%</span>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">% Réinvestissement</label>
              <input
                type="number"
                disabled={isReadOnly}
                value={formSettings.financial_rules.reinvestment_pct}
                onChange={(e) => setFormSettings({
                  ...formSettings,
                  financial_rules: {
                    ...formSettings.financial_rules,
                    reinvestment_pct: parseInt(e.target.value) || 0
                  }
                })}
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white font-mono"
              />
              <span className="text-zinc-500 text-[10px]">Par défaut 20%</span>
            </div>
          </div>
        </div>

        {/* 2. Réglementation Bruit & Sabar */}
        <div className="p-5 bg-surface-secondary border border-surface-border rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Réglementation Bruit (Batterie & Sabar à Thiès)
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Heure de début autorisée</label>
              <input
                type="number"
                disabled={isReadOnly}
                value={formSettings.noise_regulations.start_hour}
                onChange={(e) => setFormSettings({
                  ...formSettings,
                  noise_regulations: {
                    ...formSettings.noise_regulations,
                    start_hour: parseInt(e.target.value) || 10
                  }
                })}
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white font-mono"
              />
              <span className="text-zinc-500 text-[10px]">Par défaut : 10h00</span>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Heure de fin autorisée</label>
              <input
                type="number"
                disabled={isReadOnly}
                value={formSettings.noise_regulations.end_hour}
                onChange={(e) => setFormSettings({
                  ...formSettings,
                  noise_regulations: {
                    ...formSettings.noise_regulations,
                    end_hour: parseInt(e.target.value) || 19
                  }
                })}
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white font-mono"
              />
              <span className="text-zinc-500 text-[10px]">Par défaut : 19h00</span>
            </div>
          </div>
        </div>

        {/* 3. Coordonnées WhatsApp */}
        <div className="p-5 bg-surface-secondary border border-surface-border rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Coordonnées & WhatsApp Studio
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Numéro WhatsApp Réception (wa.me)</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formSettings.label_info.whatsapp}
                onChange={(e) => setFormSettings({
                  ...formSettings,
                  label_info: {
                    ...formSettings.label_info,
                    whatsapp: e.target.value
                  }
                })}
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Adresse à Thiès</label>
              <input
                type="text"
                disabled={isReadOnly}
                value={formSettings.label_info.address}
                onChange={(e) => setFormSettings({
                  ...formSettings,
                  label_info: {
                    ...formSettings.label_info,
                    address: e.target.value
                  }
                })}
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white"
              />
            </div>
          </div>
        </div>

        {!isReadOnly && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-gold/10 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer tous les paramètres</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
