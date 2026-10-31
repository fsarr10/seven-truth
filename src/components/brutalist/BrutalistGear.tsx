'use client';

import React from 'react';

interface GearCategory {
  ref: string;
  title: string;
  desc: string;
  price: string;
  icon: React.ReactNode;
}

const GEAR_ITEMS: GearCategory[] = [
  {
    ref: 'CAM',
    title: 'CAMÉRAS',
    desc: 'Pour ton clip, ton podcast ou ton événement.',
    price: 'dès 15 000 F/j',
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M23 7l-7 5 7 5V7z" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    ref: 'MIC',
    title: 'MICROS',
    desc: 'Studio, cravate ou sans fil.',
    price: 'dès 3 000 F/j',
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
  },
  {
    ref: 'LUM',
    title: 'LUMIÈRES',
    desc: 'Panneaux LED, softbox, RGB.',
    price: 'dès 5 000 F/j',
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
  },
  {
    ref: 'SON',
    title: 'SONO',
    desc: 'Enceintes, table de mixage, casques.',
    price: 'dès 5 000 F/j',
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    ),
  },
];

export function BrutalistGear({
  onSelectGear,
}: {
  onSelectGear?: (serviceId: string) => void;
}) {
  const handleClick = () => {
    if (onSelectGear) {
      onSelectGear('location');
    }
    const target = document.getElementById('reservation');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="materiel"
      className="w-full bg-[#f1eadd] border-t-[1.5px] border-[#121110] py-16 px-[clamp(16px,3.2vw,40px)]"
    >
      {/* EN-TÊTE DE SECTION (MODÈLE COMMUN) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-12 items-baseline">
        <div className="md:col-span-3 font-mono text-[12px] font-bold text-[#d7261e] uppercase tracking-[0.06em]">
          (04) LOCATION
        </div>
        <div className="md:col-span-9">
          <h2 className="font-anton uppercase tracking-tight text-[#121110] leading-[0.9] text-[clamp(54px,9vw,150px)]">
            Du matos pro, <em className="font-serif italic text-[#d7261e] font-bold text-[0.62em]">à la</em> journée.
          </h2>
        </div>
      </div>

      {/* GRILLE FAÇON FICHE TECHNIQUE */}
      <div className="grid grid-cols-1 min-[520px]:grid-cols-2 min-[980px]:grid-cols-4 border-t-[1.5px] border-l-[1.5px] border-[#121110]">
        {GEAR_ITEMS.map((item) => (
          <div
            key={item.ref}
            onClick={handleClick}
            className="group cursor-pointer border-r-[1.5px] border-b-[1.5px] border-[#121110] p-6 sm:p-7 flex flex-col justify-between min-h-[260px] bg-[#f1eadd] hover:bg-[#e8dfcf] transition-all duration-300"
          >
            {/* Haut : Réf + Icône qui tourne au survol */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs font-bold text-[#d7261e] tracking-[0.06em]">
                  [{item.ref}]
                </span>
                <div className="text-[#121110] group-hover:text-[#d7261e] group-hover:scale-110 group-hover:-rotate-8 transition-transform duration-300">
                  {item.icon}
                </div>
              </div>

              <div>
                <h3 className="font-anton text-2xl uppercase tracking-tight text-[#121110] group-hover:text-[#d7261e] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#5d564c] mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>

            {/* Bas : Prix */}
            <div className="pt-6 border-t border-[#121110]/15 flex items-baseline justify-between">
              <span className="font-mono text-xs text-[#5d564c] uppercase">Tarif</span>
              <span className="font-anton text-lg text-[#121110]">
                {item.price}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* SOUS LA GRILLE : CONDITION + BOUTON DEMANDER UNE LOCATION */}
      <div className="mt-8 pt-6 border-t-[1.5px] border-[#121110] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-xs sm:text-sm text-[#5d564c] max-w-xl">
          Caution et pièce d'identité demandées. Le matériel est vérifié avec toi au départ et au retour.
        </p>
        <button
          onClick={handleClick}
          className="h-11 px-6 bg-[#121110] text-[#f1eadd] font-mono text-[12px] font-bold uppercase tracking-[0.06em] flex items-center justify-center hover:bg-[#d7261e] transition-colors border-[1.5px] border-[#121110]"
        >
          Demander une location →
        </button>
      </div>
    </section>
  );
}
