import React from 'react';
import Link from 'next/link';
import { HeroCanvas } from '@/components/3d/HeroCanvas';
import { AudioPlayer } from '@/components/portfolio/AudioPlayer';
import { INITIAL_PORTFOLIO, INITIAL_SPACES, INITIAL_SERVICES, INITIAL_EQUIPMENT, INITIAL_ARTISTS, INITIAL_REVIEWS } from '@/lib/store/initialData';
import { formatFCFA } from '@/lib/utils/currency';
import {
  Calendar, Mic, Tv, Camera, ArrowRight, ShieldCheck,
  Smartphone, Volume2, Sparkles, CheckCircle2, ChevronRight,
  Headphones, Star, MapPin, Phone, HelpCircle
} from 'lucide-react';

export default function HomePage() {
  const featuredTracks = INITIAL_PORTFOLIO.filter(p => p.category === 'audio');
  const featuredServices = INITIAL_SERVICES.filter(s => s.featured);
  const featuredGear = INITIAL_EQUIPMENT.slice(0, 4);

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. HERO SECTION 3D PREMIUM */}
      <section className="relative pt-6 sm:pt-12 pb-12 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Lueur de fond */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Texte de gauche */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-gold/30 text-gold text-xs font-semibold shadow-lg shadow-gold/5">
              <Sparkles className="w-3.5 h-3.5 text-gold animate-spin" style={{ animationDuration: '6s' }} />
              <span>Studio de création sonore & audiovisuelle à Thiès</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
              Là où la vérité <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-amber-500">
                devient légende.
              </span>
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Enregistrement studio insonorisé, plateau TV & podcast multi-caméras 4K, shooting photo pro et location de matériel de pointe au cœur de Thiès.
            </p>

            {/* Boutons d'appel à l'action */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/reserver"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gold hover:bg-gold-light text-background font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-gold/20 transition-all hover:scale-105 active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Réserver une séance</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/espaces"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-surface border border-surface-border hover:border-gold text-zinc-200 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors"
              >
                <span>Découvrir nos espaces</span>
              </Link>
            </div>

            {/* Avantages clés */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                Acompte 50% via Wave & OM
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                Pièce insonorisée & traitée
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                Ingénieur son inclus
              </span>
            </div>
          </div>

          {/* Rendu 3D interactif (Vinyle / Ondes de particules) */}
          <div className="lg:col-span-5 relative">
            <HeroCanvas />
          </div>
        </div>

        {/* Compteurs animés / Métriques */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 bg-surface-secondary/80 backdrop-blur-md border border-surface-border rounded-2xl">
          <div className="text-center p-3">
            <span className="block font-display font-black text-2xl sm:text-4xl text-gold">1 400+</span>
            <span className="text-xs text-zinc-400 font-medium">Heures de studio enregistrées</span>
          </div>
          <div className="text-center p-3">
            <span className="block font-display font-black text-2xl sm:text-4xl text-white">45+</span>
            <span className="text-xs text-zinc-400 font-medium">Artistes & créateurs accompagnés</span>
          </div>
          <div className="text-center p-3">
            <span className="block font-display font-black text-2xl sm:text-4xl text-gold">100%</span>
            <span className="text-xs text-zinc-400 font-medium">Transparence & matériel certifié</span>
          </div>
          <div className="text-center p-3">
            <span className="block font-display font-black text-2xl sm:text-4xl text-white">4.9 / 5</span>
            <span className="text-xs text-zinc-400 font-medium">Satisfaction clients Thiès & Dakar</span>
          </div>
        </div>
      </section>

      {/* 2. NOS ESPACES DE CRÉATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
            Infrastructures professionnelles
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-white">
            Trois espaces conçus pour l'excellence
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Installé dans un appartement dédié à Thiès, chaque espace a été acoustiquement isolé et optimisé pour vos projets audio et vidéo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_SPACES.map((space) => (
            <div
              key={space.id}
              className="group bg-surface-secondary border border-surface-border rounded-2xl overflow-hidden hover:border-gold/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={space.photos[0]}
                    alt={space.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-background/80 backdrop-blur-md text-gold border border-gold/30">
                      {formatFCFA(space.hourly_rate)} / heure
                    </span>
                  </div>
                  {space.noisy_allowed && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Volume2 className="w-3 h-3" /> Sabar 10h–19h
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-gold transition-colors">
                    {space.name}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {space.description}
                  </p>

                  <div className="space-y-1 pt-2 border-t border-surface-border">
                    <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block">
                      Équipements inclus :
                    </span>
                    <ul className="text-xs text-zinc-400 space-y-0.5">
                      {space.equipment_included.slice(0, 3).map((eq, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-gold" />
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
                  className="w-full py-2.5 rounded-xl bg-surface border border-surface-border group-hover:bg-gold group-hover:text-background group-hover:border-gold font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <span>Réserver cet espace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FORMULES ET PACKS CLÉ EN MAIN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
              Grille tarifaire claire
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-4xl text-white mt-2">
              Formules & Packs Tout Compris
            </h2>
          </div>
          <Link href="/formules" className="text-xs sm:text-sm text-gold hover:underline flex items-center gap-1 font-semibold">
            <span>Voir toute la grille de prix</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredServices.slice(0, 3).map((service) => (
            <div
              key={service.id}
              className="relative p-6 rounded-2xl bg-surface-secondary border border-surface-border hover:border-gold/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase text-zinc-400 bg-surface px-2.5 py-1 rounded-lg border border-surface-border">
                    {service.category}
                  </span>
                  <span className="font-display font-black text-xl sm:text-2xl text-gold">
                    {formatFCFA(service.price)}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-white">{service.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{service.description}</p>

                <div className="pt-2 text-xs text-zinc-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Durée prévue :</span>
                    <strong>{service.duration_hours}h de studio</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Acompte requis :</span>
                    <strong className="text-gold font-display">{service.deposit_percentage}% à la réservation</strong>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href={`/reserver?service=${service.id}`}
                  className="w-full py-2.5 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-gold/10 transition-all active:scale-95"
                >
                  <span>Réserver ce pack</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. LOCATION DE MATÉRIEL CINÉMA & AUDIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-10 bg-surface-secondary border border-surface-border rounded-3xl space-y-8 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
                Parc audiovisuel professionnel
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-2">
                Louez du matériel cinéma à Thiès
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
                Boîtiers plein format, optiques G-Master, stabilisateurs LiDAR, micros sans fil et drones 4K. Caution consignée et contrat formel.
              </p>
            </div>

            <Link
              href="/materiel"
              className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-gold/15 transition-all self-start sm:self-auto"
            >
              <span>Catalogue complet</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredGear.map((item) => (
              <div key={item.id} className="bg-surface border border-surface-border rounded-xl p-4 flex flex-col justify-between hover:border-gold/40 transition-colors">
                <div>
                  <div className="h-32 w-full rounded-lg overflow-hidden bg-surface-secondary mb-3">
                    <img
                      src={item.photos[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-white text-sm leading-tight">{item.name}</h4>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{item.description}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-surface-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Tarif jour</span>
                    <strong className="text-gold font-display text-sm">{formatFCFA(item.daily_price)}</strong>
                  </div>
                  <Link
                    href={`/materiel`}
                    className="px-2.5 py-1 rounded-lg bg-surface-secondary border border-surface-border text-zinc-300 hover:text-white text-xs font-semibold"
                  >
                    Réserver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PORTFOLIO AUDIO INTERACTIF */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
            Nos productions studio
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-white">
            Écoutez le son Seven Truth
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto">
            Morceaux enregistrés, mixés et masterisés dans notre cabine acoustique à Thiès.
          </p>
        </div>

        {/* Lecteur Audio Intégré */}
        <div className="max-w-3xl mx-auto">
          <AudioPlayer tracks={featuredTracks} />
        </div>
      </section>

      {/* 6. ARTISTES DU LABEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
            La Famille Seven Truth
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-white">
            Artistes & Beatmakers Résidents
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_ARTISTS.map((artist) => (
            <div key={artist.id} className="bg-surface-secondary border border-surface-border rounded-2xl p-5 space-y-4 text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-gold shadow-lg">
                <img
                  src={artist.photo_url}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">{artist.name}</h3>
                <span className="text-xs text-gold font-semibold block">{artist.genre}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{artist.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. AVIS CLIENTS VÉRIFIÉS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
            Témoignages authentiques
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-white">
            Ce que disent nos artistes & clients
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {INITIAL_REVIEWS.map((rev) => (
            <div key={rev.id} className="p-5 bg-surface-secondary border border-surface-border rounded-2xl flex flex-col justify-between space-y-3">
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
          <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
            Questions fréquentes
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Tout savoir avant de réserver
          </h2>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-surface-secondary border border-surface-border rounded-xl space-y-1">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-gold flex-shrink-0" />
              Comment fonctionne l'acompte de 50 % ?
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed pl-6">
              L'acompte de 50 % valide immédiatement votre créneau dans le planning studio. Vous pouvez le régler en quelques secondes par Wave ou Orange Money. Le solde est versé le jour de votre séance en studio.
            </p>
          </div>

          <div className="p-4 bg-surface-secondary border border-surface-border rounded-xl space-y-1">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-gold flex-shrink-0" />
              Quelles sont les conditions pour les sessions de Batterie et Sabar ?
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed pl-6">
              Pour préserver l'entente avec les voisins de l'immeuble, les percussions acoustiques (tam-tam, sabar, batterie) sont autorisées exclusivement de 10h00 à 19h00 du lundi au samedi. La réservation en ligne verrouille automatiquement les autres créneaux.
            </p>
          </div>

          <div className="p-4 bg-surface-secondary border border-surface-border rounded-xl space-y-1">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-gold flex-shrink-0" />
              Que faut-il fournir pour la location de matériel ?
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed pl-6">
              Une pièce d'identité valide (CNI sénégalaise ou Passeport) ainsi que le versement de la caution requise. Un état des lieux rigoureux avec photos est établi au départ et au retour.
            </p>
          </div>

          <div className="p-4 bg-surface-secondary border border-surface-border rounded-xl space-y-1">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-gold flex-shrink-0" />
              Quelle est la politique d'annulation ?
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed pl-6">
              Remboursement intégral de l'acompte garanti si vous annulez plus de 48 heures avant l'heure de début. Moins de 48h avant, l'acompte est conservé pour dédommager le blocage du studio.
            </p>
          </div>
        </div>
      </section>

      {/* 9. CONTACT ET LOCALISATION À THIÈS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-tr from-surface-secondary to-surface border border-surface-border rounded-3xl p-6 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-2xl">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
              Venez nous rendre visite
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
              Seven Truth Studio Thiès
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Situé au Quartier Dixième près de l'Avenue Aynina Fall, à 5 minutes du centre-ville de Thiès. Parking sécurisé, climatisation intégrale et espace chill ataya.
            </p>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                <span>Quartier Dixième, Thiès, Sénégal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                <span>+221 77 123 45 67 (Appels & WhatsApp)</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3 flex-wrap">
              <a
                href="https://wa.me/221771234567?text=Bonjour%20Seven%20Truth,%20je%20souhaite%20des%20renseignements%20sur%20le%20studio"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center gap-2 shadow-lg"
              >
                <span>Écrire sur WhatsApp</span>
              </a>
              <Link
                href="/reserver"
                className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs flex items-center gap-2 shadow-lg shadow-gold/10"
              >
                <span>Réserver en ligne</span>
              </Link>
            </div>
          </div>

          {/* Carte stylisée interactive */}
          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-surface-border bg-surface flex items-center justify-center">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#e8b23a_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="text-center p-6 space-y-2 relative z-10">
              <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold flex items-center justify-center mx-auto text-gold animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">Studio Seven Truth</h4>
              <p className="text-xs text-zinc-400">Thiès, Région de Thiès, Sénégal</p>
              <span className="text-[11px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/30 block mt-2">
                Coordonnées GPS: 14.7910° N, 16.9359° W
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
