'use client';

import React, { useState } from 'react';

interface Track {
  code: string;
  title: string;
  subtitle: string;
  price: string;
  serviceId: string;
}

const SIDE_A: Track[] = [
  {
    code: 'A1',
    title: 'Pack Son',
    subtitle: "enregistrement + mix + master d'un titre",
    price: '35 000 F',
    serviceId: 'pack-son',
  },
  {
    code: 'A2',
    title: 'Beat exclusif',
    subtitle: 'une instru rien que pour toi',
    price: 'dès 25 000 F',
    serviceId: 'beat-exclusif',
  },
  {
    code: 'A3',
    title: 'Épisode podcast',
    subtitle: '1 h multi-caméras + montage prêt à publier',
    price: '40 000 F',
    serviceId: 'pack-podcast',
  },
  {
    code: 'A4',
    title: 'Abonnement créateur',
    subtitle: '4 épisodes par mois, prix réduit',
    price: '140 000 F / mois',
    serviceId: 'abo-createur',
  },
];

const SIDE_B: Track[] = [
  {
    code: 'B1',
    title: 'Pack Photo',
    subtitle: '1 h de shooting + 10 photos retouchées',
    price: '25 000 F',
    serviceId: 'pack-photo',
  },
  {
    code: 'B2',
    title: 'Clip vidéo',
    subtitle: "tournage + montage, de l'idée à la sortie",
    price: 'dès 150 000 F',
    serviceId: 'clip-video',
  },
  {
    code: 'B3',
    title: 'Mariage & baptême',
    subtitle: 'photo et vidéo de ton événement',
    price: 'dès 100 000 F',
    serviceId: 'evenement',
  },
  {
    code: 'B4',
    title: 'Formations',
    subtitle: 'MAO, prise de son, montage, photo',
    price: '25 000 F / pers',
    serviceId: 'formation',
  },
];

export function BrutalistFormulas({
  onSelectFormula,
}: {
  onSelectFormula?: (serviceId: string) => void;
}) {
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<string>('A1');

  const handleClick = (track: Track) => {
    setSelectedTrack(track.code);
    if (onSelectFormula) {
      onSelectFormula(track.serviceId);
    }
    const target = document.getElementById('reservation');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="formules"
      className="w-full bg-[#f1eadd] border-t-[1.5px] border-[#121110] py-16 px-[clamp(16px,3.2vw,40px)]"
    >
      {/* EN-TÊTE DE SECTION (MODÈLE COMMUN) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-12 items-baseline">
        <div className="md:col-span-3 font-mono text-[12px] font-bold text-[#d7261e] uppercase tracking-[0.06em]">
          (02) FORMULES
        </div>
        <div className="md:col-span-9">
          <h2 className="font-anton uppercase tracking-tight text-[#121110] leading-[0.9] text-[clamp(54px,9vw,150px)]">
            La tracklist <em className="font-serif italic text-[#d7261e] font-bold text-[0.62em]">des</em> offres.
          </h2>
        </div>
      </div>

      {/* CADRE DOS DE POCHETTE DE VINYLE (FOND PAPER2) */}
      <div className="bg-[#e8dfcf] border-[1.5px] border-[#121110] p-6 sm:p-10 md:p-12 shadow-md">
        {/* En-tête de la pochette vinyle */}
        <div className="border-b-[1.5px] border-[#121110] pb-5 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.06em] text-[#5d564c]">
          <span className="text-[#121110] font-bold">SEVEN TRUTH RECORDS · CATALOGUE OFFICIEL</span>
          <span>THIÈS, SÉNÉGAL · ÉDITION 2026</span>
          <span className="text-[#d7261e] font-bold">33⅓ RPM STEREO</span>
        </div>

        {/* GRILLE 2 COLONNES (FACE A / FACE B) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* FACE A — SON & PODCAST */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b-[1.5px] border-[#121110] pb-2">
              <span className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#121110]">
                FACE A
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-[#d7261e] font-bold">
                — SON &amp; PODCAST
              </span>
            </div>

            <div className="space-y-4">
              {SIDE_A.map((track) => {
                const isActive = hoveredTrack === track.code || selectedTrack === track.code;
                return (
                  <div
                    key={track.code}
                    onClick={() => handleClick(track)}
                    onMouseEnter={() => setHoveredTrack(track.code)}
                    onMouseLeave={() => setHoveredTrack(null)}
                    className={`cursor-pointer border-b border-dashed border-[#121110]/30 pb-3 flex items-baseline justify-between gap-4 group transition-all ${
                      isActive ? 'bg-[#121110]/5 pl-2' : ''
                    }`}
                  >
                    <div className="flex items-baseline gap-2.5 flex-1 min-w-0">
                      {/* Code piste + Flèche lecture */}
                      <span className="font-mono text-xs font-bold text-[#d7261e] flex-shrink-0 w-8">
                        {isActive ? '▶ ' : ''}{track.code}
                      </span>

                      {/* Titre & Sous-titre */}
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 truncate">
                        <span
                          className={`font-anton text-base sm:text-lg uppercase tracking-tight transition-colors ${
                            isActive ? 'text-[#d7261e]' : 'text-[#121110]'
                          }`}
                        >
                          {track.title}
                        </span>
                        <span className="text-xs text-[#5d564c] truncate">
                          ({track.subtitle})
                        </span>
                      </div>
                    </div>

                    {/* Prix à droite en mono */}
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#121110] flex-shrink-0">
                      {track.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FACE B — IMAGE & ÉVÉNEMENTS */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b-[1.5px] border-[#121110] pb-2">
              <span className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#121110]">
                FACE B
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-[#d7261e] font-bold">
                — IMAGE &amp; ÉVÉNEMENTS
              </span>
            </div>

            <div className="space-y-4">
              {SIDE_B.map((track) => {
                const isActive = hoveredTrack === track.code || selectedTrack === track.code;
                return (
                  <div
                    key={track.code}
                    onClick={() => handleClick(track)}
                    onMouseEnter={() => setHoveredTrack(track.code)}
                    onMouseLeave={() => setHoveredTrack(null)}
                    className={`cursor-pointer border-b border-dashed border-[#121110]/30 pb-3 flex items-baseline justify-between gap-4 group transition-all ${
                      isActive ? 'bg-[#121110]/5 pl-2' : ''
                    }`}
                  >
                    <div className="flex items-baseline gap-2.5 flex-1 min-w-0">
                      <span className="font-mono text-xs font-bold text-[#d7261e] flex-shrink-0 w-8">
                        {isActive ? '▶ ' : ''}{track.code}
                      </span>

                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 truncate">
                        <span
                          className={`font-anton text-base sm:text-lg uppercase tracking-tight transition-colors ${
                            isActive ? 'text-[#d7261e]' : 'text-[#121110]'
                          }`}
                        >
                          {track.title}
                        </span>
                        <span className="text-xs text-[#5d564c] truncate">
                          ({track.subtitle})
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-xs sm:text-sm font-bold text-[#121110] flex-shrink-0">
                      {track.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pied de la pochette vinyle */}
        <div className="mt-10 pt-4 border-t-[1.5px] border-[#121110] flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono text-[#5d564c] gap-2">
          <span>CLIQUEZ SUR UNE PISTE POUR PRÉREMPLIR VOTRE SESSION</span>
          <span className="text-[#121110] font-bold">ACOMPTE 50% WAVE &amp; ORANGE MONEY</span>
        </div>
      </div>
    </section>
  );
}
