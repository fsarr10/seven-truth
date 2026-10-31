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
  Smartphone, Volume2, Sparkles, CheckCircle2, ChevronRight,
  Headphones, Star, MapPin, Phone, HelpCircle, Radio, Award,
  Sliders, Music, Disc
} from 'lucide-react';

export default function HomePage() {
  const featuredTracks = INITIAL_PORTFOLIO.filter(p => p.category === 'audio');
  const featuredServices = INITIAL_SERVICES.filter(s => s.featured);
  const featuredGear = INITIAL_EQUIPMENT.slice(0, 4);

  return (
    <div className="space-y-24 pb-24 overflow-hidden">
      {/* 1. HERO SECTION 3D ULTRA-MODERNE & LUXE */}
      <section className="relative pt-6 sm:pt-14 pb-12 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Glow ambient spots */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gold/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-neon-purple/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Bloc texte de gauche */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left relative z-10">
            {/* Badge Status Studio Live */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-gold/30 text-gold text-xs font-semibold shadow-lg shadow-gold/5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="tracking-wide uppercase font-bold text-[11px]">Studio Ouvert • Thiès, Sénégal</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.05]">
              Le Son Pur. <br />
              L'Image Cinéma. <br />
              <span className="gold-gradient-text">
                La Vérité Seven Truth.
              </span>
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Premier complexe média & label indépendant à Thiès : studio d'enregistrement cabine acoustique, plateau TV & podcast 4K, studio photo et parc de matériel cinéma (Sony FX3, Shure SM7B).
            </p>

            {/* Boutons d'Action Principaux */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/reserver"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-gold via-gold-light to-gold text-background font-display font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-gold/30 hover:shadow-gold/50 transition-all hover:scale-105 active:scale-95 group"
              >
                <Calendar className="w-4 h-4" />
                <span>Réserver en Ligne</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/espaces"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-card text-zinc-200 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 hover:border-gold/50 transition-all hover:bg-surface-hover"
              >
                <Disc className="w-4 h-4 text-gold" />
                <span>Explorer les Espaces</span>
              </Link>
            </div>

            {/* Badges de Confiance Locale */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Smartphone className="w-3.5 h-3.5 text-[#1dc3f5]" />
                Wave & Orange Money
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                Isolation acoustique certifiée
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Mic className="w-3.5 h-3.5 text-neon-purple" />
                Ingénieur son dédié inclus
              </span>
            </div>
          </div>

          {/* Rendu 3D Hero : Vinyle Haute Définition & Onde de particules */}
          <div className="lg:col-span-5 relative">
            <HeroCanvas />
          </div>
        </div>

        {/* COMPTEURS ANIMÉS EN BENTO-GRID */}
        <div className="mt-14 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 glass-card rounded-3xl border border-white/10 shadow-2xl">
          <div className="text-center p-3.5 space-y-1">
            <span className="block font-display font-black text-3xl sm:text-4xl text-gold">1 400+</span>
            <span className="text-xs text-zinc-400 font-medium">Heures de studio produites</span>
          </div>
          <div className="text-center p-3.5 space-y-1">
            <span className="block font-display font-black text-3xl sm:text-4xl text-white">45+</span>
            <span className="text-xs text-zinc-400 font-medium">Artistes & créateurs accompagnés</span>
          </div>
          <div className="text-center p-3.5 space-y-1">
            <span className="block font-display font-black text-3xl sm:text-4xl text-gold">100%</span>
            <span className="text-xs text-zinc-400 font-medium">Transparence & Audit Inviolable</span>
          </div>
          <div className="text-center p-3.5 space-y-1">
            <span className="block font-display font-black text-3xl sm:text-4xl text-white">4.9 / 5</span>
            <span className="text-xs text-zinc-400 font-medium">Avis vérifiés Thiès & Dakar</span>
          </div>
        </div>
      </section>

      {/* 2. NOS 3 ESPACES DE CRÉATION (BENTO LUXE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
              Infrastructures Haut de Gamme
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white mt-2">
              Trois Espaces Dédiés à la Performance
            </h2>
          </div>
          <Link href="/espaces" className="text-xs sm:text-sm text-gold hover:underline flex items-center gap-1 font-semibold">
            <span>Découvrir la fiche technique complète</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_SPACES.map((space) => (
            <div
              key={space.id}
              className="group glass-card rounded-3xl overflow-hidden flex flex-col justify-between border border-white/[0.08] hover:border-gold/50"
            >
              <div>
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={space.photos[0]}
                    alt={space.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-background/85 backdrop-blur-md text-gold border border-gold/30 shadow-lg">
                      {formatFCFA(space.hourly_rate)} / h
                    </span>
                  </div>

                  {space.noisy_allowed ? (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/25 backdrop-blur-md text-amber-300 border border-amber-500/40 flex items-center gap-1">
                        <Volume2 className="w-3 h-3" /> Sabar 10h–19h
                      </span>
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/25 backdrop-blur-md text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Insonorisé Pro
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-3.5">
                  <h3 className="font-display font-bold text-xl text-white group-hover:text-gold transition-colors">
                    {space.name}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {space.description}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-white/[0.06]">
                    <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block">
                      Équipements phares :
                    </span>
                    <ul className="text-xs text-zinc-400 space-y-1">
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

              <div className="p-6 pt-0">
                <Link
                  href={`/reserver?space=${space.id}`}
                  className="w-full py-3 rounded-xl bg-surface border border-surface-border group-hover:bg-gradient-to-r group-hover:from-gold group-hover:to-gold-light group-hover:text-background group-hover:border-gold font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
                >
                  <span>Réserver cet Espace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PACKS & FORMULES TOUT COMPRIS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
            Clés en Main
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
            Nos Packs & Formules Populaires
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Du single complet au podcast vidéo 4K et aux clips musicaux, chaque formule inclut un accompagnement technique dédié.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredServices.slice(0, 3).map((srv) => (
            <div
              key={srv.id}
              className="relative p-6 sm:p-7 rounded-3xl glass-card border border-white/10 hover:border-gold/60 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase text-gold bg-gold/10 px-2.5 py-1 rounded-lg border border-gold/30">
                    {srv.category}
                  </span>
                  <span className="font-display font-black text-2xl text-white group-hover:text-gold transition-colors">
                    {formatFCFA(srv.price)}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-white">{srv.name}</h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{srv.description}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface border border-surface-border space-y-1.5 text-xs text-zinc-300">
                  <div className="flex justify-between">
                    <span>Durée de séance :</span>
                    <strong>{srv.duration_hours} heure(s)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Acompte requis :</span>
                    <strong className="text-gold font-display">{srv.deposit_percentage}% via Wave ou OM</strong>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href={`/reserver?service=${srv.id}`}
                  className="w-full py-3 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-gold/20 transition-all active:scale-95"
                >
                  <span>Sélectionner cette formule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. EXPÉRIENCE SONORE INTERACTIVE (PORTFOLIO STREAMING) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
            Écoute Haute Fidélité
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
            Le Son Seven Truth en Écoute
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Morceaux enregistrés, arrangés et masterisés au studio par nos ingénieurs du son à Thiès.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <AudioPlayer tracks={featuredTracks} />
        </div>
      </section>

      {/* 5. LOCATION MATÉRIEL DE CINÉMA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
                Parc Matériel Partenaire
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-2">
                Louez du Matériel Cinéma à Thiès
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
                Matériel professionnel mis à disposition par le Patron. Contrôle au départ et au retour avec CNI et caution sécurisée.
              </p>
            </div>

            <Link
              href="/materiel"
              className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-gold/20 transition-all self-start sm:self-auto"
            >
              <span>Voir tout le catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredGear.map((item) => (
              <div key={item.id} className="bg-surface border border-surface-border rounded-2xl p-4 flex flex-col justify-between hover:border-gold/50 transition-colors">
                <div>
                  <div className="h-36 w-full rounded-xl overflow-hidden bg-surface-secondary mb-3 relative">
                    <img
                      src={item.photos[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-background/90 text-gold border border-gold/30">
                        {formatFCFA(item.daily_price)}/j
                      </span>
                    </div>
                  </div>
                  <h4 className="font-bold text-white text-sm leading-tight">{item.name}</h4>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{item.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Caution : {formatFCFA(item.deposit_required)}
                  </span>
                  <Link
                    href="/materiel"
                    className="px-2.5 py-1 rounded-lg bg-surface-secondary border border-surface-border text-gold font-bold text-xs hover:border-gold"
                  >
                    Réserver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ARTISTES DU LABEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
            La Famille Seven Truth
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
            Nos Artistes & Beatmakers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_ARTISTS.map((artist) => (
            <div key={artist.id} className="glass-card rounded-3xl p-6 text-center space-y-4 border border-white/10 hover:border-gold/40 transition-all">
              <div className="w-28 h-28 rounded-full overflow-hidden mx-auto border-2 border-gold shadow-xl relative">
                <img
                  src={artist.photo_url}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">{artist.name}</h3>
                <span className="text-xs text-gold font-semibold uppercase tracking-wider">{artist.genre}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">{artist.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. AVIS CLIENTS VÉRIFIÉS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
            Témoignages
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
            La Confiance de la Communauté
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {INITIAL_REVIEWS.map((rev) => (
            <div key={rev.id} className="p-5 glass-card rounded-2xl flex flex-col justify-between space-y-3 border border-white/10">
              <div className="space-y-2">
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-zinc-300 italic">"{rev.comment}"</p>
              </div>

              <div className="pt-3 border-t border-surface-border text-xs">
                <strong className="text-white block">{rev.client_name}</strong>
                <span className="text-gold text-[11px] block">{rev.service}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ COMPLÈTE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
            Questions Récurrentes
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Tout Savoir Avant de Réserver
          </h2>
        </div>

        <div className="space-y-3">
          <div className="p-4 glass-card rounded-2xl border border-white/10 space-y-1">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-gold flex-shrink-0" />
              Comment fonctionne l'acompte de 50 % ?
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed pl-6">
              L'acompte valide immédiatement votre séance sur le planning officiel. Le paiement s'effectue en un instant par Wave ou Orange Money Sénégal. Le solde restant est réglé sur place au studio.
            </p>
          </div>

          <div className="p-4 glass-card rounded-2xl border border-white/10 space-y-1">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-gold flex-shrink-0" />
              Pourquoi les sessions Sabar et Batterie sont-elles limitées à 10h–19h ?
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed pl-6">
              Bien que la cabine soit traitée en « pièce dans la pièce », les percussions traditionnelles (sabar, tama) et la batterie émettent des vibrations lourdes. Par respect pour le voisinage de l'immeuble à Thiès, ces créneaux sont strictement limités de 10h00 à 19h00 du lundi au samedi.
            </p>
          </div>

          <div className="p-4 glass-card rounded-2xl border border-white/10 space-y-1">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-gold flex-shrink-0" />
              Comment le Patron et les investisseurs vérifient-ils les comptes ?
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed pl-6">
              Le back-office est doté d'une transparence totale : le rôle Patron offre un accès en lecture seule à chaque écriture comptable, à la photo de chaque reçu de dépense, à l'inventaire physique des QR codes et au journal d'audit immuable.
            </p>
          </div>
        </div>
      </section>

      {/* 9. CONTACT & LOCALISATION THIÈS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-2xl">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
              Rendez-nous visite
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
              Studio Seven Truth Thiès
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Quartier Dixième, près de l'Avenue Aynina Fall, Thiès. À 5 minutes de la gare ferroviaire. Accueil convivial, ataya chaud et conditions de travail haut de gamme.
            </p>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                <span>Quartier Dixième, Thiès, Sénégal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                <span>+221 77 123 45 67 (WhatsApp Direct)</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3 flex-wrap">
              <a
                href="https://wa.me/221771234567?text=Bonjour%20Seven%20Truth,%20je%20souhaite%20réserver%20une%20session%20au%20studio"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <span>WhatsApp Studio</span>
              </a>
              <Link
                href="/reserver"
                className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs flex items-center gap-2 shadow-lg shadow-gold/20 active:scale-95 transition-all"
              >
                <span>Réserver en Ligne</span>
              </Link>
            </div>
          </div>

          <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden glass-card border border-white/10 flex items-center justify-center text-center p-6 relative">
            <div className="space-y-2 relative z-10">
              <div className="w-14 h-14 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mx-auto text-gold animate-bounce">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-white text-lg">Seven Truth Studio</h3>
              <p className="text-xs text-zinc-400">Thiès, Sénégal</p>
              <span className="text-[11px] font-mono text-gold bg-gold/15 px-3 py-1 rounded-full border border-gold/30 inline-block mt-2">
                Coordonnées GPS: 14.7910° N, 16.9359° W
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
