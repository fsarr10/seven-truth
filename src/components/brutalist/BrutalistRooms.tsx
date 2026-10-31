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
  const [selectedMobileRoom, setSelectedMobileRoom] = useState<string>('studio');
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const [timecode, setTimecode] = useState('00:14:32:08');
  const [flashTrigger, setFlashTrigger] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Carte flottante qui suit la souris sur desktop avec interpolation douce
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

  // Horloge de timecode live pour le plateau et flash photo pour le shooting
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const s = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
      setTimecode(`00:23:${s}:${ms}`);
    }, 100);

    const flashInterval = setInterval(() => {
      setFlashTrigger(true);
      setTimeout(() => setFlashTrigger(false), 180);
    }, 3200);

    return () => {
      clearInterval(interval);
      clearInterval(flashInterval);
    };
  }, []);

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

      {/* =========================================================================
          MODULE D'ANIMATION EN DIRECT POUR MOBILE (< 768px)
          Affiche une carte animée permanente 300x220 avec bascule immédiate
         ========================================================================= */}
      <div className="md:hidden mb-10 space-y-3">
        {/* En-tête du module mobile avec boutons d'onglets rapides */}
        <div className="flex items-center justify-between pb-2 border-b-[1.5px] border-[#121110]">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#d7261e] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d7261e] animate-ping" />
            APERÇU DIRECT SALLE
          </span>
          <div className="flex items-center gap-1">
            {ROOMS.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedMobileRoom(r.id)}
                className={`px-2.5 py-1 font-mono text-[11px] font-bold uppercase border-[1.5px] border-[#121110] transition-all ${
                  selectedMobileRoom === r.id
                    ? 'bg-[#121110] text-[#f1eadd] shadow-[2px_2px_0_#d7261e]'
                    : 'bg-[#f1eadd] text-[#121110]'
                }`}
              >
                {r.num} {r.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* CARTE ANIMÉE 300x220 FORMAT MOBILE */}
        <div className="relative w-full h-[230px] border-[1.5px] border-[#121110] shadow-[6px_6px_0_#121110] overflow-hidden -rotate-1 transition-all duration-300">
          {/* APERÇU 01 : STUDIO SON */}
          {selectedMobileRoom === 'studio' && (
            <div className="w-full h-full bg-[#121110] text-[#f1eadd] p-4 flex flex-col justify-between select-none">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[11.5px] text-[#d7261e] font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d7261e] animate-ping" />
                  REC ● STUDIO SON EN ACTION
                </div>
                <span className="font-mono text-[10px] text-zinc-400 font-bold">44.1 kHz / 24-bit</span>
              </div>

              {/* Spectre audio interactif 14 barres */}
              <div className="flex items-center justify-center gap-1.5 h-24 my-1">
                {[30, 65, 95, 50, 85, 100, 40, 90, 75, 45, 88, 60, 92, 35].map((h, i) => (
                  <div
                    key={i}
                    className="w-2.5 bg-[#d7261e] rounded-sm animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDelay: `${(i % 5) * 0.12}s`,
                      animationDuration: '0.7s',
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] uppercase text-zinc-300 pt-2 border-t border-white/10">
                <span>ISOLATION DOUBLE PAROI</span>
                <span className="text-[#d7261e] font-bold">U87 · APOLLO X8</span>
              </div>
            </div>
          )}

          {/* APERÇU 02 : PLATEAU TV & PODCAST */}
          {selectedMobileRoom === 'plateau' && (
            <div className="w-full h-full bg-[#d7261e] text-[#121110] p-4 flex flex-col justify-between select-none">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[11.5px] text-[#121110] font-black uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#121110] animate-pulse" />
                  ON AIR ● PLATEAU MULTI-CAM
                </div>
                <span className="font-mono text-[10px] bg-[#121110] text-[#f1eadd] px-2 py-0.5 font-bold">
                  {timecode}
                </span>
              </div>

              {/* Réticule viseur caméra broadcast 4K */}
              <div className="relative flex-1 flex items-center justify-center py-2">
                <div className="absolute inset-x-6 inset-y-2 border border-[#121110]/40 flex items-center justify-center pointer-events-none">
                  <div className="w-3 h-3 border-t-2 border-l-2 border-[#121110] absolute top-0 left-0" />
                  <div className="w-3 h-3 border-t-2 border-r-2 border-[#121110] absolute top-0 right-0" />
                  <div className="w-3 h-3 border-b-2 border-l-2 border-[#121110] absolute bottom-0 left-0" />
                  <div className="w-3 h-3 border-b-2 border-r-2 border-[#121110] absolute bottom-0 right-0" />
                </div>

                <div className="flex flex-col items-center gap-1 animate-bounce" style={{ animationDuration: '2s' }}>
                  <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#121110" strokeWidth="2.4">
                    <rect x="8" y="2" width="8" height="12" rx="4" fill="#121110" />
                    <path d="M5 10a7 7 0 0 0 14 0" strokeWidth="2.5" />
                    <line x1="12" y1="17" x2="12" y2="22" strokeWidth="2.5" />
                    <line x1="8" y1="22" x2="16" y2="22" strokeWidth="2.5" />
                  </svg>
                  <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#121110]">
                    CAM 1 · 4K SONY
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] font-black uppercase text-[#121110] pt-2 border-t border-[#121110]/20">
                <span>3 ANGLES EN SIMULTANÉ</span>
                <span>MONTAGE RÉGIE SUR PLACE</span>
              </div>
            </div>
          )}

          {/* APERÇU 03 : SHOOTING PHOTO */}
          {selectedMobileRoom === 'shooting' && (
            <div className="relative w-full h-full bg-[#f1eadd] text-[#121110] p-4 flex flex-col justify-between select-none overflow-hidden">
              {/* Flash stroboscopique simulant le déclencheur de flash */}
              {flashTrigger && (
                <div className="absolute inset-0 bg-white z-20 pointer-events-none transition-opacity duration-150 opacity-90" />
              )}

              <div className="flex items-center justify-between">
                <div className="font-mono text-[11.5px] text-[#d7261e] font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d7261e] animate-ping" />
                  F/2.8 ● STUDIO SHOOTING & CYCLORAMA
                </div>
                <span className="font-mono text-[10px] font-bold text-[#5d564c]">1/250s · ISO 100</span>
              </div>

              {/* Diaphragme photo 12 lames qui tourne */}
              <div className="flex items-center justify-center my-2">
                <svg
                  width="68"
                  height="68"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#121110"
                  strokeWidth="1.8"
                  className="animate-spin"
                  style={{ animationDuration: '10s', animationTimingFunction: 'linear' }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94" />
                </svg>
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase text-[#5d564c] pt-2 border-t border-[#121110]/20">
                <span>FLASH GODOT 600W</span>
                <span>FONDS MULTIPLES & RETOUCHE HD</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LISTE ÉDITORIALE DES 3 SALLES */}
      <div className="border-t-[1.5px] border-[#121110]">
        {ROOMS.map((room) => {
          const isSelected = selectedMobileRoom === room.id;
          return (
            <div
              key={room.id}
              onClick={() => {
                setSelectedMobileRoom(room.id);
                if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                  handleRoomClick(room);
                }
              }}
              onMouseEnter={() => {
                setActivePreview(room.previewType);
                setSelectedMobileRoom(room.id);
              }}
              onMouseLeave={() => setActivePreview(null)}
              className={`group relative cursor-pointer border-b-[1.5px] border-[#121110] overflow-hidden transition-all duration-300 ${
                isSelected ? 'max-[767px]:bg-[#121110] max-[767px]:text-[#f1eadd]' : 'bg-[#f1eadd]'
              }`}
            >
              {/* Fond noir qui monte du bas au survol (scaleY) sur desktop */}
              <div
                className="absolute inset-0 bg-[#121110] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 pointer-events-none hidden md:block"
                style={{ transitionTimingFunction: 'cubic-bezier(.2,.8,.2,1)' }}
              />

              {/* Ligne principale cliquable avec décalage de 20px au survol ou à la sélection */}
              <div
                className={`relative z-10 py-7 sm:py-9 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-transform duration-300 md:group-hover:translate-x-5 ${
                  isSelected ? 'max-[767px]:translate-x-3' : ''
                }`}
              >
                <div className="flex items-start md:items-baseline gap-4 sm:gap-8 flex-1">
                  {/* Numéro mono rouge */}
                  <span className="font-mono text-sm sm:text-base font-bold text-[#d7261e] pt-1 md:pt-0">
                    ({room.num})
                  </span>

                  {/* Nom Anton géant & descriptif */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-3">
                      <h3
                        className={`font-anton text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight leading-none transition-colors ${
                          isSelected ? 'text-[#f1eadd]' : 'text-[#121110] group-hover:text-[#f1eadd]'
                        }`}
                      >
                        {room.name}
                      </h3>
                      {/* Voyant actif sur mobile */}
                      {isSelected && (
                        <span className="md:hidden font-mono text-[10px] uppercase px-2 py-0.5 bg-[#d7261e] text-[#f1eadd] font-bold">
                          ACTIF ●
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs sm:text-sm max-w-xl transition-colors ${
                        isSelected ? 'text-[#f1eadd]/80' : 'text-[#5d564c] group-hover:text-[#f1eadd]/80'
                      }`}
                    >
                      {room.desc}
                    </p>
                  </div>
                </div>

                {/* Prix à droite */}
                <div className="text-left md:text-right pl-10 md:pl-0 flex-shrink-0">
                  <span
                    className={`font-anton text-2xl sm:text-4xl block transition-colors leading-none ${
                      isSelected ? 'text-[#f1eadd]' : 'text-[#121110] group-hover:text-[#f1eadd]'
                    }`}
                  >
                    {room.price}
                  </span>
                  <span
                    className={`font-mono text-[11px] uppercase tracking-[0.06em] block mt-1 transition-colors ${
                      isSelected ? 'text-[#d7261e]' : 'text-[#5d564c] group-hover:text-[#d7261e]'
                    }`}
                  >
                    {room.unit}
                  </span>
                </div>
              </div>

              {/* Bouton de réservation mobile déployé pour la salle active */}
              {isSelected && (
                <div className="md:hidden relative z-10 px-4 pb-5 pt-1 border-t border-white/10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoomClick(room);
                    }}
                    className="w-full h-11 bg-[#d7261e] text-[#f1eadd] font-mono text-xs font-bold uppercase tracking-[0.06em] flex items-center justify-center border border-[#121110] hover:bg-[#b01c15] transition-colors shadow-[3px_3px_0_#f1eadd]"
                  >
                    Réserver {room.name} ({room.price}) →
                  </button>
                </div>
              )}
            </div>
          );
        })}
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
