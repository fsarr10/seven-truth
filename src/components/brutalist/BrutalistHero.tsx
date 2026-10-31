'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import dynamique du vinyle 3D Three.js sans SSR
const BrutalistVinyl3D = dynamic(
  () => import('./BrutalistVinyl3D').then((mod) => mod.BrutalistVinyl3D),
  { ssr: false }
);

export function BrutalistHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const sevenWordRef = useRef<HTMLHeadingElement>(null);
  const truthWordRef = useRef<HTMLHeadingElement>(null);
  const vinylWrapperRef = useRef<HTMLDivElement>(null);
  const infoBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const sevenLetters = heroRef.current?.querySelectorAll('.seven-char');
    const truthLetters = heroRef.current?.querySelectorAll('.truth-char');

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    // 1. Animation d'arrivée lettre par lettre (fluide sur mobile et desktop)
    if (sevenLetters && truthLetters && sevenLetters.length > 0) {
      tl.fromTo(
        sevenLetters,
        { yPercent: 110, opacity: 0, rotateZ: 3 },
        {
          yPercent: 0,
          opacity: 1,
          rotateZ: 0,
          duration: 1.0,
          stagger: 0.05,
        }
      ).fromTo(
        truthLetters,
        { yPercent: 110, opacity: 0, rotateZ: -3 },
        {
          yPercent: 0,
          opacity: 1,
          rotateZ: 0,
          duration: 1.0,
          stagger: 0.05,
        },
        '-=0.75'
      );
    }

    // 2. Arrivée du vinyle 3D et des barres d'informations
    if (vinylWrapperRef.current) {
      tl.fromTo(
        vinylWrapperRef.current,
        { scale: 0.75, opacity: 0, rotateZ: -75 },
        { scale: 1, opacity: 1, rotateZ: 0, duration: 1.2, ease: 'expo.out' },
        '-=0.9'
      );
    }

    if (infoBarRef.current && bottomBarRef.current && badgeRef.current) {
      tl.fromTo(
        [infoBarRef.current, bottomBarRef.current, badgeRef.current],
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
        '-=0.6'
      );
    }

    // 3. Parallaxe au scroll du Hero
    const heroTriggers: ScrollTrigger[] = [];
    if (heroRef.current && sevenWordRef.current && truthWordRef.current && vinylWrapperRef.current) {
      const st1 = ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
        animation: gsap.to(sevenWordRef.current, { xPercent: -8, ease: 'none' }),
      });

      const st2 = ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
        animation: gsap.to(truthWordRef.current, { xPercent: 8, ease: 'none' }),
      });

      const st3 = ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
        animation: gsap.to(vinylWrapperRef.current, { yPercent: -18, ease: 'none' }),
      });

      heroTriggers.push(st1, st2, st3);
    }

    // Actualisation du layout ScrollTrigger après chargement des polices sur mobile
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      clearTimeout(timer);
      heroTriggers.forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100svh] bg-[#f1eadd] flex flex-col justify-between pt-[58px] overflow-hidden"
    >
      {/* LIGNE D'INFOS EN MONO (FILET EN DESSOUS) */}
      <div
        ref={infoBarRef}
        className="w-full h-11 border-b-[1.5px] border-[#121110] px-[clamp(16px,3.2vw,40px)] flex items-center justify-between font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.06em]"
      >
        <span className="text-[#121110] font-bold">STUDIO · PLATEAU · SHOOTING</span>
        <span className="flex items-center gap-1.5 text-[#d7261e] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#d7261e] animate-ping" />
          ● SESSIONS OUVERTES
        </span>
        <span className="text-[#5d564c] font-semibold hidden sm:inline">THIÈS — SN</span>
      </div>

      {/* ZONE CENTRALE : « SEVEN » (GAUCHE) · VINYLE 3D · « TRUTH » (DROITE) */}
      <div className="relative flex-1 flex flex-col justify-center px-[clamp(16px,3.2vw,40px)] py-4 select-none">
        {/* Mot SEVEN (noir, gauche, z-index 10) */}
        <div className="relative z-10 overflow-hidden">
          <h1
            ref={sevenWordRef}
            className="font-anton uppercase tracking-tighter text-[#121110] leading-[0.8] text-[clamp(104px,23.5vw,400px)] max-[600px]:text-[31vw]"
          >
            {'SEVEN'.split('').map((char, idx) => (
              <span key={idx} className="seven-char inline-block will-change-transform">
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* VINYLE 3D (Entre les deux mots, derrière SEVEN z-5, devant TRUTH z-15) */}
        <div
          ref={vinylWrapperRef}
          className="absolute inset-0 m-auto w-full max-w-[620px] h-[360px] sm:h-[480px] z-[5] pointer-events-auto flex items-center justify-center"
        >
          <BrutalistVinyl3D />
        </div>

        {/* Mot TRUTH (rouge, droite, z-index 2) */}
        <div className="relative z-[2] text-right overflow-hidden -mt-4 sm:-mt-8">
          <h2
            ref={truthWordRef}
            className="font-anton uppercase tracking-tighter text-[#d7261e] leading-[0.8] text-[clamp(104px,23.5vw,400px)] max-[600px]:text-[31vw]"
          >
            {'TRUTH'.split('').map((char, idx) => (
              <span key={idx} className="truth-char inline-block will-change-transform">
                {char}
              </span>
            ))}
          </h2>
        </div>

        {/* MACARON ROND QUI TOURNE (18s par tour) */}
        {/* En bas à gauche sur desktop, en haut à droite (86px) sur mobile */}
        <div
          ref={badgeRef}
          className="absolute bottom-6 left-[clamp(16px,3.2vw,40px)] max-[760px]:bottom-auto max-[760px]:top-16 max-[760px]:right-4 z-20"
        >
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
            {/* Anneau de texte qui tourne */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full animate-spin"
              style={{ animationDuration: '18s', animationTimingFunction: 'linear' }}
            >
              <defs>
                <path
                  id="stampCircle"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                />
              </defs>
              <circle cx="50" cy="50" r="48" fill="#f1eadd" stroke="#121110" strokeWidth="1.5" />
              <text font-family="'JetBrains Mono', monospace" font-size="8.8" font-weight="700" fill="#121110" letter-spacing="2">
                <textPath href="#stampCircle">
                  DALAL AK JÀMM · BIENVENUE · THIÈS ·
                </textPath>
              </text>
            </svg>

            {/* Centre avec 7T rouge */}
            <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-[#f1eadd] border-[1.5px] border-[#121110] flex items-center justify-center">
              <span className="font-anton text-[#d7261e] text-base font-bold leading-none">7T</span>
            </div>
          </div>
        </div>
      </div>

      {/* BAS DU HERO (FILET AU-DESSUS, 3 COLONNES) */}
      <div
        ref={bottomBarRef}
        className="w-full border-t-[1.5px] border-[#121110] px-[clamp(16px,3.2vw,40px)] py-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
      >
        {/* Col 1 : Descriptif poétique avec Playfair italique rouge */}
        <div className="md:col-span-5 text-[14px] sm:text-[15px] text-[#121110] leading-snug">
          Ici, on enregistre <em className="font-serif italic text-[#d7261e] font-bold text-[1.1em]">la vérité</em> de Thiès : rap, mbalax, sabar, podcasts, images. Un studio son, un plateau et une salle shooting, sous le même toit.
        </div>

        {/* Col 2 : Indication défilement mono */}
        <div className="md:col-span-3 text-center md:text-left font-mono text-[11.5px] font-bold tracking-[0.06em] text-[#5d564c] uppercase">
          DÉFILER POUR FAIRE TOURNER ↓
        </div>

        {/* Col 3 : Boutons d'action */}
        <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-3 flex-wrap">
          <a
            href="#reservation"
            className="h-11 px-6 bg-[#d7261e] text-[#f1eadd] font-mono text-[12px] font-bold uppercase tracking-[0.06em] flex items-center justify-center hover:bg-[#b01c15] transition-colors border-[1.5px] border-[#121110]"
          >
            Réserver une séance →
          </a>

          <a
            href="#salles"
            className="h-11 px-5 bg-transparent text-[#121110] font-mono text-[12px] font-bold uppercase tracking-[0.06em] flex items-center justify-center hover:bg-[#121110] hover:text-[#f1eadd] transition-colors border-[1.5px] border-[#121110]"
          >
            Voir les salles
          </a>
        </div>
      </div>
    </section>
  );
}
