import React from 'react';
import Link from 'next/link';
import { formatFCFA } from '@/lib/utils/currency';
import { GraduationCap, Calendar, Clock, MapPin, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export default function FormationsPage() {
  const workshops = [
    {
      id: 'ws-01',
      title: 'Masterclass Beatmaking & MAO (FL Studio / Ableton)',
      date: 'Samedi 14 & Dimanche 15 Novembre 2026',
      time: '10h00 – 17h00',
      price: 25000,
      instructor: 'Thiès Beat Collective',
      spots: '12 places (limité)',
      desc: 'Apprenez à composer des beats percutants mêlant polyrythmies sabar, trap wolof et afrobeats. Synthèse sonore, arrangements et mixage des drums.',
      modules: ['Structure d\'un hit afro-urbain', 'Sample & intégration percussions sabar', 'Mixage stems & mastering pour YouTube/Spotify']
    },
    {
      id: 'ws-02',
      title: 'Formation Prise de Son & Mixage Voix',
      date: 'Samedi 28 & Dimanche 29 Novembre 2026',
      time: '10h00 – 16h00',
      price: 35000,
      instructor: 'Modou Fall & Awa Ndiaye',
      spots: '8 places en régie',
      desc: 'Prise de son en cabine insonorisée, choix des micros (Shure SM7B vs Rode), traitement dynamique (EQ, compresseurs, autotune, reverbs).',
      modules: ['Acoustique et positionnement micro', 'Chaîne de gain Apollo & monitoring', 'Nettoyage des prises et mixage professionnel']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
          Transmission & Compétences
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
          Formations & Masterclasses
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Formations intensives en petit groupe au studio à Thiès pour devenir autonome en production musicale et audiovisuelle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {workshops.map(w => (
          <div key={w.id} className="bg-surface-secondary border border-surface-border rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold/15 text-gold border border-gold/30">
                  Formation Week-end
                </span>
                <span className="font-display font-black text-2xl text-gold">
                  {formatFCFA(w.price)}
                </span>
              </div>

              <h2 className="font-display font-bold text-xl text-white">{w.title}</h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{w.desc}</p>

              <div className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-surface-border">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold" />
                  <span>{w.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold" />
                  <span>{w.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold" />
                  <span>Studio Seven Truth, Thiès</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gold" />
                  <span>Intervenant : {w.instructor} ({w.spots})</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                  Programme résumé :
                </span>
                {w.modules.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/reserver?service=formation-week-end"
                className="w-full py-3 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-gold/15 transition-all active:scale-95"
              >
                <span>S'inscrire et payer l'acompte (Wave / OM)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
