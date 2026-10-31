'use client';

import React, { useState } from 'react';
import { useLabelStore } from '@/lib/store/useLabelStore';
import { Booking, BookingStatus } from '@/lib/types';
import { formatFCFA } from '@/lib/utils/currency';
import {
  Calendar as CalendarIcon, Clock, Plus, PhoneCall, CheckCircle2,
  AlertTriangle, Filter, ChevronLeft, ChevronRight, X
} from 'lucide-react';

export function CalendarModule() {
  const { bookings, spaces, services, updateBookingStatus, addBooking, currentRole } = useLabelStore();
  const isReadOnly = currentRole === 'patron';

  const [selectedSpaceFilter, setSelectedSpaceFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);

  // Formulaire réservation manuelle par téléphone
  const [manualClientName, setManualClientName] = useState('');
  const [manualClientPhone, setManualClientPhone] = useState('+221 ');
  const [manualSpaceId, setManualSpaceId] = useState(spaces[0]?.id || 'studio-son');
  const [manualServiceId, setManualServiceId] = useState(services[0]?.id || 'studio-heure');
  const [manualDate, setManualDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [manualStartTime, setManualStartTime] = useState('14:00');
  const [manualEndTime, setManualEndTime] = useState('16:00');
  const [manualAmount, setManualAmount] = useState<number>(20000);
  const [manualPaidAmount, setManualPaidAmount] = useState<number>(10000);
  const [manualNotes, setManualNotes] = useState('Réservation téléphonique prise par le staff');
  const [manualError, setManualError] = useState<string | null>(null);

  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError(null);

    if (!manualClientName.trim() || manualClientPhone.length < 9) {
      setManualError("Veuillez renseigner le nom et le téléphone du client.");
      return;
    }

    const startIso = `${manualDate}T${manualStartTime}:00Z`;
    const endIso = `${manualDate}T${manualEndTime}:00Z`;

    const srv = services.find(s => s.id === manualServiceId);

    const result = addBooking({
      client_name: manualClientName,
      client_phone: manualClientPhone,
      space_id: manualSpaceId,
      service_id: manualServiceId,
      start_time: startIso,
      end_time: endIso,
      options_selected: [],
      total_amount: manualAmount,
      deposit_amount: Math.round(manualAmount * 0.5),
      paid_amount: manualPaidAmount,
      status: manualPaidAmount >= manualAmount ? 'payee' : manualPaidAmount > 0 ? 'confirmee' : 'en_attente',
      source: 'telephone',
      notes: manualNotes,
      is_noisy: srv?.is_noisy || false
    });

    if (!result.success) {
      setManualError(result.error || "Impossible d'enregistrer la réservation.");
      return;
    }

    setIsManualBookingOpen(false);
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSpace = selectedSpaceFilter === 'all' || b.space_id === selectedSpaceFilter;
    return matchesSpace;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-gold" />
            Planning & Réservations Studio
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Gestion du planning des 3 espaces (Studio Son, Plateau TV, Salle Shooting).
          </p>
        </div>

        {!isReadOnly && (
          <button
            type="button"
            onClick={() => {
              setManualError(null);
              setIsManualBookingOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-gold/10 transition-all active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Saisie Manuelle (Téléphone / Sur place)</span>
          </button>
        )}
      </div>

      {/* Filtre par Espace */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedSpaceFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedSpaceFilter === 'all'
              ? 'bg-gold text-background'
              : 'bg-surface border border-surface-border text-zinc-400 hover:text-white'
          }`}
        >
          Tous les espaces
        </button>
        {spaces.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSpaceFilter(s.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSpaceFilter === s.id
                ? 'bg-gold text-background'
                : 'bg-surface border border-surface-border text-zinc-400 hover:text-white'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Liste des réservations avec workflow de statut */}
      <div className="bg-surface-secondary border border-surface-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-surface border-b border-surface-border text-zinc-400 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Réf & Source</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Espace & Service</th>
                <th className="py-3 px-4">Créneau (Heure Thiès)</th>
                <th className="py-3 px-4">Montant & Solde</th>
                <th className="py-3 px-4">Statut</th>
                {!isReadOnly && <th className="py-3 px-4 text-right">Modifier Statut</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-zinc-300">
              {filteredBookings.map(b => {
                const space = spaces.find(s => s.id === b.space_id);
                const service = services.find(s => s.id === b.service_id);

                return (
                  <tr key={b.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-white block">{b.booking_number}</span>
                      <span className="text-[10px] text-zinc-400 capitalize bg-surface px-1.5 py-0.5 rounded border border-surface-border">
                        {b.source}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-white block">{b.client_name}</strong>
                      <span className="text-zinc-400 text-xs block">{b.client_phone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-gold block">{space?.name}</strong>
                      <span className="text-xs text-zinc-400">{service?.name || 'Session personnalisée'}</span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono">
                      <div className="flex items-center gap-1 text-white font-medium">
                        <Clock className="w-3.5 h-3.5 text-gold" />
                        <span>{new Date(b.start_time).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <span className="text-zinc-400">
                        {new Date(b.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Dakar' })} → {new Date(b.end_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Dakar' })}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className="font-semibold text-white block">{formatFCFA(b.total_amount)}</span>
                      <span className="text-green-400 text-[11px]">Payé : {formatFCFA(b.paid_amount)}</span>
                      {b.total_amount > b.paid_amount && (
                        <span className="text-amber-400 text-[10px] block">
                          Reste : {formatFCFA(b.total_amount - b.paid_amount)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        b.status === 'payee'
                          ? 'bg-green-950/80 text-green-300 border border-green-800'
                          : b.status === 'confirmee'
                          ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                          : b.status === 'en_attente'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                          : b.status === 'terminee'
                          ? 'bg-zinc-800 text-zinc-300'
                          : 'bg-red-950/80 text-red-300 border border-red-800'
                      }`}>
                        {b.status === 'en_attente' ? 'En attente' : b.status === 'confirmee' ? 'Confirmée' : b.status === 'payee' ? 'Soldée' : b.status === 'terminee' ? 'Terminée' : 'Annulée'}
                      </span>
                    </td>
                    {!isReadOnly && (
                      <td className="py-3 px-4 text-right">
                        <select
                          value={b.status}
                          onChange={(e) => {
                            const newSt = e.target.value as BookingStatus;
                            const paidAmt = newSt === 'payee' ? b.total_amount : b.paid_amount;
                            updateBookingStatus(b.id, newSt, paidAmt);
                          }}
                          className="px-2 py-1 bg-surface border border-surface-border rounded-lg text-xs text-white focus:outline-none focus:border-gold"
                        >
                          <option value="en_attente">En attente</option>
                          <option value="confirmee">Confirmée</option>
                          <option value="payee">Payée (Soldée)</option>
                          <option value="terminee">Terminée</option>
                          <option value="annulee">Annulée</option>
                        </select>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALE SAISIE MANUELLE TÉLÉPHONIQUE */}
      {isManualBookingOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateManualBooking}
            className="bg-surface-secondary border border-surface-border rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-gold" />
                Saisie Manuelle d'une Réservation
              </h3>
              <button
                type="button"
                onClick={() => setIsManualBookingOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {manualError && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-200">
                {manualError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Nom du Client *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Babacar Diouf"
                  value={manualClientName}
                  onChange={(e) => setManualClientName(e.target.value)}
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
                  value={manualClientPhone}
                  onChange={(e) => setManualClientPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm font-mono focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Espace
                </label>
                <select
                  value={manualSpaceId}
                  onChange={(e) => setManualSpaceId(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
                >
                  {spaces.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Service / Formule
                </label>
                <select
                  value={manualServiceId}
                  onChange={(e) => setManualServiceId(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="w-full px-2 py-2 bg-surface border border-surface-border rounded-xl text-white text-xs focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Début
                </label>
                <input
                  type="time"
                  required
                  value={manualStartTime}
                  onChange={(e) => setManualStartTime(e.target.value)}
                  className="w-full px-2 py-2 bg-surface border border-surface-border rounded-xl text-white text-xs focus:outline-none focus:border-gold font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Fin
                </label>
                <input
                  type="time"
                  required
                  value={manualEndTime}
                  onChange={(e) => setManualEndTime(e.target.value)}
                  className="w-full px-2 py-2 bg-surface border border-surface-border rounded-xl text-white text-xs focus:outline-none focus:border-gold font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Montant Total (FCFA)
                </label>
                <input
                  type="number"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Acompte / Montant Encaissé (FCFA)
                </label>
                <input
                  type="number"
                  value={manualPaidAmount}
                  onChange={(e) => setManualPaidAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                Notes & Besoins Particuliers
              </label>
              <textarea
                rows={2}
                value={manualNotes}
                onChange={(e) => setManualNotes(e.target.value)}
                className="w-full p-2.5 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-surface-border">
              <button
                type="button"
                onClick={() => setIsManualBookingOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-border text-zinc-300 text-xs"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs"
              >
                Bloquer le créneau & Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
