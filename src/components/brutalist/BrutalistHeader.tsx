'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export function BrutalistHeader() {
  const [dakarTime, setDakarTime] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Horloge en direct sur le fuseau Africa/Dakar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Africa/Dakar',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
      setDakarTime(formatted);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Détection du scroll : se cache au-delà de 400px en descendant, réapparaît en remontant
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 400 && currentScrollY > lastScrollY) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { href: '#salles', label: 'Salles' },
    { href: '#formules', label: 'Formules' },
    { href: '#materiel', label: 'Matériel' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 h-[58px] bg-[#f1eadd] border-b-[1.5px] border-[#121110] px-[clamp(16px,3.2vw,40px)] flex items-center justify-between transition-transform duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(.2,.8,.2,1)' }}
      >
        {/* GAUCHE : VOYANT REC + SEVEN TRUTH EN ANTON 24PX */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span
            className="w-2.5 h-2.5 rounded-full bg-[#d7261e] animate-pulse flex-shrink-0"
            title="Session active"
          />
          <span className="font-anton text-[24px] tracking-tight uppercase text-[#121110] leading-none">
            SEVEN TRUTH
          </span>
        </Link>

        {/* CENTRE : HEURE EN DIRECT AFRICA/DAKAR + COORDONNÉES (MASQUÉ SOUS 1000PX) */}
        <div className="hidden min-[1000px]:flex items-center gap-3 font-mono text-[11.5px] tracking-[0.06em] uppercase text-[#5d564c]">
          <span className="text-[#121110] font-bold">THIÈS {dakarTime || '14:00:00'}</span>
          <span className="text-[#121110]/30">·</span>
          <span>14°47′N · 16°55′W</span>
          <span className="text-[#121110]/30">·</span>
          <span className="text-[#d7261e] font-bold">LABEL INDÉPENDANT</span>
        </div>

        {/* DROITE : LIENS AVEC SOULIGNEMENT ROUGE GLISSANT + BOUTON NOIR */}
        <div className="hidden min-[760px]:flex items-center gap-7">
          <nav className="flex items-center gap-6 font-mono text-[12.5px] uppercase tracking-[0.06em]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative py-1 text-[#121110] hover:text-[#d7261e] transition-colors group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#d7261e] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <a
            href="#reservation"
            className="h-10 px-5 bg-[#121110] text-[#f1eadd] font-mono text-[12px] font-bold uppercase tracking-[0.06em] flex items-center justify-center hover:bg-[#d7261e] transition-colors active:translate-x-[1px] active:translate-y-[1px]"
          >
            Réserver →
          </a>
        </div>

        {/* MOBILE (< 760PX) : BOUTON ENCADRÉ MENU */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="min-[760px]:hidden h-9 px-3.5 border-[1.5px] border-[#121110] font-mono text-[12px] font-bold uppercase tracking-[0.06em] text-[#121110] bg-[#f1eadd] hover:bg-[#121110] hover:text-[#f1eadd] transition-colors"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {isMenuOpen ? 'FERMER' : 'MENU'}
        </button>
      </header>

      {/* PANNEAU MOBILE PLEIN ÉCRAN ROUGE (CLIP-PATH DU HAUT VERS LE BAS, 0.6S) */}
      <div
        className={`fixed inset-0 z-30 bg-[#d7261e] text-[#f1eadd] flex flex-col justify-between pt-[70px] pb-10 px-6 transition-all duration-500 ease-custom min-[760px]:hidden ${
          isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{
          clipPath: isMenuOpen ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 100% 0, 100% 0, 0 0)',
          transition: 'clip-path 0.6s cubic-bezier(.2,.8,.2,1), opacity 0.3s ease',
        }}
      >
        <div className="space-y-4">
          <div className="font-mono text-xs uppercase tracking-widest text-[#f1eadd]/60 pb-3 border-b border-white/20">
            NAVIGATION STUDIO
          </div>

          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="font-anton text-4xl sm:text-5xl uppercase tracking-tight py-4 border-b border-white/20 hover:pl-3 transition-all text-[#f1eadd]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#reservation"
              onClick={() => setIsMenuOpen(false)}
              className="font-anton text-4xl sm:text-5xl uppercase tracking-tight py-4 text-[#121110] bg-[#f1eadd] px-4 mt-6 inline-block text-center"
            >
              RÉSERVER UNE SÉANCE →
            </a>
          </nav>
        </div>

        <div className="font-mono text-xs uppercase tracking-widest text-[#f1eadd]/80 pt-6 border-t border-white/20 space-y-1">
          <div>THIÈS, SÉNÉGAL · 14°47′N · 16°55′W</div>
          <div>LUN – SAM : 10H – 20H</div>
        </div>
      </div>
    </>
  );
}
