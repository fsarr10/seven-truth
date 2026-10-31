'use client';

import React from 'react';

export function Hero3DFallback() {
  return (
    <div className="relative w-full h-[380px] md:h-[480px] flex items-center justify-center">
      {/* Halo néon doré / violet */}
      <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-gold/15 blur-3xl animate-pulse" />
      <div className="absolute w-56 h-56 rounded-full bg-neon-purple/15 blur-2xl" />

      {/* Disque vinyle stylisé en SVG vectoriel performant */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-gold/40 bg-surface shadow-2xl flex items-center justify-center shadow-gold/10">
        {/* Sillons */}
        <div className="w-[88%] h-[88%] rounded-full border border-white/10 flex items-center justify-center">
          <div className="w-[74%] h-[74%] rounded-full border border-gold/20 flex items-center justify-center">
            <div className="w-[58%] h-[58%] rounded-full border border-white/10 flex items-center justify-center">
              {/* Centre vinyle 7T */}
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-gold-dark via-gold to-gold-light text-background flex flex-col items-center justify-center shadow-lg">
                <span className="font-display font-black text-2xl tracking-tighter">7T</span>
                <span className="text-[9px] uppercase tracking-widest font-bold">Seven Truth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
