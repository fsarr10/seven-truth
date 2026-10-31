'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Room {
  id: string;
  num: string;
  name: string;
  desc: string;
  price: string;
  unit: string;
  previewType: 'studio' | 'plateau' | 'shooting';
}

const ROOMS: Room[] = [
  {
    id: 'studio',
    num: '01',
    name: 'STUDIO SON',
    desc: "Cabine insonorisée, enregistrement, beatmaking, mix & master. L'ingénieur son est inclus.",
    price: '10 000 FCFA',
    unit: '/ heure',
    previewType: 'studio',
  },
  {
    id: 'plateau',
    num: '02',
    name: 'PLATEAU',
    desc: 'Podcast, émission, interview, live : plusieurs caméras, micros et lumières. Montage sur place.',
    price: '15 000 FCFA',
    unit: '/ heure',
    previewType: 'plateau',
  },
  {
    id: 'shooting',
    num: '03',
    name: 'SHOOTING',
    desc: 'Portraits, pochettes, photos de produits. Fonds, éclairage studio et retouche.',
    price: '25 000 FCFA',
    unit: '/ pack',
    previewType: 'shooting',
  },
];

export function BrutalistRooms({
  onSelectService,
}: {
  onSelectService?: (serviceId: string) => void;
}) {
  const [activePreview, setActivePreview] = useState<'studio' | 'plateau' | 'shooting' | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Carte flottante qui suit la souris avec interpolation douce (léger retard)
  useEffect(() => {
    let animId: number;
    const updatePosition = () => {
      setCursorPos((prev) => ({
        x: prev.x + (targetPos.x - prev.x) * 0.15,
        y: prev.y + (targetPos.y - prev.y) * 0.15,
      }));
      animId = requestAnimationFrame(updatePosition);
    };
    animId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animId);
  }, [targetPos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setTargetPos({ x: e.clientX, y: e.clientY });
  };

  const handleRoomClick = (room: Room) => {
    if (onSelectService) {
      onSelectService(room.id);
    }
    const target = document.getElementById('reservation');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="salles"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-[#f1eadd] border-t-[1.5px] border-[#121110] py-16 px-[clamp(16px,3.2vw,40px)]"
    >
      {/* EN-TÊTE DE SECTION (MODÈLE COMMUN) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-12 items-baseline">
        <div className="md:col-span-3 font-mono text-[12px] font-bold text-[#d7261e] uppercase tracking-[0.06em]">
          (01) LES SALLES
        </div>
        <div className="md:col-span-9">
          <h2 className="font-anton uppercase tracking-tight text-[#121110] leading-[0.9] text-[clamp(54px,9vw,150px)]">
            Trois salles, <em className="font-serif italic text-[#d7261e] font-bold text-[0.62em]">une seule</em> exigence.
          </h2>
        </div>
      </div>

      {/* LISTE ÉDITORIALE DES 3 SALLES */}
      <div className="border-t-[1.5px] border-[#121110]">
        {ROOMS.map((room) => (
          <div
            key={room.id}
            onClick={() => handleRoomClick(room)}
            onMouseEnter={() => setActivePreview(room.previewType)}
            onMouseLeave={() => setActivePreview(null)}
            className="group relative cursor-pointer border-b-[1.5px] border-[#121110] overflow-hidden transition-all duration-300"
          >
            {/* Fond noir qui monte du bas au survol (scaleY) */}
            <div
              className="absolute inset-0 bg-[#121110] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 pointer-events-none"
              style={{ transitionTimingFunction: 'cubic-bezier(.2,.8,.2,1)' }}
            />

            {/* Contenu de la ligne (se décale de 20px au survol sur desktop) */}
            <div className="relative z-10 py-8 sm:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-transform duration-300 md:group-hover:translate-x-5">
              <div className="flex items-start md:items-baseline gap-4 sm:gap-8 flex-1">
                {/* Numéro mono rouge */}
                <span className="font-mono text-sm sm:text-base font-bold text-[#d7261e] pt-1 md:pt-0">
                  ({room.num})
                </span>

                {/* Nom Anton géant & descriptif */}
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-anton text-3xl sm:text-5xl md:text-6xl text-[#121110] group-hover:text-[#f1eadd] uppercase tracking-tight leading-none transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5d564c] group-hover:text-[#f1eadd]/80 max-w-xl transition-colors">
                    {room.desc}
                  </p>
                </div>
              </div>

              {/* Prix à droite */}
              <div className="text-left md:text-right pl-10 md:pl-0 flex-shrink-0">
                <span className="font-anton text-2xl sm:text-4xl text-[#121110] group-hover:text-[#f1eadd] block transition-colors leading-none">
                  {room.price}
                </span>
                <span className="font-mono text-[11px] text-[#5d564c] group-hover:text-[#d7261e] uppercase tracking-[0.06em] block mt-1 transition-colors">
                  {room.unit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CARTE APERÇU 300x220 INCLINÉE DE -4° QUI SUIT LE CURSEUR (DESKTOP) */}
      <div
        className={`hidden md:block pointer-events-none fixed z-50 w-[300px] h-[220px] border-[1.5px] border-[#121110] shadow-2xl transition-opacity duration-200 ${
          activePreview ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: `${cursorPos.x + 24}px`,
          top: `${cursorPos.y - 110}px`,
          transform: 'rotate(-4deg)',
        }}
      >
        {/* Studio = fond noir avec onde sonore rouge animée et « REC ● STUDIO SON » */}
        {activePreview === 'studio' && (
          <div className="w-full h-full bg-[#121110] text-[#f1eadd] p-4 flex flex-col justify-between">
            <div className="font-mono text-[11px] text-[#d7261e] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d7261e] animate-ping" />
              REC ● STUDIO SON
            </div>
            {/* Onde sonore animée */}
            <div className="flex items-center justify-center gap-1.5 h-20">
              {[40, 75, 100, 60, 90, 45, 80, 95, 60, 85].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-[#d7261e] rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.8s',
                  }}
                />
              ))}
            </div>
            <div className="font-mono text-[10px] text-zinc-400 uppercase">
              ISOLATION DOUBLE PAROI · CABINE VOIX
            </div>
          </div>
        )}

        {/* Plateau = fond rouge avec micro noir et « ON AIR ● PLATEAU » */}
        {activePreview === 'plateau' && (
          <div className="w-full h-full bg-[#d7261e] text-[#121110] p-4 flex flex-col justify-between">
            <div className="font-mono text-[11px] text-[#121110] font-black uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#121110] animate-pulse" />
              ON AIR ● PLATEAU
            </div>
            {/* Micro noir stylisé */}
            <div className="flex items-center justify-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#121110" strokeWidth="2">
                <rect x="8" y="2" width="8" height="12" rx="4" fill="#121110" />
                <path d="M5 10a7 7 0 0 0 14 0" strokeWidth="2.5" />
                <line x1="12" y1="17" x2="12" y2="22" strokeWidth="2.5" />
                <line x1="8" y1="22" x2="16" y2="22" strokeWidth="2.5" />
              </svg>
            </div>
            <div className="font-mono text-[10px] font-bold text-[#121110] uppercase">
              RÉGIE 4K · 3 ANGLES CAMÉRA
            </div>
          </div>
        )}

        {/* Shooting = fond crème avec diaphragme noir et « F/2.8 ● SHOOTING » */}
        {activePreview === 'shooting' && (
          <div className="w-full h-full bg-[#f1eadd] text-[#121110] p-4 flex flex-col justify-between">
            <div className="font-mono text-[11px] text-[#d7261e] font-bold uppercase tracking-wider flex items-center gap-1.5">
              F/2.8 ● SHOOTING
            </div>
            {/* Diaphragme noir d'objectif photo */}
            <div className="flex items-center justify-center">
              <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="#121110" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10" />
                <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94" />
              </svg>
            </div>
            <div className="font-mono text-[10px] text-[#5d564c] uppercase font-bold">
              PORTRAITS · CYCLORAMA · PRODUITS
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
