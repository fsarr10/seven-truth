'use client';

import React, { useState } from 'react';
import { useLabelStore } from '@/lib/store/useLabelStore';
import { Rental } from '@/lib/types';
import { formatFCFA } from '@/lib/utils/currency';
import { getWhatsAppRentalLink } from '@/lib/utils/whatsapp';
import {
  Camera, Plus, CheckCircle2, AlertTriangle, Clock, User,
  FileText, ShieldCheck, ArrowRight, Share2, Search, X
} from 'lucide-react';

export function RentalsModule() {
  const { rentals, equipment, addRental, returnRental, currentRole } = useLabelStore();
  const isReadOnly = currentRole === 'patron';

  const [searchTerm, setSearchTerm] = useState('');
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [selectedRentalForReturn, setSelectedRentalForReturn] = useState<Rental | null>(null);

  // Formulaire Sortie de matériel
  const [clientIdCard, setClientIdCard] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+221 ');
  const [equipmentId, setEquipmentId] = useState(equipment[0]?.id || '');
  const [daysCount, setDaysCount] = useState<number>(1);
  const [conditionOut, setConditionOut] = useState('Parfait état, nettoyé, batterie pleine');
  const [photoOutUrl, setPhotoOutUrl] = useState('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Formulaire Retour de matériel
  const [conditionIn, setConditionIn] = useState('Matériel retourné propre et fonctionnel');
  const [depositDeduction, setDepositDeduction] = useState<number>(0);
  const [deductionReason, setDeductionReason] = useState('');

  const selectedEq = equipment.find(e => e.id === equipmentId);

  const handleCheckOut = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedEq) {
      setErrorMsg("Veuillez sélectionner un équipement.");
      return;
    }
    if (!clientName.trim() || !clientIdCard.trim() || clientPhone.length < 9) {
      setErrorMsg("Veuillez remplir toutes les informations d'identification du client (CNI obligatoire).");
      return;
    }

    const startDate = new Date().toISOString().split('T')[0];
    const endDateObj = new Date();
    endDateObj.setDate(endDateObj.getDate() + daysCount);
    const endDate = endDateObj.toISOString().split('T')[0];

    const totalPrice = selectedEq.daily_price * daysCount;

    const result = addRental({
      client_name: clientName,
      client_phone: clientPhone,
      client_id_card: clientIdCard,
      equipment_id: selectedEq.id,
      quantity: 1,
      start_date: startDate,
      end_date: endDate,
      days_count: daysCount,
      total_price: totalPrice,
      deposit_amount: selectedEq.deposit_required,
      deposit_paid: true,
      condition_out: conditionOut,
      photos_out: [photoOutUrl],
      status: 'en_cours'
    });

    if (!result.success) {
      setErrorMsg(result.error || "Impossible d'enregistrer la location.");
      return;
    }

    setIsCheckOutOpen(false);
  };

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRentalForReturn) return;

    returnRental(selectedRentalForReturn.id, {
      condition_in: conditionIn,
      photos_in: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80'],
      deposit_deduction: depositDeduction,
      deduction_reason: deductionReason
    });

    setSelectedRentalForReturn(null);
  };

  const filteredRentals = rentals.filter(r =>
    r.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.rental_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.equipment_name && r.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Camera className="w-6 h-6 text-gold" />
            Suivi des Locations & Prêts
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Enregistrement des sorties avec CNI et caution. Retours avec contrôle d'état photographique.
          </p>
        </div>

        {!isReadOnly && (
          <button
            type="button"
            onClick={() => {
              setIsCheckOutOpen(true);
              setErrorMsg(null);
            }}
            className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-gold/10 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Sortie Matériel</span>
          </button>
        )}
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Rechercher par client, référence location (ex: 7T-LOC-2026-08), matériel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-surface border border-surface-border rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold"
        />
      </div>

      {/* Tableau des locations */}
      <div className="bg-surface-secondary border border-surface-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-surface border-b border-surface-border text-zinc-400 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Réf & Date</th>
                <th className="py-3 px-4">Client & CNI</th>
                <th className="py-3 px-4">Matériel Sorti</th>
                <th className="py-3 px-4">Période</th>
                <th className="py-3 px-4">Caution & Montant</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-zinc-300">
              {filteredRentals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500">
                    Aucune location enregistrée pour le moment.
                  </td>
                </tr>
              ) : (
                filteredRentals.map(r => (
                  <tr key={r.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-white block">{r.rental_number}</span>
                      <span className="text-[11px] text-zinc-500">
                        {r.created_at.split('T')[0]}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-white block">{r.client_name}</strong>
                      <span className="text-[11px] text-zinc-400 block">{r.client_phone}</span>
                      <span className="text-[10px] text-zinc-500 font-mono block">CNI: {r.client_id_card}</span>
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-gold block">{r.equipment_name || r.equipment_id}</strong>
                      <span className="text-[11px] text-zinc-400">
                        État départ : {r.condition_out || 'Vérifié'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono">
                      <span>Du {r.start_date}</span>
                      <span className="block text-zinc-400">Au {r.end_date} ({r.days_count} j)</span>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className="text-white font-semibold block">{formatFCFA(r.total_price)}</span>
                      <span className="text-zinc-400 text-[11px]">Caution : {formatFCFA(r.deposit_amount)}</span>
                      {r.deposit_deduction ? (
                        <span className="text-red-400 block text-[10px]">
                          Retenue : -{formatFCFA(r.deposit_deduction)} ({r.deduction_reason})
                        </span>
                      ) : null}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        r.status === 'en_cours'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                          : r.status === 'retourne'
                          ? 'bg-green-950/80 text-green-300 border border-green-800'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {r.status === 'en_cours' ? 'Matériel dehors' : r.status === 'retourne' ? 'Retourné' : r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={getWhatsAppRentalLink({
                            rental_number: r.rental_number,
                            client_name: r.client_name,
                            equipment_name: r.equipment_name || r.equipment_id,
                            start_date: r.start_date,
                            end_date: r.end_date,
                            days_count: r.days_count,
                            total_price: r.total_price,
                            deposit_amount: r.deposit_amount
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 transition-colors"
                          title="Partager contrat sur WhatsApp"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </a>

                        {!isReadOnly && r.status === 'en_cours' && (
                          <button
                            type="button"
                            onClick={() => setSelectedRentalForReturn(r)}
                            className="px-2.5 py-1 rounded-lg bg-gold hover:bg-gold-light text-background font-bold text-xs flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Retour</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALE SORTIE DE MATÉRIEL */}
      {isCheckOutOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCheckOut}
            className="bg-surface-secondary border border-surface-border rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-gold" />
                Sortie de Matériel (Contrat de Location)
              </h3>
              <button
                type="button"
                onClick={() => setIsCheckOutOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl text-xs text-red-200">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                Matériel à louer *
              </label>
              <select
                value={equipmentId}
                onChange={(e) => setEquipmentId(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
              >
                {equipment.map(e => (
                  <option key={e.id} value={e.id} disabled={e.available_quantity <= 0}>
                    {e.name} — {formatFCFA(e.daily_price)}/j (Caution: {formatFCFA(e.deposit_required)}) {e.available_quantity <= 0 ? '[INDISPONIBLE]' : `[Dispo: ${e.available_quantity}]`}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Nom du Client / Agence *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ibrahima Cissé"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Téléphone (+221) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+221 77 123 45 67"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm font-mono focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                N° Carte d'identité nationale (CNI) ou Passeport *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: CNI 1 254 1992 04512"
                value={clientIdCard}
                onChange={(e) => setClientIdCard(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm font-mono focus:outline-none focus:border-gold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Nombre de jours de location
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={daysCount}
                  onChange={(e) => setDaysCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Total calculé
                </label>
                <div className="px-3 py-2 bg-surface border border-surface-border rounded-xl text-gold font-bold text-sm">
                  {formatFCFA((selectedEq?.daily_price || 0) * daysCount)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                État de départ constaté & accessoires remis
              </label>
              <input
                type="text"
                value={conditionOut}
                onChange={(e) => setConditionOut(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div className="p-3 bg-surface border border-surface-border rounded-xl text-xs text-zinc-300 space-y-1">
              <div className="flex justify-between">
                <span>Caution obligatoire à déposer :</span>
                <strong className="text-white">{formatFCFA(selectedEq?.deposit_required || 0)}</strong>
              </div>
              <p className="text-[11px] text-zinc-500">
                La caution est consignée et restituée après inspection au retour.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-surface-border">
              <button
                type="button"
                onClick={() => setIsCheckOutOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-border text-zinc-300 text-xs"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs"
              >
                Valider la sortie & Encaisser
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODALE RETOUR ET CONTRÔLE MATÉRIEL */}
      {selectedRentalForReturn && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCheckIn}
            className="bg-surface-secondary border border-surface-border rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Contrôle Retour Matériel</h3>
                <span className="text-xs text-gold font-mono">{selectedRentalForReturn.rental_number}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRentalForReturn(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-surface rounded-xl text-xs space-y-1">
              <p>Client : <strong className="text-white">{selectedRentalForReturn.client_name}</strong></p>
              <p>Matériel : <strong className="text-gold">{selectedRentalForReturn.equipment_name}</strong></p>
              <p>Caution initiale versée : <strong>{formatFCFA(selectedRentalForReturn.deposit_amount)}</strong></p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                État au retour & vérification pièces
              </label>
              <textarea
                rows={2}
                required
                value={conditionIn}
                onChange={(e) => setConditionIn(e.target.value)}
                className="w-full p-2.5 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                Retenue sur caution (en FCFA en cas de dommage ou retard)
              </label>
              <input
                type="number"
                min="0"
                max={selectedRentalForReturn.deposit_amount}
                value={depositDeduction}
                onChange={(e) => setDepositDeduction(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
              />
            </div>

            {depositDeduction > 0 && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Motif de la retenue sur caution
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rayure sur verre d'objectif, retard 1 jour..."
                  value={deductionReason}
                  onChange={(e) => setDeductionReason(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
                />
              </div>
            )}

            <div className="p-3 bg-surface border border-surface-border rounded-xl flex justify-between text-xs font-bold">
              <span>Montant caution à restituer au client :</span>
              <span className="text-green-400 font-display text-sm">
                {formatFCFA(selectedRentalForReturn.deposit_amount - depositDeduction)}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-surface-border">
              <button
                type="button"
                onClick={() => setSelectedRentalForReturn(null)}
                className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-border text-zinc-300 text-xs"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs"
              >
                Confirmer la réintégration en stock
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
