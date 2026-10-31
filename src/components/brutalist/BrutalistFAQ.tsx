'use client';

import React, { useState } from 'react';

interface FAQItem {
  num: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    num: '01',
    question: 'Comment je réserve une séance ?',
    answer:
      "Remplis directement la fiche de session sur cette page ou écris-nous sur WhatsApp. Une fois le créneau validé par l'équipe, tu verses l'acompte de 50 % par Wave ou Orange Money pour bloquer définitivement ta date. Le solde est réglé au studio le jour J.",
  },
  {
    num: '02',
    question: 'Je peux jouer batterie, tam-tam ou sabar ?',
    answer:
      "Oui ! Notre cabine est insonorisée pour encaisser de fortes pressions acoustiques. En accord avec le propriétaire et le voisinage à Thiès, les instruments acoustiques à forte intensité sonore (batterie, percussions, tam-tam, sabar) sont autorisés exclusivement du lundi au samedi, entre 10h et 19h (fin de session comprise).",
  },
  {
    num: '03',
    question: "Et si j'annule ma séance ?",
    answer:
      "Si tu préviens au moins 48 heures avant l'heure prévue, ton acompte est conservé et reporté sur une prochaine séance dans les 30 jours. En cas d'annulation moins de 48 heures avant ou de non-présentation, l'acompte est conservé pour dédommager l'équipe mobilisée.",
  },
  {
    num: '04',
    question: "L'ingénieur du son est-il inclus dans le prix ?",
    answer:
      "Oui, absolument. Toutes nos séances studio son (enregistrement, voix off, beatmaking, mixage) incluent la présence d'un ingénieur son professionnel résident qui calibre le matériel, règle tes niveaux de micro et gère les prises.",
  },
  {
    num: '05',
    question: 'Comment se passe la location de matériel ?',
    answer:
      'Une pièce d’identité physique (CNI ou passeport en cours de validité) ainsi qu’une caution (par chèque ou dépôt Wave sécurisé) sont demandées. Chaque appareil (caméra Sony, micro Shure, projecteur LED) est testé minutieusement avec toi au départ puis à la restitution.',
  },
];

export function BrutalistFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="w-full bg-[#f1eadd] border-t-[1.5px] border-[#121110] py-16 px-[clamp(16px,3.2vw,40px)]"
    >
      {/* EN-TÊTE DE SECTION (MODÈLE COMMUN) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-12 items-baseline">
        <div className="md:col-span-3 font-mono text-[12px] font-bold text-[#d7261e] uppercase tracking-[0.06em]">
          (06) QUESTIONS
        </div>
        <div className="md:col-span-9">
          <h2 className="font-anton uppercase tracking-tight text-[#121110] leading-[0.9] text-[clamp(54px,9vw,150px)]">
            Avant <em className="font-serif italic text-[#d7261e] font-bold text-[0.62em]">de</em> venir.
          </h2>
        </div>
      </div>

      {/* ACCORDÉON DE QUESTIONS */}
      <div className="border-t-[1.5px] border-[#121110]">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={faq.num}
              className="border-b-[1.5px] border-[#121110] transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="w-full py-6 sm:py-8 flex items-center justify-between gap-4 text-left group"
              >
                <div className="flex items-baseline gap-4 sm:gap-8">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#d7261e]">
                    ({faq.num})
                  </span>
                  <span className="font-sans font-bold text-lg sm:text-2xl text-[#121110] group-hover:text-[#d7261e] transition-colors">
                    {faq.question}
                  </span>
                </div>

                {/* Bouton rond « + » qui tourne en « − » sur fond rouge */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-[1.5px] border-[#121110] flex items-center justify-center font-mono text-lg font-bold flex-shrink-0 transition-all duration-300 ${
                    isOpen
                      ? 'bg-[#d7261e] text-white border-[#d7261e] rotate-45'
                      : 'bg-transparent text-[#121110] group-hover:border-[#d7261e] group-hover:text-[#d7261e]'
                  }`}
                >
                  +
                </div>
              </button>

              {/* OUVERTURE FLUIDE EN GRID-TEMPLATE-ROWS: 0FR -> 1FR */}
              <div
                className="grid transition-all duration-300 ease-custom"
                style={{
                  gridTemplateRows: isOpen ? '1fr' : '0fr',
                }}
              >
                <div className="overflow-hidden">
                  <div className="pl-8 sm:pl-16 pr-4 pb-6 sm:pb-8 text-xs sm:text-sm text-[#2a2724] leading-relaxed max-w-3xl">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
