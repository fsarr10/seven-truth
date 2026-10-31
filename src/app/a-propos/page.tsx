import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Sparkles, MapPin, Target } from 'lucide-react';

export default function AProposPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
          Notre Histoire & Nos Engagements
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
          L'Esprit Seven Truth
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Un label indépendant ancré à Thiès, bâti sur la transparence, l'excellence technique et le respect des créateurs.
        </p>
      </div>

      <div className="bg-surface-secondary border border-surface-border rounded-3xl p-6 sm:p-10 space-y-6 text-zinc-300 text-xs sm:text-sm leading-relaxed">
        <h2 className="font-display font-bold text-xl text-white">
          La vérité au cœur de la création
        </h2>
        <p>
          Né à Thiès, ville ferroviaire et carrefour historique de bouillonnement culturel au Sénégal, <strong>Seven Truth</strong> est bien plus qu'un simple studio d'enregistrement. C'est une plateforme intégrée dédiée à l'expression musicale, aux nouveaux médias numériques (podcasts, talk-shows, web TV) et à l'image des artistes.
        </p>
        <p>
          Installé dans un appartement aménagé au Quartier Dixième, le label dispose d'un studio insonorisé selon le principe de la « pièce dans la pièce », garantissant une isolation acoustique optimale tout en respectant scrupuleusement la tranquillité du voisinage (sessions de batterie et de sabar limitées à la plage 10h–19h).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-4 bg-surface rounded-2xl border border-surface-border space-y-2">
            <ShieldCheck className="w-6 h-6 text-gold" />
            <h3 className="font-bold text-white text-sm">Transparence Totale</h3>
            <p className="text-xs text-zinc-400">
              Chaque franc encaissé et chaque dépense sont tracés avec photo du reçu. Le patron investisseur et l'équipe partagent la même vérité comptable.
            </p>
          </div>
          <div className="p-4 bg-surface rounded-2xl border border-surface-border space-y-2">
            <Sparkles className="w-6 h-6 text-gold" />
            <h3 className="font-bold text-white text-sm">Qualité Cinéma</h3>
            <p className="text-xs text-zinc-400">
              Caméras Sony FX3, optiques G-Master, micros Shure SM7B et monitoring pro Yamaha pour un rendu digne des standards internationaux.
            </p>
          </div>
          <div className="p-4 bg-surface rounded-2xl border border-surface-border space-y-2">
            <Target className="w-6 h-6 text-gold" />
            <h3 className="font-bold text-white text-sm">Ancrage Thiessois</h3>
            <p className="text-xs text-zinc-400">
              Offrir aux talents locaux de Thiès les mêmes moyens de production qu'à Dakar, sans avoir à subir les embouteillages de la capitale.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
