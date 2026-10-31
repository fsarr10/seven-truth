import React, { Suspense } from 'react';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { Calendar, ShieldCheck, Sparkles } from 'lucide-react';

export default function ReserverPage({
  searchParams,
}: {
  searchParams: { service?: string; space?: string };
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Réservation Instantanée 100% Sécurisée</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
          Réservez votre séance au Studio
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Choisissez votre formule, sélectionnez votre créneau libre en direct, puis versez votre acompte par Wave ou Orange Money.
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-12 text-zinc-500">Chargement du calendrier...</div>}>
        <BookingWizard
          initialServiceId={searchParams.service}
          initialSpaceId={searchParams.space}
        />
      </Suspense>
    </div>
  );
}
