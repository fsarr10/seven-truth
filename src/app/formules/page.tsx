import React from 'react';
import Link from 'next/link';
import { INITIAL_SERVICES } from '@/lib/store/initialData';
import { formatFCFA } from '@/lib/utils/currency';
import { CheckCircle2, ArrowRight, Clock, Sparkles } from 'lucide-react';

export default function FormulesPage() {
  const categories = [
    { id: 'all', label: 'Toutes les formules' },
    { id: 'studio', label: 'Studio Son' },
    { id: 'podcast', label: 'Plateau Podcast' },
    { id: 'photo', label: 'Shooting Photo' },
    { id: 'video', label: 'Vidéo & Clips' },
    { id: 'pack', label: 'Packs Clé en Main' },
    { id: 'evenement', label: 'Événements & Cérémonies' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
          Tarifs Officiels 2026
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
          Formules Clé en Main & Tarifs
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Des forfaits transparents, sans frais cachés, avec ingénieur son ou technicien vidéo qualifié.
        </p>
      </div>

      {/* Grille de cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_SERVICES.map((srv) => (
          <div
            key={srv.id}
            className={`p-6 rounded-2xl bg-surface-secondary border transition-all flex flex-col justify-between ${
              srv.featured
                ? 'border-gold shadow-xl shadow-gold/5 ring-1 ring-gold/40'
                : 'border-surface-border hover:border-zinc-700'
            }`}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase text-zinc-400 bg-surface px-2.5 py-1 rounded-lg border border-surface-border">
                  {srv.category}
                </span>
                {srv.featured && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-gold text-background px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Populaire
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-display font-bold text-lg text-white">{srv.name}</h3>
                <span className="font-display font-black text-2xl text-gold block mt-1">
                  {formatFCFA(srv.price)}
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">{srv.description}</p>

              <div className="pt-3 border-t border-surface-border space-y-1 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  <span>Durée estimée : {srv.duration_hours} heure(s)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                  <span>Acompte : {srv.deposit_percentage}% par Wave ou Orange Money</span>
                </div>
                {srv.is_noisy && (
                  <div className="text-amber-400 text-[11px] font-semibold">
                    Créneaux limités de 10h à 19h (Réglementation sonore Sabar)
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6">
              <Link
                href={`/reserver?service=${srv.id}`}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  srv.featured
                    ? 'bg-gold hover:bg-gold-light text-background shadow-lg shadow-gold/15'
                    : 'bg-surface hover:bg-surface-border text-zinc-200'
                }`}
              >
                <span>Choisir cette formule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
