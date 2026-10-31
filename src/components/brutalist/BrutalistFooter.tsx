'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function BrutalistFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const jerejefRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!footerRef.current || !jerejefRef.current) return;

    // Parallaxe de « JËRËJËF » qui remonte (fluide sur mobile et desktop)
    const anim = gsap.fromTo(
      jerejefRef.current,
      { yPercent: 25 },
      {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      }
    );

    return () => {
      if (anim.scrollTrigger) {
        anim.scrollTrigger.kill();
      }
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#d7261e] text-[#121110] border-t-[1.5px] border-[#121110] pt-16 sm:pt-20 pb-8 px-[clamp(16px,3.2vw,40px)] overflow-hidden"
    >
      <div className="space-y-12 sm:space-y-16">
        {/* TITRE APPEL À L'ACTION + BOUTON NOIR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-[1.5px] border-[#121110] pb-10">
          <div>
            <h2 className="font-anton uppercase tracking-tight text-white leading-[0.88] text-[clamp(48px,8vw,130px)]">
              On se voit <em className="font-serif italic text-[#121110] font-bold text-[0.62em]">au</em> studio.
            </h2>
          </div>

          <a
            href="#reservation"
            className="h-12 px-8 bg-[#121110] text-[#f1eadd] font-mono text-xs font-bold uppercase tracking-[0.06em] flex items-center justify-center hover:bg-black transition-colors self-start md:self-auto border-[1.5px] border-[#121110]"
          >
            Réserver maintenant →
          </a>
        </div>

        {/* 3 COLONNES D'INFORMATIONS PRATIQUES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 font-mono text-xs text-[#121110] tracking-[0.04em] uppercase border-b-[1.5px] border-[#121110] pb-10">
          <div className="space-y-1.5">
            <span className="font-bold text-white block">ADRESSE STUDIO</span>
            <div>Quartier Dixième, Thiès</div>
            <div>Sénégal · 14°47′N · 16°55′W</div>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-white block">HORAIRES D'OUVERTURE</span>
            <div>Lundi – Samedi : 10h – 20h</div>
            <div>Sabar / Batterie : 10h – 19h</div>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-white block">CONTACT DIRECT</span>
            <div>WhatsApp : +221 77 450 12 34</div>
            <div>contact@seventruth.sn</div>
          </div>
        </div>

        {/* « JËRËJËF » EN ANTON NOIR GÉANT QUI REMONTE EN PARALLAXE */}
        <div className="relative overflow-hidden py-4 text-center select-none">
          <div
            ref={jerejefRef}
            className="font-anton uppercase text-[#121110] leading-[0.78] tracking-tighter text-[clamp(110px,26vw,430px)] pointer-events-none will-change-transform"
          >
            JËRËJËF
          </div>
        </div>

        {/* DERNIÈRE LIGNE EN MONO */}
        <div className="pt-4 border-t-[1.5px] border-[#121110] flex flex-col sm:flex-row justify-between items-center font-mono text-[11px] text-[#121110] uppercase tracking-[0.06em] gap-2">
          <span>© {new Date().getFullYear()} SEVEN TRUTH · TOUS DROITS RÉSERVÉS</span>
          <span className="font-bold">WAVE · ORANGE MONEY · ESPÈCES</span>
        </div>
      </div>
    </footer>
  );
}
