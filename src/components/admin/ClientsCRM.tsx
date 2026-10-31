'use client';

import React, { useState, useMemo } from 'react';
import { useLabelStore } from '@/lib/store/useLabelStore';
import { formatFCFA } from '@/lib/utils/currency';
import { Users, Download, Search, Tag, Phone, Calendar, ArrowUpDown } from 'lucide-react';

export function ClientsCRM() {
  const { bookings, rentals } = useLabelStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('all');

  // Agrégation des clients uniques à partir des réservations et locations
  const clientsList = useMemo(() => {
    const map = new Map<string, {
      name: string;
      phone: string;
      email?: string;
      tag: string;
      totalSpent: number;
      bookingsCount: number;
      rentalsCount: number;
      lastVisit: string;
    }>();

    // Réservations
    bookings.forEach(b => {
      const key = b.client_phone.trim();
      const existing = map.get(key) || {
        name: b.client_name,
        phone: b.client_phone,
        email: b.client_email,
        tag: b.client_name.toLowerCase().includes('brand') || b.client_name.toLowerCase().includes('agence') ? 'entreprise' : 'artiste',
        totalSpent: 0,
        bookingsCount: 0,
        rentalsCount: 0,
        lastVisit: b.start_time
      };

      existing.bookingsCount++;
      existing.totalSpent += b.paid_amount;
      if (new Date(b.start_time) > new Date(existing.lastVisit)) {
        existing.lastVisit = b.start_time;
      }
      map.set(key, existing);
    });

    // Locations
    rentals.forEach(r => {
      const key = r.client_phone.trim();
      const existing = map.get(key) || {
        name: r.client_name,
        phone: r.client_phone,
        tag: 'créateur',
        totalSpent: 0,
        bookingsCount: 0,
        rentalsCount: 0,
        lastVisit: r.start_date
      };

      existing.rentalsCount++;
      existing.totalSpent += r.total_price;
      map.set(key, existing);
    });

    return Array.from(map.values());
  }, [bookings, rentals]);

  // Export CSV conforme au prompt
  const exportToCSV = () => {
    const headers = ['Nom Client', 'Telephone', 'Email', 'Tag', 'Total Depense (FCFA)', 'Nb Reservations', 'Nb Locations', 'Derniere Visite'];
    const rows = clientsList.map(c => [
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.email || ''}"`,
      `"${c.tag}"`,
      c.totalSpent,
      c.bookingsCount,
      c.rentalsCount,
      `"${c.lastVisit.split('T')[0]}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `seven-truth-clients-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredClients = clientsList.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm);
    const matchesTag = tagFilter === 'all' || c.tag === tagFilter;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-gold" />
            Répertoire Clients & CRM
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Fidélisation des artistes, créateurs de podcasts et entreprises de Thiès.
          </p>
        </div>

        <button
          type="button"
          onClick={exportToCSV}
          className="px-4 py-2 rounded-xl bg-surface border border-surface-border hover:border-gold text-zinc-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-gold" />
          <span>Exporter CSV</span>
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Rechercher par nom ou numéro de téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-surface-border rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold"
          />
        </div>
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
        >
          <option value="all">Tous les profils</option>
          <option value="artiste">Artistes</option>
          <option value="créateur">Créateurs & Podcasteurs</option>
          <option value="entreprise">Entreprises & Marques</option>
          <option value="famille">Particuliers & Cérémonies</option>
        </select>
      </div>

      {/* Tableau des clients */}
      <div className="bg-surface-secondary border border-surface-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-surface border-b border-surface-border text-zinc-400 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Téléphone</th>
                <th className="py-3 px-4">Tag</th>
                <th className="py-3 px-4">Séances</th>
                <th className="py-3 px-4">Locations</th>
                <th className="py-3 px-4">Dernière Venue</th>
                <th className="py-3 px-4 text-right">Total Dépensé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-zinc-300">
              {filteredClients.map((c, i) => (
                <tr key={i} className="hover:bg-surface/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{c.name}</td>
                  <td className="py-3 px-4 font-mono text-zinc-400">{c.phone}</td>
                  <td className="py-3 px-4">
                    <span className="capitalize px-2 py-0.5 rounded text-[11px] font-semibold bg-surface border border-surface-border text-gold">
                      {c.tag}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{c.bookingsCount}</td>
                  <td className="py-3 px-4 font-mono">{c.rentalsCount}</td>
                  <td className="py-3 px-4 text-zinc-400 font-mono">
                    {c.lastVisit.split('T')[0]}
                  </td>
                  <td className="py-3 px-4 text-right font-display font-bold text-gold">
                    {formatFCFA(c.totalSpent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
