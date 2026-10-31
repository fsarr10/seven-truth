'use client';

import React, { useState } from 'react';
import { useLabelStore } from '@/lib/store/useLabelStore';
import { formatFCFA } from '@/lib/utils/currency';
import Link from 'next/link';
import { User, Phone, Search, Calendar, Camera, FileText, ArrowRight, Printer } from 'lucide-react';

export default function EspaceClientPage() {
  const { bookings, rentals } = useLabelStore();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const cleanPhone = phoneNumber.replace(/\s+/g, '');

  const clientBookings = bookings.filter(b => {
    if (!cleanPhone) return false;
    return b.client_phone.replace(/\s+/g, '').includes(cleanPhone);
  });

  const clientRentals = rentals.filter(r => {
    if (!cleanPhone) return false;
    return r.client_phone.replace(/\s+/g, '').includes(cleanPhone);
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
          Espace Personnel
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
          Mes Réservations & Reçus
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Entrez votre numéro de téléphone pour retrouver instantanément l'historique de vos séances studio, locations et reçus de paiement.
        </p>
      </div>

      {/* Formulaire de recherche par téléphone */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
        <div className="relative flex-1">
          <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
          <input
            type="tel"
            required
            placeholder="Ex: 77 444 55 66 ou +221..."
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface border border-surface-border rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold font-mono"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-3 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-gold/10"
        >
          <Search className="w-4 h-4" />
          <span>Rechercher</span>
        </button>
      </form>

      {/* Raccourcis démo pour test rapide */}
      <div className="text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
        <span>Numéros de test démo :</span>
        <button
          type="button"
          onClick={() => {
            setPhoneNumber('77 444 55 66');
            setHasSearched(true);
          }}
          className="text-gold hover:underline font-mono"
        >
          77 444 55 66 (Ousmane Sow)
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => {
            setPhoneNumber('70 888 99 00');
            setHasSearched(true);
          }}
          className="text-gold hover:underline font-mono"
        >
          70 888 99 00 (Mariama Diallo)
        </button>
      </div>

      {/* Résultats de recherche */}
      {hasSearched && (
        <div className="space-y-8 pt-4">
          {/* Réservations */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" />
              Séances au Studio ({clientBookings.length})
            </h3>

            {clientBookings.length === 0 ? (
              <div className="p-6 bg-surface-secondary border border-surface-border rounded-2xl text-center text-zinc-500 text-xs">
                Aucune réservation trouvée pour ce numéro.
              </div>
            ) : (
              <div className="space-y-3">
                {clientBookings.map(b => (
                  <div key={b.id} className="p-5 bg-surface-secondary border border-surface-border rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-xs text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/30">
                          {b.booking_number}
                        </span>
                        <h4 className="font-bold text-white text-base mt-1">{b.service_id}</h4>
                        <span className="text-xs text-zinc-400">Espace : {b.space_id}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        b.status === 'confirmee' || b.status === 'payee'
                          ? 'bg-green-950/80 text-green-300 border border-green-800'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-surface-border">
                      <div>
                        <span className="text-zinc-500 block">Date</span>
                        <strong className="text-white">{new Date(b.start_time).toLocaleDateString('fr-FR')}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Horaire</span>
                        <strong className="text-white font-mono">
                          {new Date(b.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Total</span>
                        <strong className="text-white">{formatFCFA(b.total_amount)}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Acompte réglé</span>
                        <strong className="text-green-400 font-display">{formatFCFA(b.paid_amount)}</strong>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-zinc-300 hover:text-white text-xs flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5 text-gold" />
                        <span>Imprimer le reçu</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Locations */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Camera className="w-5 h-5 text-gold" />
              Locations de Matériel ({clientRentals.length})
            </h3>

            {clientRentals.length === 0 ? (
              <div className="p-6 bg-surface-secondary border border-surface-border rounded-2xl text-center text-zinc-500 text-xs">
                Aucune location de matériel trouvée.
              </div>
            ) : (
              <div className="space-y-3">
                {clientRentals.map(r => (
                  <div key={r.id} className="p-5 bg-surface-secondary border border-surface-border rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-xs text-gold">{r.rental_number}</span>
                        <h4 className="font-bold text-white text-base mt-1">{r.equipment_name}</h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800">
                        {r.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-surface-border">
                      <div>
                        <span className="text-zinc-500 block">Période</span>
                        <strong className="text-white">Du {r.start_date} au {r.end_date}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Prix location</span>
                        <strong className="text-white">{formatFCFA(r.total_price)}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Caution déposée</span>
                        <strong className="text-gold">{formatFCFA(r.deposit_amount)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
