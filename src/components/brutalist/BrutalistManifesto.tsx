'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function BrutalistManifesto() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!textRef.current || !sectionRef.current) return;

    const words = textRef.current.querySelectorAll('.word-reveal');
    if (!words || words.length === 0) return;

    // ScrollTrigger scrub : chaque mot s'allume au fil du défilement (optimisé mobile & desktop)
    const anim = gsap.fromTo(
      words,
      { opacity: 0.35, color: '#3c3833' },
      {
        opacity: 1,
        color: (i, target) => {
          return target.classList.contains('word-red') ? '#d7261e' : '#f1eadd';
        },
        stagger: 0.08,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'bottom 25%',
          scrub: 0.4,
        },
      }
    );

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      clearTimeout(timer);
      if (anim.scrollTrigger) {
        anim.scrollTrigger.kill();
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#121110] text-[#f1eadd] py-24 sm:py-32 px-[clamp(16px,3.2vw,40px)] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* En-tête de section en mono rouge */}
        <div className="font-mono text-[12px] font-bold text-[#d7261e] uppercase tracking-[0.06em]">
          (03) LE MANIFESTE
        </div>

        {/* TEXTE DU MANIFESTE INTER 800 GÉANT */}
        <p
          ref={textRef}
          className="font-sans font-extrabold text-[clamp(34px,5.4vw,84px)] leading-[1.08] tracking-[-0.035em] text-[#3c3833]"
        >
          <span className="word-reveal">Chaque</span>{' '}
          <span className="word-reveal">voix</span>{' '}
          <span className="word-reveal">de</span>{' '}
          <span className="word-reveal">Thiès</span>{' '}
          <span className="word-reveal">mérite</span>{' '}
          <span className="word-reveal">un</span>{' '}
          <span className="word-reveal">vrai</span>{' '}
          <span className="word-reveal">studio.</span>{' '}
          <span className="word-reveal">Pas</span>{' '}
          <span className="word-reveal">besoin</span>{' '}
          <span className="word-reveal">d'aller</span>{' '}
          <span className="word-reveal">à</span>{' '}
          <span className="word-reveal">Dakar</span>{' '}
          <span className="word-reveal">pour</span>{' '}
          <span className="word-reveal">sonner</span>{' '}
          <span className="word-reveal">pro</span>{' '}
          <span className="word-reveal">:</span>{' '}
          <span className="word-reveal">on</span>{' '}
          <span className="word-reveal">t'ouvre</span>{' '}
          <span className="word-reveal">la</span>{' '}
          <span className="word-reveal">porte,</span>{' '}
          <span className="word-reveal">on</span>{' '}
          <span className="word-reveal">règle</span>{' '}
          <span className="word-reveal">les</span>{' '}
          <span className="word-reveal">niveaux,</span>{' '}
          <span className="word-reveal">et</span>{' '}
          <span className="word-reveal">on</span>{' '}
          <span className="word-reveal">capte</span>{' '}
          <span className="word-reveal word-red font-serif italic text-[1.12em] text-[#d7261e]">
            ta
          </span>{' '}
          <span className="word-reveal word-red font-serif italic text-[1.12em] text-[#d7261e]">
            vérité.
          </span>
        </p>

        {/* BAS DU MANIFESTE : SIGNATURE + ÉGALISEUR 6 BARRES ROUGES */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          {/* Signature mono précédée d'un trait rouge */}
          <div className="flex items-center gap-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.06em] text-[#f1eadd]">
            <span className="w-8 h-[2px] bg-[#d7261e]" />
            <span>L'ÉQUIPE SEVEN TRUTH</span>
          </div>

          {/* Égaliseur audio 6 barres rouges */}
          <div className="flex items-end gap-1.5 h-7">
            {[45, 90, 60, 100, 75, 50].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-[#d7261e] rounded-sm animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.9s',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
