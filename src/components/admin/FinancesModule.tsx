'use client';

import React, { useState } from 'react';
import { useLabelStore } from '@/lib/store/useLabelStore';
import { Transaction, TransactionType, TransactionCategory, PaymentMethod } from '@/lib/types';
import { formatFCFA } from '@/lib/utils/currency';
import {
  DollarSign, TrendingUp, TrendingDown, Plus, AlertCircle,
  FileText, ShieldCheck, CheckCircle2, PieChart, Lock, Eye, X, Upload
} from 'lucide-react';

export function FinancesModule() {
  const { transactions, addTransaction, calculateFinancialBreakdown, currentRole, settings } = useLabelStore();
  const isReadOnly = currentRole === 'patron';

  const breakdown = calculateFinancialBreakdown();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'entree' | 'sortie'>('all');

  // Formulaire transaction
  const [type, setType] = useState<TransactionType>('sortie');
  const [category, setCategory] = useState<TransactionCategory>('loyer');
  const [amount, setAmount] = useState<number>(15000);
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wave');
  const [receiptPhotoUrl, setReceiptPhotoUrl] = useState('');
  const [isFixedCharge, setIsFixedCharge] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOpenAddModal = (defaultType: TransactionType = 'sortie') => {
    setType(defaultType);
    if (defaultType === 'sortie') {
      setCategory('electricite');
      setIsFixedCharge(true);
    } else {
      setCategory('prestations');
      setIsFixedCharge(false);
    }
    setAmount(15000);
    setDescription('');
    setPaymentMethod('wave');
    setReceiptPhotoUrl('');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (amount <= 0) {
      setErrorMsg("Le montant doit être supérieur à 0 FCFA.");
      return;
    }

    // VÉRIFICATION STRICTE DE LA PHOTO DU REÇU POUR TOUTE DÉPENSE
    if (type === 'sortie' && (!receiptPhotoUrl || receiptPhotoUrl.trim().length === 0)) {
      setErrorMsg("RÈGLE STRICTE TRANSPARENCE : La photo ou le scan du reçu est obligatoire pour valider toute dépense.");
      return;
    }

    const result = addTransaction({
      date: new Date().toISOString().split('T')[0],
      type,
      category,
      amount,
      description,
      receipt_photo_url: type === 'sortie' ? receiptPhotoUrl : undefined,
      payment_method: paymentMethod,
      is_fixed_charge: isFixedCharge,
      created_by_name: currentRole === 'admin' ? 'Modou Fall' : 'Staff Seven Truth'
    });

    if (!result.success) {
      setErrorMsg(result.error || "Erreur lors de l'enregistrement de l'opération.");
      return;
    }

    setIsModalOpen(false);
  };

  const filteredTransactions = transactions.filter(t => filterType === 'all' || t.type === filterType);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-gold" />
            Finances & Caisse Charges
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Transparence intégrale des entrées et sorties du studio Seven Truth à Thiès.
          </p>
        </div>

        {!isReadOnly && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleOpenAddModal('entree')}
              className="px-3.5 py-2 rounded-xl bg-surface border border-surface-border hover:border-green-500 text-green-300 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>Saisir Entrée</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenAddModal('sortie')}
              className="px-3.5 py-2 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-gold/10 transition-all active:scale-95"
            >
              <TrendingDown className="w-4 h-4" />
              <span>Saisir Dépense (Reçu Requis)</span>
            </button>
          </div>
        )}
      </div>

      {/* Cartes Métriques Synthèse */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-surface-secondary border border-surface-border rounded-2xl space-y-1">
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-green-400" />
            Total Recettes
          </span>
          <div className="text-xl sm:text-2xl font-display font-bold text-green-400">
            {formatFCFA(breakdown.totalIncomes)}
          </div>
        </div>

        <div className="p-4 bg-surface-secondary border border-surface-border rounded-2xl space-y-1">
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
            Total Dépenses
          </span>
          <div className="text-xl sm:text-2xl font-display font-bold text-red-400">
            {formatFCFA(breakdown.totalExpenses)}
          </div>
        </div>

        <div className="p-4 bg-surface-secondary border border-surface-border rounded-2xl space-y-1">
          <span className="text-xs text-zinc-400">Bénéfice Net Réalisé</span>
          <div className="text-xl sm:text-2xl font-display font-bold text-gold">
            {formatFCFA(breakdown.netProfit)}
          </div>
        </div>

        <div className="p-4 bg-surface-secondary border border-surface-border rounded-2xl space-y-1">
          <span className="text-xs text-zinc-400">Objectif Mensuel</span>
          <div className="text-xl sm:text-2xl font-display font-bold text-white">
            {formatFCFA(settings.financial_rules.monthly_revenue_goal)}
          </div>
        </div>
      </div>

      {/* Jauge Caisse Charges Fixes (Objectif 300 000 FCFA) */}
      <div className="p-5 bg-surface-secondary border border-surface-border rounded-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-gold" />
              Caisse des Charges Fixes (Loyer, Senelec, Eau, Fibre, Transport)
            </h3>
            <p className="text-xs text-zinc-400">
              Seuil critique mensuel du studio de Thiès : 300 000 FCFA. Les charges sont prélevées en priorité avant tout partage.
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-white font-mono">
              {formatFCFA(breakdown.fixedChargesCovered)} / {formatFCFA(breakdown.fixedTarget)}
            </span>
            <span className={`block text-xs font-semibold ${breakdown.fixedChargesProgress >= 100 ? 'text-green-400' : 'text-amber-400'}`}>
              {breakdown.fixedChargesProgress}% couvert
            </span>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-surface-border p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              breakdown.fixedChargesProgress >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-amber-500 to-gold'
            }`}
            style={{ width: `${breakdown.fixedChargesProgress}%` }}
          />
        </div>
      </div>

      {/* Moteur de Répartition de Fin de Mois (Conforme §4.5) */}
      <div className="p-5 bg-surface-secondary border border-surface-border rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-gold" />
            Simulation Clôture Mensuelle & Répartition des Bénéfices
          </h3>
          <span className="text-xs text-gold bg-gold/10 px-2.5 py-1 rounded-full border border-gold/30">
            Automatisée
          </span>
        </div>

        <p className="text-xs text-zinc-400">
          Formule contractuelle : Charges fixes prioritaires → <strong>10% Réserve Matériel</strong> → Reste distribué : <strong>50% Équipe / 30% Patron / 20% Réinvestissement</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-surface border border-surface-border rounded-xl">
            <span className="text-zinc-500 text-xs block">10% Réserve Matériel</span>
            <strong className="text-gold font-display text-base block mt-1">
              {formatFCFA(breakdown.reserve10Pct)}
            </strong>
            <span className="text-[10px] text-zinc-400">Caisse renouvellement</span>
          </div>

          <div className="p-3 bg-surface border border-surface-border rounded-xl">
            <span className="text-zinc-500 text-xs block">50% Part Équipe (Staff)</span>
            <strong className="text-green-400 font-display text-base block mt-1">
              {formatFCFA(breakdown.teamShare)}
            </strong>
            <span className="text-[10px] text-zinc-400">Ingénieurs & gestionnaires</span>
          </div>

          <div className="p-3 bg-surface border border-surface-border rounded-xl">
            <span className="text-zinc-500 text-xs block">30% Part Patron</span>
            <strong className="text-gold-light font-display text-base block mt-1">
              {formatFCFA(breakdown.patronShare)}
            </strong>
            <span className="text-[10px] text-zinc-400">Rémunération du matériel</span>
          </div>

          <div className="p-3 bg-surface border border-surface-border rounded-xl">
            <span className="text-zinc-500 text-xs block">20% Réinvestissement</span>
            <strong className="text-blue-400 font-display text-base block mt-1">
              {formatFCFA(breakdown.reinvestmentShare)}
            </strong>
            <span className="text-[10px] text-zinc-400">Studio & communication</span>
          </div>
        </div>
      </div>

      {/* Journal des Transactions avec vérification des reçus */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Journal Financier Détaillé</h3>
          <div className="flex gap-1 bg-surface p-1 rounded-xl border border-surface-border">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${filterType === 'all' ? 'bg-gold text-background' : 'text-zinc-400 hover:text-white'}`}
            >
              Tout
            </button>
            <button
              onClick={() => setFilterType('entree')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${filterType === 'entree' ? 'bg-gold text-background' : 'text-zinc-400 hover:text-white'}`}
            >
              Entrées
            </button>
            <button
              onClick={() => setFilterType('sortie')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${filterType === 'sortie' ? 'bg-gold text-background' : 'text-zinc-400 hover:text-white'}`}
            >
              Dépenses
            </button>
          </div>
        </div>

        <div className="bg-surface-secondary border border-surface-border rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-surface border-b border-surface-border text-zinc-400 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Catégorie</th>
                  <th className="py-3 px-4">Paiement</th>
                  <th className="py-3 px-4">Reçu Photo</th>
                  <th className="py-3 px-4">Saisi Par</th>
                  <th className="py-3 px-4 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-zinc-300">
                {filteredTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-zinc-400">{t.date}</td>
                    <td className="py-3 px-4 font-medium text-white max-w-xs">{t.description}</td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded text-[11px] bg-surface border border-surface-border text-zinc-300">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 uppercase text-xs font-mono text-zinc-400">{t.payment_method}</td>
                    <td className="py-3 px-4">
                      {t.receipt_photo_url ? (
                        <button
                          type="button"
                          onClick={() => setSelectedReceiptUrl(t.receipt_photo_url || null)}
                          className="px-2 py-1 rounded bg-surface border border-surface-border hover:border-gold text-gold text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Voir Reçu</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-zinc-500 italic">Non requis</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-400">{t.created_by_name}</td>
                    <td className={`py-3 px-4 text-right font-display font-bold text-sm ${
                      t.type === 'entree' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {t.type === 'entree' ? '+' : '-'}{formatFCFA(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODALE VISUALISATION DU REÇU PHOTO */}
      {selectedReceiptUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-secondary border border-surface-border rounded-2xl p-4 max-w-md w-full space-y-3 relative shadow-2xl">
            <button
              onClick={() => setSelectedReceiptUrl(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="font-bold text-white text-sm">Pièce Justificative & Reçu de Dépense</h4>
            <div className="max-h-[70vh] overflow-hidden rounded-xl border border-surface-border bg-black">
              <img
                src={selectedReceiptUrl}
                alt="Reçu de paiement"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[11px] text-zinc-400 text-center">
              Reçu authentifié conforme aux exigences de transparence Seven Truth.
            </p>
          </div>
        </div>
      )}

      {/* MODALE SAISIE D'OPÉRATION AVEC PHOTO OBLIGATOIRE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveTransaction}
            className="bg-surface-secondary border border-surface-border rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-lg font-bold text-white">
                {type === 'sortie' ? 'Saisir une Dépense' : 'Saisir une Entrée d\'Argent'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-200">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Type d'opération
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
                >
                  <option value="sortie">Dépense (Sortie)</option>
                  <option value="entree">Recette (Entrée)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Montant (FCFA) *
                </label>
                <input
                  type="number"
                  required
                  min="500"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white font-mono text-sm focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Catégorie
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold capitalize"
                >
                  <option value="loyer">Loyer Studio Thiès</option>
                  <option value="electricite">Électricité Senelec (Woyofal)</option>
                  <option value="eau">Eau Sen'Eau</option>
                  <option value="wifi">Wifi Fibre Orange</option>
                  <option value="publicite">Publicité (Meta/TikTok)</option>
                  <option value="consommables">Consommables & Café</option>
                  <option value="transport">Transport</option>
                  <option value="maintenance">Maintenance Matériel</option>
                  <option value="prestations">Prestations Audio/Vidéo</option>
                  <option value="materiel">Location Matériel</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Moyen de paiement
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold uppercase"
                >
                  <option value="wave">Wave</option>
                  <option value="orange_money">Orange Money</option>
                  <option value="especes">Espèces</option>
                  <option value="virement">Virement bancaire</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                Description détaillée de l'opération *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Facture Senelec recharge Woyofal studio"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
              />
            </div>

            {/* CHAMP PHOTO OBLIGATOIRE POUR DÉPENSE */}
            {type === 'sortie' && (
              <div className="p-3 bg-surface border border-amber-800/60 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                  <Upload className="w-4 h-4" />
                  Photo du reçu obligatoire *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://... (Ex: lien Supabase Storage ou photo hébergée)"
                  value={receiptPhotoUrl}
                  onChange={(e) => setReceiptPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-secondary border border-surface-border rounded-lg text-white text-xs font-mono focus:outline-none focus:border-gold"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReceiptPhotoUrl('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80')}
                    className="text-[11px] text-gold hover:underline"
                  >
                    Utiliser un reçu de démonstration
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-surface-border">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-border text-zinc-300 text-xs"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs"
              >
                Enregistrer dans la comptabilité
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
