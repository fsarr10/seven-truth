import React from 'react';
import Link from 'next/link';
import { INITIAL_SPACES } from '@/lib/store/initialData';
import { formatFCFA } from '@/lib/utils/currency';
import { Volume2, Clock, Users, ArrowRight, CheckCircle2, Shield } from 'lucide-react';

export default function EspacesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
          Infrastructures & Cabines
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
          Nos Espaces de Production
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Trois espaces indépendants et insonorisés, climatisés, avec connexion internet fibre haut débit au Quartier Dixième à Thiès.
        </p>
      </div>

      <div className="space-y-12">
        {INITIAL_SPACES.map((space, idx) => (
          <div
            key={space.id}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 bg-surface-secondary border border-surface-border rounded-3xl ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Photos */}
            <div className="lg:col-span-6 space-y-3">
              <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-surface">
                <img
                  src={space.photos[0]}
                  alt={space.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-xl text-sm font-bold bg-background/80 backdrop-blur-md text-gold border border-gold/30">
                    {formatFCFA(space.hourly_rate)} / heure
                  </span>
                </div>
              </div>
              {space.photos[1] && (
                <div className="h-40 w-full rounded-xl overflow-hidden bg-surface hidden sm:block">
                  <img
                    src={space.photos[1]}
                    alt={`${space.name} vue complémentaire`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Description & Fiche Technique */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider block mb-1">
                  Espace #{idx + 1}
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
                  {space.name}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {space.description}
              </p>

              {/* Règle sabar / acoustique */}
              {space.noisy_allowed ? (
                <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
                  <Volume2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-300">Horaires autorisés Sabar & Percussions :</strong>
                    En conformité avec le propriétaire et le voisinage à Thiès, les instruments acoustiques à forte intensité sonore sont autorisés exclusivement du lundi au samedi entre {space.noisy_start_hour}h00 et {space.noisy_end_hour}h00.
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-surface border border-surface-border rounded-xl text-xs text-zinc-400 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Espace insonorisé adapté aux voix, interviews, tournages et instruments électriques.</span>
                </div>
              )}

              {/* Spécifications */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <span className="text-zinc-500 block uppercase font-semibold">Capacité</span>
                  <span className="text-white font-medium flex items-center gap-1.5 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-gold" />
                    Jusqu'à {space.capacity} personnes
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase font-semibold">Climatisation</span>
                  <span className="text-white font-medium mt-0.5 block">Split Inverter silencieux</span>
                </div>
              </div>

              {/* Matériel inclus */}
              <div className="space-y-2 pt-2 border-t border-surface-border">
                <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                  Équipements inclus d'office :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-zinc-300">
                  {space.equipment_included.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href={`/reserver?space=${space.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs sm:text-sm shadow-lg shadow-gold/15 transition-all active:scale-95"
                >
                  <span>Réserver {space.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
