'use client';

import React from 'react';
import { useLabelStore } from '@/lib/store/useLabelStore';
import { formatFCFA } from '@/lib/utils/currency';
import {
  TrendingUp, TrendingDown, DollarSign, Calendar, Clock,
  Camera, AlertTriangle, ShieldCheck, CheckCircle2, Bell, Users
} from 'lucide-react';
import Link from 'next/link';

export function DashboardOverview() {
  const {
    calculateFinancialBreakdown, bookings, rentals, equipment,
    currentRole, settings
  } = useLabelStore();

  const breakdown = calculateFinancialBreakdown();

  // Matériel actuellement dehors
  const activeRentals = rentals.filter(r => r.status === 'en_cours');

  // Réservations à venir
  const upcomingBookings = bookings.filter(b => b.status === 'confirmee' || b.status === 'payee');

  // Reste à encaisser sur les réservations en attente ou avec solde
  const pendingToCollect = bookings.reduce((sum, b) => {
    if (b.status === 'annulee') return sum;
    return sum + Math.max(0, b.total_amount - b.paid_amount);
  }, 0);

  // Détection des alertes automatiques selon le calendrier (§4.10)
  const today = new Date();
  const dayOfMonth = today.getDate(); // Jour du mois actuel

  const alerts: { type: 'danger' | 'warning' | 'info'; message: string }[] = [];

  // Règle 1 : le 15 du mois, si moins de 150 000 FCFA encaissés
  if (dayOfMonth >= 15 && breakdown.totalIncomes < 150000) {
    alerts.push({
      type: 'danger',
      message: "ALERTE COMMERCIALE (15 du mois) : Moins de 150 000 FCFA encaissés à mi-parcours. Relancer les artistes réguliers et proposer des sessions en promotion."
    });
  }

  // Règle 2 : le 25 du mois, si la caisse charges < 300 000 FCFA
  if (dayOfMonth >= 25 && breakdown.fixedChargesCovered < breakdown.fixedTarget) {
    alerts.push({
      type: 'danger',
      message: `ALERTE TRÉSORERIE (25 du mois) : Caisse charges incomplètes (${formatFCFA(breakdown.fixedChargesCovered)} / ${formatFCFA(breakdown.fixedTarget)}). Risque sur le paiement du loyer ou de la Senelec.`
    });
  }

  // Règle 3 : Matériel dehors à surveiller
  if (activeRentals.length > 0) {
    alerts.push({
      type: 'info',
      message: `${activeRentals.length} matériel(s) actuellement en location extérieure (Sony A7IV, DJI RS3). CNI et cautions consignées.`
    });
  }

  return (
    <div className="space-y-6">
      {/* Bannière de Bienvenue & Statut Rôle */}
      <div className="bg-gradient-to-r from-surface-secondary via-surface to-surface-secondary border border-surface-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-white text-xl">
              Tableau de bord Seven Truth
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
              Thiès, Sénégal
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Supervision complète en temps réel du studio, plateau podcast, parc matériel et finances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-zinc-500 block">Profil actif</span>
            <span className="text-sm font-bold text-gold capitalize">{currentRole}</span>
          </div>
        </div>
      </div>

      {/* Alertes Automatiques actives */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alt, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs sm:text-sm ${
                alt.type === 'danger'
                  ? 'bg-red-950/60 border-red-800 text-red-200'
                  : alt.type === 'warning'
                  ? 'bg-amber-950/60 border-amber-800 text-amber-200'
                  : 'bg-blue-950/60 border-blue-800 text-blue-200'
              }`}
            >
              <Bell className="w-5 h-5 flex-shrink-0 mt-0.5 text-gold" />
              <div className="flex-1">{alt.message}</div>
            </div>
          ))}
        </div>
      )}

      {/* Cartes KPI Principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-surface-secondary border border-surface-border rounded-2xl space-y-1">
          <span className="text-xs text-zinc-400 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-green-400" />
            Encaissé du Mois
          </span>
          <div className="text-xl sm:text-2xl font-display font-bold text-green-400">
            {formatFCFA(breakdown.totalIncomes)}
          </div>
          <span className="text-[11px] text-zinc-500 block">Wave, OM & Espèces</span>
        </div>

        <div className="p-4 bg-surface-secondary border border-surface-border rounded-2xl space-y-1">
          <span className="text-xs text-zinc-400 flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-red-400" />
            Dépenses Saisies
          </span>
          <div className="text-xl sm:text-2xl font-display font-bold text-red-400">
            {formatFCFA(breakdown.totalExpenses)}
          </div>
          <span className="text-[11px] text-zinc-500 block">Avec justificatifs obligatoires</span>
        </div>

        <div className="p-4 bg-surface-secondary border border-surface-border rounded-2xl space-y-1">
          <span className="text-xs text-zinc-400 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-gold" />
            Bénéfice Net
          </span>
          <div className="text-xl sm:text-2xl font-display font-bold text-gold">
            {formatFCFA(breakdown.netProfit)}
          </div>
          <span className="text-[11px] text-zinc-500 block">Après charges & frais</span>
        </div>

        <div className="p-4 bg-surface-secondary border border-surface-border rounded-2xl space-y-1">
          <span className="text-xs text-zinc-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            Reste à Encaisser
          </span>
          <div className="text-xl sm:text-2xl font-display font-bold text-amber-400">
            {formatFCFA(pendingToCollect)}
          </div>
          <span className="text-[11px] text-zinc-500 block">Soldes des réservations</span>
        </div>
      </div>

      {/* Progression vers les Objectifs (300k charges / 630k objectif) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Jauge 1 : Charges Fixes */}
        <div className="p-5 bg-surface-secondary border border-surface-border rounded-2xl space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                Charges Fixes Studio (300 000 FCFA)
              </h3>
              <p className="text-xs text-zinc-400">Loyer appartement, Senelec, Wifi, Eau, Pub</p>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              breakdown.fixedChargesProgress >= 100
                ? 'bg-green-500/20 text-green-300'
                : 'bg-amber-500/20 text-amber-300'
            }`}>
              {breakdown.fixedChargesProgress}%
            </span>
          </div>
          <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-surface-border p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                breakdown.fixedChargesProgress >= 100 ? 'bg-green-500' : 'bg-gold'
              }`}
              style={{ width: `${breakdown.fixedChargesProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-zinc-400 font-mono">
            <span>Encaissé : {formatFCFA(breakdown.fixedChargesCovered)}</span>
            <span>Objectif : {formatFCFA(breakdown.fixedTarget)}</span>
          </div>
        </div>

        {/* Jauge 2 : Objectif Mensuel Total (630 000 FCFA) */}
        <div className="p-5 bg-surface-secondary border border-surface-border rounded-2xl space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                Objectif de Rentabilité (630 000 FCFA)
              </h3>
              <p className="text-xs text-zinc-400">Seuil de bénéfice confort pour le label & investisseur</p>
            </div>
            {(() => {
              const goal = settings.financial_rules.monthly_revenue_goal;
              const pct = Math.min(100, Math.round((breakdown.totalIncomes / goal) * 100));
              return (
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  pct >= 100 ? 'bg-green-500/20 text-green-300' : 'bg-gold/20 text-gold'
                }`}>
                  {pct}%
                </span>
              );
            })()}
          </div>
          {(() => {
            const goal = settings.financial_rules.monthly_revenue_goal;
            const pct = Math.min(100, Math.round((breakdown.totalIncomes / goal) * 100));
            return (
              <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-surface-border p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pct >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-gold to-gold-light'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            );
          })()}
          <div className="flex justify-between text-xs text-zinc-400 font-mono">
            <span>Actuel : {formatFCFA(breakdown.totalIncomes)}</span>
            <span>Cible : {formatFCFA(settings.financial_rules.monthly_revenue_goal)}</span>
          </div>
        </div>
      </div>

      {/* Prochaines Séances & Matériel Dehors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Prochaines sessions */}
        <div className="p-5 bg-surface-secondary border border-surface-border rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" />
              Prochaines Sessions Confirmées
            </h3>
            <Link href="/admin/calendrier" className="text-xs text-gold hover:underline">
              Voir tout
            </Link>
          </div>

          <div className="space-y-2">
            {upcomingBookings.slice(0, 3).map(b => (
              <div key={b.id} className="p-3 bg-surface border border-surface-border rounded-xl flex items-center justify-between text-xs">
                <div>
                  <strong className="text-white block">{b.client_name}</strong>
                  <span className="text-zinc-400">{b.space_id} • {b.booking_number}</span>
                </div>
                <div className="text-right">
                  <span className="text-gold font-mono block">
                    {new Date(b.start_time).toLocaleDateString('fr-FR')}
                  </span>
                  <span className="text-zinc-500">
                    {new Date(b.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Matériel dehors */}
        <div className="p-5 bg-surface-secondary border border-surface-border rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
              <Camera className="w-4 h-4 text-gold" />
              Matériel en Sortie Extérieure
            </h3>
            <Link href="/admin/locations" className="text-xs text-gold hover:underline">
              Gérer retours
            </Link>
          </div>

          <div className="space-y-2">
            {activeRentals.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 text-xs">
                Aucun matériel dehors. Tout le parc est sécurisé au studio.
              </div>
            ) : (
              activeRentals.map(r => (
                <div key={r.id} className="p-3 bg-surface border border-surface-border rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-gold block">{r.equipment_name}</strong>
                    <span className="text-zinc-400">Client : {r.client_name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-400 font-semibold block">Retour prévu le {r.end_date}</span>
                    <span className="text-zinc-500 font-mono">Caution: {formatFCFA(r.deposit_amount)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
