import React from 'react';
import Link from 'next/link';
import { HeroCanvas } from '@/components/3d/HeroCanvas';
import { AudioPlayer } from '@/components/portfolio/AudioPlayer';
import {
  INITIAL_PORTFOLIO, INITIAL_SPACES, INITIAL_SERVICES,
  INITIAL_EQUIPMENT, INITIAL_ARTISTS, INITIAL_REVIEWS
} from '@/lib/store/initialData';
import { formatFCFA } from '@/lib/utils/currency';
import {
  Calendar, Mic, Tv, Camera, ArrowRight, ShieldCheck,
  Smartphone, Volume2, Star, MapPin, Phone, HelpCircle,
  Sliders, Disc, Clock, Music2, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const featuredTracks = INITIAL_PORTFOLIO.filter(p => p.category === 'audio');
  const featuredServices = INITIAL_SERVICES.filter(s => s.featured);
  const featuredGear = INITIAL_EQUIPMENT.slice(0, 4);

  return (
    <div className="space-y-20 pb-24 overflow-hidden">
      {/* 1. HERO SECTION : AUTHENTIQUE STUDIO DE MUSIQUE & AUDIOVISUEL */}
      <section className="relative pt-6 sm:pt-12 pb-12 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Colonne gauche : Typographie éditoriale & Badges techniques */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left relative z-10">
            {/* Télémétrie studio en temps réel */}
            <div className="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-[#14151c] border border-zinc-800 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-red-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                REC ON AIR
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-300">THIÈS · QUARTIER DIXIÈME</span>
              <span className="text-zinc-600 hidden sm:inline">|</span>
              <span className="text-gold font-semibold hidden sm:inline">CONSOLE APOLLO X8</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08]">
              STUDIO D'ENREGISTREMENT &amp; PLATEAU VIDÉO À THIÈS.
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Cabine voix insonorisée double coque, plateau podcast 4K multi-caméras, shooting photo et parc de matériel cinéma (Sony FX3, Shure SM7B). Enregistrez, clippez et louez votre matériel sans quitter Thiès.
            </p>

            {/* Actions principales de réservation */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/reserver"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gold hover:bg-gold-light text-[#0a0a0c] font-display font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-gold/20 transition-all active:scale-95 group"
              >
                <Calendar className="w-4 h-4" />
                <span>Réserver un Créneau</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/espaces"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#14161f] border border-zinc-700/80 text-zinc-200 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 hover:border-gold hover:text-white transition-all active:scale-95"
              >
                <Disc className="w-4 h-4 text-gold" />
                <span>Explorer les 3 Espaces</span>
              </Link>
            </div>

            {/* Garanties concrètes locales */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs text-zinc-400 font-mono">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#12131a] border border-zinc-800">
                <Smartphone className="w-3.5 h-3.5 text-[#1dc3f5]" />
                Wave &amp; Orange Money (50% acompte)
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#12131a] border border-zinc-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Isolation phonique renforcée
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#12131a] border border-zinc-800">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                Sabar 10h–19h (Lun–Sam)
              </span>
            </div>
          </div>

          {/* Colonne droite : Platine Vinyle Analogique 3D */}
          <div className="lg:col-span-5 relative">
            <HeroCanvas />
          </div>
        </div>

        {/* FICHE TECHNIQUE STUDIO (RACK D'INFORMATIONS DIRECTES) */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 bg-[#101218] rounded-2xl border border-zinc-800 shadow-xl">
          <div className="p-3 border-r border-zinc-800/80 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Studio A (Voix)</span>
            <span className="font-display font-extrabold text-lg sm:text-xl text-white block">10 000 FCFA</span>
            <span className="text-[11px] text-zinc-400">Par heure avec ingénieur son</span>
          </div>

          <div className="p-3 border-r border-zinc-800/80 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Plateau B (Podcast)</span>
            <span className="font-display font-extrabold text-lg sm:text-xl text-gold block">15 000 FCFA</span>
            <span className="text-[11px] text-zinc-400">Régie 4K multi-caméras</span>
          </div>

          <div className="p-3 border-r border-zinc-800/80 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Parc Caméras</span>
            <span className="font-display font-extrabold text-lg sm:text-xl text-white block">Sony FX3 &amp; A7IV</span>
            <span className="text-[11px] text-zinc-400">Location à la journée à Thiès</span>
          </div>

          <div className="p-3 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Avis Vérifiés</span>
            <span className="font-display font-extrabold text-lg sm:text-xl text-gold block">4.9 / 5</span>
            <span className="text-[11px] text-zinc-400">Artistes de Thiès &amp; Dakar</span>
          </div>
        </div>
      </section>

      {/* 2. NOS 3 ESPACES DE CRÉATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-gold block mb-1">
              [ INFRASTRUCTURES &amp; CABINES ]
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
              Trois Espaces Insonorisés et Climatisés
            </h2>
          </div>
          <Link href="/espaces" className="text-xs sm:text-sm text-gold hover:underline flex items-center gap-1 font-semibold">
            <span>Voir toute la fiche technique</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_SPACES.map((space) => (
            <div
              key={space.id}
              className="bg-[#12131a] rounded-2xl overflow-hidden flex flex-col justify-between border border-zinc-800 hover:border-gold/60 transition-all group"
            >
              <div>
                <div className="relative h-56 overflow-hidden bg-black">
                  <img
                    src={space.photos[0]}
                    alt={space.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12131a] via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-black/80 text-gold border border-gold/40">
                      {formatFCFA(space.hourly_rate)} / heure
                    </span>
                  </div>

                  {space.noisy_allowed ? (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-600/60 flex items-center gap-1">
                        <Volume2 className="w-3 h-3" /> Sabar 10h–19h
                      </span>
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-600/60 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Cabine Voix Isolée
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-display font-extrabold text-lg text-white group-hover:text-gold transition-colors">
                    {space.name}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {space.description}
                  </p>

                  <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                      Équipements inclus :
                    </span>
                    <ul className="text-xs text-zinc-300 space-y-1">
                      {space.equipment_included.slice(0, 3).map((eq, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                          <span>{eq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href={`/reserver?space=${space.id}`}
                  className="w-full py-2.5 rounded-lg bg-[#181a24] hover:bg-gold hover:text-[#0a0a0c] text-white border border-zinc-700 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>Réserver cet espace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PACKS & FORMULES POPULAIRES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="border-b border-zinc-800 pb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-gold block mb-1">
            [ FORMULES CLÉ EN MAIN ]
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
            Tarifs Tout Compris &amp; Accompagnement
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredServices.slice(0, 3).map((srv) => (
            <div
              key={srv.id}
              className="p-6 rounded-2xl bg-[#12131a] border border-zinc-800 hover:border-gold/60 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-mono uppercase text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/30">
                    {srv.category}
                  </span>
                  <span className="font-display font-extrabold text-2xl text-white group-hover:text-gold transition-colors">
                    {formatFCFA(srv.price)}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-extrabold text-lg text-white">{srv.name}</h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{srv.description}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#0d0e13] border border-zinc-800/80 space-y-1.5 text-xs text-zinc-300 font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Durée en studio :</span>
                    <strong>{srv.duration_hours} heure(s)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Acompte requis :</span>
                    <strong className="text-gold">{srv.deposit_percentage}% via Wave ou OM</strong>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href={`/reserver?service=${srv.id}`}
                  className="w-full py-2.5 rounded-lg bg-gold hover:bg-gold-light text-[#0a0a0c] font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>Choisir cette formule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ÉCOUTE STUDIO MASTER : STREAMING DES PRODUCTIONS DU LABEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="border-b border-zinc-800 pb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-gold block mb-1">
            [ PORTFOLIO AUDIO · EXTRAITS RÉCENTS ]
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
            Les Productions Enregistrées au Studio
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <AudioPlayer tracks={featuredTracks} />
        </div>
      </section>

      {/* 5. LOCATION MATÉRIEL CINÉMA & VIDÉO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#12131a] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-gold block mb-1">
                [ PARC MATÉRIEL DISPONIBLE À THIÈS ]
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                Location de Caméras, Micros et Éclairage
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Contrôle au départ et au retour avec CNI physique et caution sécurisée.
              </p>
            </div>

            <Link
              href="/materiel"
              className="px-5 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-[#0a0a0c] font-bold text-xs flex items-center gap-2 transition-all self-start sm:self-auto"
            >
              <span>Voir tout le catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredGear.map((item) => (
              <div key={item.id} className="bg-[#0e0f14] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between hover:border-gold/50 transition-colors">
                <div>
                  <div className="h-36 w-full rounded-lg overflow-hidden bg-black mb-3 relative">
                    <img
                      src={item.photos[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/90 text-gold border border-gold/30">
                        {formatFCFA(item.daily_price)}/j
                      </span>
                    </div>
                  </div>
                  <h4 className="font-bold text-white text-sm leading-tight">{item.name}</h4>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{item.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Caution : {formatFCFA(item.deposit_required)}
                  </span>
                  <Link
                    href="/materiel"
                    className="px-2.5 py-1 rounded bg-[#181a24] border border-zinc-700 text-gold font-bold text-xs hover:border-gold"
                  >
                    Louer
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ARTISTES DU LABEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="border-b border-zinc-800 pb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-gold block mb-1">
            [ COMMUNAUTÉ &amp; ARTISTES DU LABEL ]
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
            Les Artistes &amp; Beatmakers Résidents
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_ARTISTS.map((artist) => (
            <div key={artist.id} className="bg-[#12131a] rounded-2xl p-6 text-center space-y-4 border border-zinc-800 hover:border-gold/40 transition-all">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-gold shadow-lg relative bg-black">
                <img
                  src={artist.photo_url}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-white">{artist.name}</h3>
                <span className="text-xs text-gold font-mono uppercase tracking-wider">{artist.genre}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">{artist.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. AVIS CLIENTS VÉRIFIÉS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="border-b border-zinc-800 pb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-gold block mb-1">
            [ TÉMOIGNAGES ARTISTES &amp; CRÉATEURS ]
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
            La Confiance de la Scène de Thiès &amp; Dakar
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {INITIAL_REVIEWS.map((rev) => (
            <div key={rev.id} className="p-5 bg-[#12131a] rounded-xl flex flex-col justify-between space-y-3 border border-zinc-800">
              <div className="space-y-2">
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-zinc-300 italic">"{rev.comment}"</p>
              </div>
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-white block">{rev.client_name}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{rev.service || rev.client_type || 'Session Studio'}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">Vérifié</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. LOCALISATION DU STUDIO & CONTACT DIRECT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#12131a] border border-zinc-800 rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-gold block">
              [ ACCÈS STUDIO &amp; HORAIRES ]
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
              Passez au Studio à Thiès
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Situé au Quartier Dixième, notre appartement est aménagé pour la création musicale et la production audiovisuelle. Accueil convivial avec thé Ataya offert aux artistes en session.
            </p>

            <div className="space-y-2 text-xs text-zinc-400 font-mono pt-2">
              <div className="flex items-center gap-2 text-zinc-300">
                <MapPin className="w-4 h-4 text-gold" />
                <span>Quartier Dixième, Thiès (Sénégal) — face au jardin</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Clock className="w-4 h-4 text-gold" />
                <span>Ouvert 7j/7 sur réservation · Sabar : 10h–19h (Lun–Sam)</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Phone className="w-4 h-4 text-gold" />
                <span>WhatsApp direct : +221 77 450 12 34</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/221774501234?text=Bonjour%20Seven%20Truth,%20je%20souhaite%20r%C3%A9server%20une%20session%20au%20studio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-xs transition-colors shadow-md"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Contacter le Studio sur WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-zinc-800 bg-black relative">
            <iframe
              title="Carte de localisation Seven Truth Thiès"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3856.772097334431!2d-16.9298416!3d14.781846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec1bf4b14d9b139%3A0x286341d37a28469!2sThi%C3%A8s%2C%20Senegal!5e0!3m2!1sfr!2ssn!4v1700000000000!5m2!1sfr!2ssn"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
