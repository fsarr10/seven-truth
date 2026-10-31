'use client';

import React, { useState } from 'react';
import { BrutalistHeader } from '@/components/brutalist/BrutalistHeader';
import { BrutalistHero } from '@/components/brutalist/BrutalistHero';
import { MarqueeBanner } from '@/components/brutalist/MarqueeBanner';
import { BrutalistRooms } from '@/components/brutalist/BrutalistRooms';
import { BrutalistFormulas } from '@/components/brutalist/BrutalistFormulas';
import { BrutalistManifesto } from '@/components/brutalist/BrutalistManifesto';
import { BrutalistGear } from '@/components/brutalist/BrutalistGear';
import { BrutalistWhyUs } from '@/components/brutalist/BrutalistWhyUs';
import { BrutalistBooking } from '@/components/brutalist/BrutalistBooking';
import { BrutalistFAQ } from '@/components/brutalist/BrutalistFAQ';
import { BrutalistFooter } from '@/components/brutalist/BrutalistFooter';

export default function HomePage() {
  const [selectedService, setSelectedService] = useState<string>('studio-heure');

  const handleSelectService = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  return (
    <div className="relative w-full bg-[#f1eadd] text-[#121110] selection:bg-[#d7261e] selection:text-[#f1eadd] overflow-x-clip">
      {/* 1. BARRE DU HAUT FIXE (58PX) */}
      <BrutalistHeader />

      {/* 2. (1) HERO (100SVH) */}
      <BrutalistHero />

      {/* 3. (2) BANDEAU DÉFILANT */}
      <MarqueeBanner />

      {/* 4. (01) LES SALLES — « Trois salles, une seule exigence. » */}
      <BrutalistRooms onSelectService={handleSelectService} />

      {/* 5. (02) FORMULES — « La tracklist des offres. » */}
      <BrutalistFormulas onSelectFormula={handleSelectService} />

      {/* 6. (03) MANIFESTE (FOND NOIR) */}
      <BrutalistManifesto />

      {/* 7. (04) LOCATION — « Du matos pro, à la journée. » */}
      <BrutalistGear onSelectGear={handleSelectService} />

      {/* 8. POURQUOI NOUS (4 COLONNES, GROS NUMÉROS ROUGES EN ANTON) */}
      <BrutalistWhyUs />

      {/* 9. (05) RÉSERVATION — « Bloque ta séance. » */}
      <BrutalistBooking preselectedService={selectedService} />

      {/* 10. (06) QUESTIONS — « Avant de venir. » */}
      <BrutalistFAQ />

      {/* 11. PIED DE PAGE ROUGE */}
      <BrutalistFooter />
    </div>
  );
}
