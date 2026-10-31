'use client';

import React from 'react';

export interface LogoProps {
  variant?: 'full' | 'mark' | 'compact' | 'seal';
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  showLocation?: boolean;
}

/**
 * Logo Officiel de SEVEN TRUTH (Label Musical & Média — Thiès, Sénégal)
 * Monogramme 7T interlocking en or brossé & typographie éditoriale haute précision.
 */
export function SevenTruthLogo({
  variant = 'full',
  size = 'md',
  className = '',
  showLocation = true,
}: LogoProps) {
  // Dimensions par défaut selon le preset
  const dimensions = {
    sm: { mark: 32, fullWidth: 160, fullHeight: 36, fontSizeTitle: 14, fontSizeSub: 7 },
    md: { mark: 42, fullWidth: 210, fullHeight: 46, fontSizeTitle: 17, fontSizeSub: 8 },
    lg: { mark: 56, fullWidth: 260, fullHeight: 58, fontSizeTitle: 21, fontSizeSub: 9 },
    xl: { mark: 72, fullWidth: 320, fullHeight: 70, fontSizeTitle: 25, fontSizeSub: 10 },
  };

  const dim = typeof size === 'number'
    ? { mark: size, fullWidth: size * 4.6, fullHeight: size * 1.1, fontSizeTitle: size * 0.4, fontSizeSub: size * 0.18 }
    : dimensions[size] || dimensions.md;

  // 1. LE MONOGRAMME SEUL (7T MARK)
  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 64 64"
        width={dim.mark}
        height={dim.mark}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`flex-shrink-0 ${className}`}
        aria-label="Logo Seven Truth 7T"
      >
        <defs>
          <linearGradient id="stGold7" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A8" />
            <stop offset="35%" stopColor="#E5A93C" />
            <stop offset="75%" stopColor="#BA7B1E" />
            <stop offset="100%" stopColor="#8A550D" />
          </linearGradient>
          <linearGradient id="stGoldT" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C98822" />
            <stop offset="45%" stopColor="#FFE58F" />
            <stop offset="100%" stopColor="#E5A93C" />
          </linearGradient>
        </defs>

        {/* Châssis studio noir biseauté */}
        <rect x="2" y="2" width="60" height="60" rx="16" fill="#0D0E13" stroke="#252733" strokeWidth="1.2" />

        {/* Sillons concentriques de vinyle discrets */}
        <circle cx="32" cy="32" r="24" stroke="#E5A93C" strokeOpacity="0.14" strokeWidth="0.8" />
        <circle cx="32" cy="32" r="18" stroke="#E5A93C" strokeOpacity="0.08" strokeWidth="0.8" strokeDasharray="3 3" />

        {/* LETTRE 'T' (Sous le croisement) */}
        <g id="mark-T">
          {/* Traverse du T */}
          <rect x="26" y="24" width="24" height="6" rx="1.5" fill="url(#stGoldT)" />
          {/* Jambage vertical du T */}
          <rect x="35" y="24" width="6" height="24" rx="1.5" fill="url(#stGoldT)" />
        </g>

        {/* CHIFFRE '7' (En premier plan avec ombre portée sur le croisement) */}
        <g id="mark-7">
          <path
            d="M 14 15 L 43 15 L 43 21 L 28 48 L 21 48 L 34 22 L 14 22 Z"
            fill="url(#stGold7)"
            filter="drop-shadow(2px 2px 3px rgba(0,0,0,0.85))"
          />
        </g>

        {/* POINT DE VÉRITÉ (Prisme diamant doré) */}
        <polygon points="49,46 52,49 49,52 46,49" fill="#FFF2A8" />
      </svg>
    );
  }

  // 2. LE SCEAU CIRCULAIRE (VINYL SEAL STAMP)
  if (variant === 'seal') {
    return (
      <svg
        viewBox="0 0 120 120"
        width={dim.mark * 2}
        height={dim.mark * 2}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`flex-shrink-0 ${className}`}
        aria-label="Sceau officiel Seven Truth"
      >
        <defs>
          <linearGradient id="sealGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A8" />
            <stop offset="50%" stopColor="#E5A93C" />
            <stop offset="100%" stopColor="#8A550D" />
          </linearGradient>
        </defs>

        {/* Disque vinyl extérieur */}
        <circle cx="60" cy="60" r="56" fill="#0A0B0F" stroke="url(#sealGold)" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="48" stroke="#E5A93C" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="60" cy="60" r="40" stroke="#E5A93C" strokeOpacity="0.12" strokeWidth="0.8" />

        {/* Monogramme central réduit */}
        <g transform="translate(28, 28) scale(0.64)">
          <rect x="26" y="24" width="24" height="6" rx="1.5" fill="url(#sealGold)" />
          <rect x="35" y="24" width="6" height="24" rx="1.5" fill="url(#sealGold)" />
          <path
            d="M 14 15 L 43 15 L 43 21 L 28 48 L 21 48 L 34 22 L 14 22 Z"
            fill="url(#sealGold)"
            filter="drop-shadow(2px 2px 3px rgba(0,0,0,0.85))"
          />
        </g>

        {/* Typographie circulaire autour du macaron */}
        <path id="circleTextPath" d="M 60,14 A 46,46 0 1,1 59.9,14" fill="none" />
        <text fontSize="7.5" fill="#E5A93C" fontWeight="700" letterSpacing="2.5">
          <textPath href="#circleTextPath" startOffset="50%" textAnchor="middle">
            SEVEN TRUTH RECORDS · THIÈS SÉNÉGAL
          </textPath>
        </text>
      </svg>
    );
  }

  // 3. LOGO COMPLET HORIZONTAL (MARK + WORDMARK ÉDITORIAL)
  return (
    <div className={`inline-flex items-center gap-3.5 group cursor-pointer ${className}`}>
      {/* Monogramme 7T */}
      <svg
        viewBox="0 0 64 64"
        width={dim.mark}
        height={dim.mark}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="navGold7" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A8" />
            <stop offset="35%" stopColor="#E5A93C" />
            <stop offset="75%" stopColor="#BA7B1E" />
            <stop offset="100%" stopColor="#8A550D" />
          </linearGradient>
          <linearGradient id="navGoldT" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C98822" />
            <stop offset="45%" stopColor="#FFE58F" />
            <stop offset="100%" stopColor="#E5A93C" />
          </linearGradient>
        </defs>

        {/* Châssis studio noir biseauté */}
        <rect x="2" y="2" width="60" height="60" rx="16" fill="#0D0E13" stroke="#252733" strokeWidth="1.2" />

        {/* Sillons concentriques de vinyle discrets */}
        <circle cx="32" cy="32" r="24" stroke="#E5A93C" strokeOpacity="0.14" strokeWidth="0.8" />
        <circle cx="32" cy="32" r="18" stroke="#E5A93C" strokeOpacity="0.08" strokeWidth="0.8" strokeDasharray="3 3" />

        {/* Traverse et jambage du T */}
        <rect x="26" y="24" width="24" height="6" rx="1.5" fill="url(#navGoldT)" />
        <rect x="35" y="24" width="6" height="24" rx="1.5" fill="url(#navGoldT)" />

        {/* Barre et lame du 7 */}
        <path
          d="M 14 15 L 43 15 L 43 21 L 28 48 L 21 48 L 34 22 L 14 22 Z"
          fill="url(#navGold7)"
          filter="drop-shadow(2px 2px 3px rgba(0,0,0,0.85))"
        />

        {/* Point de vérité doré */}
        <polygon points="49,46 52,49 49,52 46,49" fill="#FFF2A8" />
      </svg>

      {/* Bloc typographique SEVEN TRUTH */}
      <div className="flex flex-col justify-center select-none">
        <span className="font-display font-black text-white text-base sm:text-lg tracking-[0.14em] leading-none group-hover:text-gold transition-colors">
          SEVEN TRUTH
        </span>
        {variant !== 'compact' && showLocation && (
          <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-400 font-mono font-bold flex items-center gap-1.5 mt-1">
            <span className="text-gold">STUDIO</span>
            <span className="text-zinc-600 font-normal">/</span>
            <span>RECORDS</span>
            <span className="text-gold font-black">·</span>
            <span className="text-gold font-semibold">THIÈS</span>
          </span>
        )}
      </div>
    </div>
  );
}
export default SevenTruthLogo;
