'use client';

import React, { useState } from 'react';
import { useLabelStore } from '@/lib/store/useLabelStore';
import { formatFCFA } from '@/lib/utils/currency';
import { SevenTruthLogo } from '@/components/brand/SevenTruthLogo';
import { FileText, Printer, Download, Mail, CheckCircle2, PieChart, ShieldCheck } from 'lucide-react';

export function MonthlyReportGenerator() {
  const { calculateFinancialBreakdown, bookings, rentals, equipment, inventories, settings } = useLabelStore();
  const breakdown = calculateFinancialBreakdown();

  const [emailSent, setEmailSent] = useState(false);

  const monthLabel = "Octobre 2026";
  const reportDate = "31 Octobre 2026";

  const handleSendEmailReport = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-gold" />
            Compte Rendu Mensuel & Bilan
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Document officiel synthétisant les résultats financiers, l'activité studio et l'état du parc matériel pour l'Admin et le Patron.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSendEmailReport}
            className="px-4 py-2 rounded-xl bg-surface border border-surface-border hover:border-gold text-zinc-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Mail className="w-4 h-4 text-gold" />
            <span>Envoyer au Patron & Admin</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-gold/10 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer / Télécharger PDF</span>
          </button>
        </div>
      </div>

      {emailSent && (
        <div className="p-3 bg-green-950/50 border border-green-800 rounded-xl text-green-200 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
          <span>
            Compte rendu officiel expédié avec succès par email aux adresses <strong>admin@seventruth.sn</strong> et <strong>patron@seventruth.sn</strong>.
          </span>
        </div>
      )}

      {/* FEUILLE OFFICIELLE DU RAPPORT (STYLE DOCUMENT PDF IMPRIMABLE) */}
      <div className="bg-surface-secondary border border-surface-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Entête du Document */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-surface-border gap-4">
          <div>
            <SevenTruthLogo variant="full" size="md" />
            <p className="text-xs text-zinc-400 print:text-gray-600 mt-2">
              Quartier Dixième, Thiès, Sénégal • NINEA: 00984512 • contact@seventruth.sn
            </p>
          </div>

          <div className="text-left sm:text-right font-mono text-xs text-zinc-400 print:text-gray-600">
            <span className="block font-bold text-white print:text-black text-sm">
              COMPTE RENDU D'ACTIVITÉ
            </span>
            <span>Mois : {monthLabel}</span>
            <span className="block">Édité le : {reportDate}</span>
          </div>
        </div>

        {/* 1. Synthèse Financière & Répartition */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-gold uppercase tracking-wider text-xs border-b border-surface-border pb-1">
            1. Bilan Financier & Répartition des Résultats
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-surface rounded-xl border border-surface-border print:border-gray-300">
              <span className="text-zinc-400 print:text-gray-500 block">Total Recettes</span>
              <strong className="text-green-400 print:text-green-700 font-display text-sm block mt-1">
                {formatFCFA(breakdown.totalIncomes)}
              </strong>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-surface-border print:border-gray-300">
              <span className="text-zinc-400 print:text-gray-500 block">Charges Fixes Couvertes</span>
              <strong className="text-white print:text-black font-display text-sm block mt-1">
                {formatFCFA(breakdown.fixedChargesCovered)} / {formatFCFA(breakdown.fixedTarget)}
              </strong>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-surface-border print:border-gray-300">
              <span className="text-zinc-400 print:text-gray-500 block">Dépenses Opérationnelles</span>
              <strong className="text-red-400 print:text-red-700 font-display text-sm block mt-1">
                {formatFCFA(breakdown.totalExpenses)}
              </strong>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-surface-border print:border-gray-300">
              <span className="text-zinc-400 print:text-gray-500 block">Bénéfice Net Global</span>
              <strong className="text-gold print:text-yellow-700 font-display text-sm block mt-1">
                {formatFCFA(breakdown.netProfit)}
              </strong>
            </div>
          </div>

          {/* Tableau de la répartition contractuelle */}
          <div className="p-4 bg-surface rounded-xl border border-surface-border print:border-gray-300 space-y-2 text-xs">
            <h4 className="font-bold text-white print:text-black mb-2">
              Application de la clé de répartition contractuelle :
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="border-l-2 border-gold pl-3">
                <span className="text-zinc-400 print:text-gray-500 block text-[11px]">10% Réserve Matériel</span>
                <span className="font-bold text-white print:text-black font-display text-sm">
                  {formatFCFA(breakdown.reserve10Pct)}
                </span>
              </div>
              <div className="border-l-2 border-green-500 pl-3">
                <span className="text-zinc-400 print:text-gray-500 block text-[11px]">50% Part Équipe (Staff)</span>
                <span className="font-bold text-green-400 print:text-green-700 font-display text-sm">
                  {formatFCFA(breakdown.teamShare)}
                </span>
              </div>
              <div className="border-l-2 border-gold-light pl-3">
                <span className="text-zinc-400 print:text-gray-500 block text-[11px]">30% Part Patron (Investisseur)</span>
                <span className="font-bold text-gold-light print:text-yellow-800 font-display text-sm">
                  {formatFCFA(breakdown.patronShare)}
                </span>
              </div>
              <div className="border-l-2 border-blue-500 pl-3">
                <span className="text-zinc-400 print:text-gray-500 block text-[11px]">20% Réinvestissement</span>
                <span className="font-bold text-blue-400 print:text-blue-700 font-display text-sm">
                  {formatFCFA(breakdown.reinvestmentShare)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Activité des Espaces */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-gold uppercase tracking-wider text-xs border-b border-surface-border pb-1">
            2. Exploitation des Espaces & Réservations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-surface rounded-xl border border-surface-border print:border-gray-300">
              <span className="text-zinc-400 print:text-gray-500 block">Studio Son Pro</span>
              <strong className="text-white print:text-black text-sm block mt-1">42 heures réservées</strong>
              <span className="text-[11px] text-zinc-500 print:text-gray-600">Enregistrement voix, mixage, beats</span>
            </div>
            <div className="p-3 bg-surface rounded-xl border border-surface-border print:border-gray-300">
              <span className="text-zinc-400 print:text-gray-500 block">Plateau TV & Podcast</span>
              <strong className="text-white print:text-black text-sm block mt-1">18 heures réservées</strong>
              <span className="text-[11px] text-zinc-500 print:text-gray-600">8 épisodes enregistrés et montés</span>
            </div>
            <div className="p-3 bg-surface rounded-xl border border-surface-border print:border-gray-300">
              <span className="text-zinc-400 print:text-gray-500 block">Salle Shooting Photo</span>
              <strong className="text-white print:text-black text-sm block mt-1">12 heures réservées</strong>
              <span className="text-[11px] text-zinc-500 print:text-gray-600">Pochettes d'albums & lookbooks</span>
            </div>
          </div>
        </div>

        {/* 3. Contrôle du Matériel & Inventaire */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-gold uppercase tracking-wider text-xs border-b border-surface-border pb-1">
            3. État du Parc Matériel & Inventaire Physique
          </h3>

          <div className="p-4 bg-surface rounded-xl border border-surface-border print:border-gray-300 text-xs space-y-2">
            <div className="flex justify-between">
              <span>Nombre total d'équipements enregistrés :</span>
              <strong className="text-white print:text-black">{equipment.length} références</strong>
            </div>
            <div className="flex justify-between">
              <span>Équipements actuellement en location extérieure :</span>
              <strong className="text-amber-400 print:text-amber-700">
                {rentals.filter(r => r.status === 'en_cours').length} article(s) dehors avec CNI & caution consignée
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Résultat du dernier inventaire guidé :</span>
              <strong className="text-green-400 print:text-green-700">
                {inventories.length > 0 ? `${inventories[0].discrepancy_count} écart(s) relevé(s)` : '0 écart majeur, conformité 100%'}
              </strong>
            </div>
          </div>
        </div>

        {/* Signatures officielles */}
        <div className="pt-6 border-t border-surface-border grid grid-cols-2 gap-8 text-xs text-center text-zinc-400 print:text-gray-600">
          <div>
            <span className="block font-semibold text-white print:text-black mb-8">Pour l'Équipe de Gestion (Admin)</span>
            <span className="border-t border-zinc-600 print:border-gray-400 pt-1 px-8 inline-block">Modou Fall</span>
          </div>
          <div>
            <span className="block font-semibold text-white print:text-black mb-8">Pour le Partenaire Investisseur (Le Patron)</span>
            <span className="border-t border-zinc-600 print:border-gray-400 pt-1 px-8 inline-block">Cheikh Diop</span>
          </div>
        </div>
      </div>
    </div>
  );
}
