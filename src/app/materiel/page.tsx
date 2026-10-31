'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLabelStore } from '@/lib/store/useLabelStore';
import { formatFCFA } from '@/lib/utils/currency';
import { getWhatsAppRentalLink } from '@/lib/utils/whatsapp';
import {
  Camera, Search, Filter, ShieldCheck, CheckCircle2,
  Calendar, Share2, AlertCircle
} from 'lucide-react';

export default function MaterielPage() {
  const { equipment } = useLabelStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Tout le matériel' },
    { id: 'camera', label: 'Caméras & Boîtiers' },
    { id: 'optique', label: 'Objectifs & Zooms' },
    { id: 'audio', label: 'Micros & Son' },
    { id: 'lumiere', label: 'Éclairage & Dômes' },
    { id: 'stabilisateur', label: 'Stabilisateurs' },
    { id: 'drone', label: 'Drones' },
  ];

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
          Location Audiovisuelle Professionnelle
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
          Parc Matériel à Louer
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Matériel cinéma et broadcast fourni par notre partenaire investisseur, révisé chaque mois et disponible immédiatement à Thiès.
        </p>
      </div>

      {/* Conditions de location */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-surface-secondary border border-surface-border rounded-2xl text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-gold flex-shrink-0" />
          <span>Contrat avec CNI sénégalaise ou passeport requis</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />
          <span>Caution consignée restituée après vérification</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold flex-shrink-0" />
          <span>Tarif dégressif dès 3 jours consécutifs</span>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Rechercher une caméra, un micro, une lumière..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-surface-border rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-gold text-background'
                  : 'bg-surface border border-surface-border text-zinc-400 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grille du matériel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map(item => (
          <div
            key={item.id}
            className="bg-surface-secondary border border-surface-border rounded-2xl overflow-hidden hover:border-gold/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full bg-surface overflow-hidden">
                <img
                  src={item.photos[0]}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-background/85 backdrop-blur-md text-gold border border-gold/30">
                    {formatFCFA(item.daily_price)} / jour
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold backdrop-blur-md ${
                    item.available_quantity > 0
                      ? 'bg-green-950/90 text-green-300 border border-green-800'
                      : 'bg-red-950/90 text-red-300 border border-red-800'
                  }`}>
                    {item.available_quantity > 0 ? `${item.available_quantity} en stock` : 'Déjà loué'}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white text-base leading-tight">{item.name}</h3>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 bg-surface px-2 py-0.5 rounded border border-surface-border">
                    {item.category}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">{item.description}</p>

                <div className="p-3 bg-surface rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Caution obligatoire :</span>
                    <strong className="text-white">{formatFCFA(item.deposit_required)}</strong>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Valeur du matériel :</span>
                    <span>{formatFCFA(item.replacement_value)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>État certifié :</span>
                    <span className="capitalize text-green-400 font-semibold">{item.condition}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <a
                href={getWhatsAppRentalLink({
                  rental_number: 'DEMANDE-LOC',
                  client_name: 'Client',
                  equipment_name: item.name,
                  start_date: 'Demain',
                  end_date: 'À convenir',
                  days_count: 1,
                  total_price: item.daily_price,
                  deposit_amount: item.deposit_required
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-gold/10 transition-all active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>Réserver ce matériel sur WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
