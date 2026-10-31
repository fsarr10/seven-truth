'use client';

import React, { useState } from 'react';
import { useLabelStore } from '@/lib/store/useLabelStore';
import { AuditLogEntry } from '@/lib/types';
import { ShieldCheck, Lock, Search, Filter, Eye, ChevronDown, ChevronRight } from 'lucide-react';

export function AuditLogViewer() {
  const { auditLogs } = useLabelStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [tableFilter, setTableFilter] = useState('all');
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.record_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTable = tableFilter === 'all' || log.table_name === tableFilter;
    return matchesSearch && matchesTable;
  });

  const toggleExpand = (id: number) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-gold" />
            Journal d'Audit Immuable (Append-Only)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Traçabilité inviolable. Toute création, modification ou tentative d'altération est consignée en temps réel.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold flex items-center gap-2 self-start sm:self-auto">
          <Lock className="w-3.5 h-3.5" />
          <span>Strictement Lecture Seule</span>
        </div>
      </div>

      {/* Barre de recherche et filtre */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Rechercher par utilisateur, table (ex: bookings, equipment, transactions)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-surface-border rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold"
          />
        </div>
        <select
          value={tableFilter}
          onChange={(e) => setTableFilter(e.target.value)}
          className="px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
        >
          <option value="all">Toutes les tables</option>
          <option value="bookings">Réservations (bookings)</option>
          <option value="equipment">Matériel (equipment)</option>
          <option value="rentals">Locations (rentals)</option>
          <option value="transactions">Transactions financières</option>
          <option value="inventories">Inventaires</option>
          <option value="settings">Paramètres</option>
        </select>
      </div>

      {/* Liste des entrées de journal */}
      <div className="bg-surface-secondary border border-surface-border rounded-2xl overflow-hidden shadow-xl">
        <div className="divide-y divide-surface-border">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-sm">
              Aucune trace trouvée dans le journal d'audit.
            </div>
          ) : (
            filteredLogs.map(log => {
              const isExpanded = expandedLogId === log.id;
              return (
                <div key={log.id} className="p-4 hover:bg-surface/40 transition-colors">
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer"
                    onClick={() => toggleExpand(log.id)}
                  >
                    <div className="flex items-center gap-3">
                      <button className="text-zinc-500 hover:text-white">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        log.action === 'INSERT'
                          ? 'bg-green-950/80 text-green-300 border border-green-800'
                          : log.action === 'UPDATE'
                          ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                          : 'bg-red-950/80 text-red-300 border border-red-800'
                      }`}>
                        {log.action}
                      </span>
                      <span className="font-mono text-xs text-gold bg-surface px-2 py-0.5 rounded border border-surface-border">
                        {log.table_name}
                      </span>
                      <span className="font-mono text-xs text-zinc-400">
                        ID: {log.record_id}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <span className="text-white font-medium">
                        {log.user_name} ({log.user_role})
                      </span>
                      <span className="font-mono text-zinc-500">
                        {new Date(log.timestamp).toLocaleString('fr-FR', {
                          timeZone: 'Africa/Dakar',
                          dateStyle: 'short',
                          timeStyle: 'medium'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Vue détaillée de la charge utile (Old Data -> New Data) */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-surface-border grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                      {log.old_data && (
                        <div className="p-3 bg-surface rounded-xl border border-surface-border">
                          <span className="text-zinc-400 font-sans font-semibold block mb-1">
                            Ancienne Valeur :
                          </span>
                          <pre className="overflow-x-auto text-zinc-300 whitespace-pre-wrap max-h-40">
                            {JSON.stringify(log.old_data, null, 2)}
                          </pre>
                        </div>
                      )}
                      {log.new_data && (
                        <div className="p-3 bg-surface rounded-xl border border-surface-border">
                          <span className="text-zinc-400 font-sans font-semibold block mb-1">
                            Nouvelle Valeur :
                          </span>
                          <pre className="overflow-x-auto text-gold-light whitespace-pre-wrap max-h-40">
                            {JSON.stringify(log.new_data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
