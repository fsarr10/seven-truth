'use client';

import React from 'react';

const REASONS = [
  {
    num: '01',
    title: 'Tout sur place',
    desc: 'Son, vidéo, photo et montage sous le même toit.',
  },
  {
    num: '02',
    title: 'Pièce insonorisée',
    desc: 'Batterie, tam-tam, sabar : on joue fort, de 10h à 19h.',
  },
  {
    num: '03',
    title: 'Prix affichés',
    desc: 'Tu sais ce que tu paies avant de venir au studio.',
  },
  {
    num: '04',
    title: 'Wave & OM',
    desc: 'Acompte de 50 % direct pour bloquer définitivement ta date.',
  },
];

export function BrutalistWhyUs() {
  return (
    <section className="w-full bg-[#f1eadd] border-t-[1.5px] border-[#121110] py-16 px-[clamp(16px,3.2vw,40px)]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {REASONS.map((r) => (
          <div key={r.num} className="space-y-3 border-t-[1.5px] border-[#121110] pt-4">
            <span className="font-anton text-5xl sm:text-6xl text-[#d7261e] leading-none block">
              {r.num}
            </span>
            <h3 className="font-anton text-xl uppercase tracking-tight text-[#121110]">
              {r.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5d564c] leading-relaxed">
              {r.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
