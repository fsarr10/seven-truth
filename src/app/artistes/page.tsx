import React from 'react';
import { INITIAL_ARTISTS } from '@/lib/store/initialData';
import { Users, Music, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ArtistesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
          Les talents de la maison
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
          Artistes du Label
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Seven Truth accompagne, produit et propulse la nouvelle génération d'artistes et de beatmakers de Thiès et du Sénégal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {INITIAL_ARTISTS.map(artist => (
          <div key={artist.id} className="bg-surface-secondary border border-surface-border rounded-3xl p-6 text-center space-y-4 hover:border-gold/40 transition-all">
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto border-2 border-gold shadow-xl">
              <img
                src={artist.photo_url}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-white">{artist.name}</h2>
              <span className="text-xs text-gold font-semibold uppercase tracking-wider">{artist.genre}</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">{artist.bio}</p>
            <div className="pt-2">
              <Link
                href="/portfolio"
                className="text-xs text-gold hover:underline font-semibold"
              >
                Écouter les titres produits →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
