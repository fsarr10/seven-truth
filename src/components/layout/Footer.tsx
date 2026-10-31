import React from 'react';
import Link from 'next/link';
import { SevenTruthLogo } from '@/components/brand/SevenTruthLogo';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-surface-secondary border-t border-surface-border text-zinc-400 text-xs sm:text-sm">
      {/* Schema.org LocalBusiness JSON-LD pour SEO local */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Seven Truth Label & Media',
            image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
            '@id': 'https://seventruth.sn',
            url: 'https://seventruth.sn',
            telephone: '+221771234567',
            priceRange: '10000 - 150000 XOF',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Quartier Dixième, près Avenue Aynina Fall',
              addressLocality: 'Thiès',
              addressRegion: 'Thiès',
              postalCode: '21000',
              addressCountry: 'SN'
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 14.791,
              longitude: -16.9359
            },
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                opens: '09:00',
                closes: '22:00'
              }
            ],
            sameAs: [
              'https://instagram.com/seventruth',
              'https://tiktok.com/@seventruth'
            ]
          })
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 : Identité */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <SevenTruthLogo variant="full" size="md" />
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Label musical, studio d'enregistrement insonorisé, plateau TV & podcast et parc de location audiovisuel professionnel à Thiès, Sénégal.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-zinc-500">Paiements acceptés :</span>
              <span className="px-2 py-0.5 rounded bg-[#1dc3f5]/20 text-[#1dc3f5] font-bold text-[10px]">
                Wave
              </span>
              <span className="px-2 py-0.5 rounded bg-[#ff7900]/20 text-[#ff7900] font-bold text-[10px]">
                Orange Money
              </span>
            </div>
          </div>

          {/* Col 2 : Espaces & Services */}
          <div className="space-y-2.5">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">
              Nos Espaces & Formules
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/espaces" className="hover:text-gold transition-colors">
                  Studio Son Insonorisé (Rec, Mix, Master)
                </Link>
              </li>
              <li>
                <Link href="/espaces" className="hover:text-gold transition-colors">
                  Plateau TV & Podcast Multi-Caméras
                </Link>
              </li>
              <li>
                <Link href="/espaces" className="hover:text-gold transition-colors">
                  Salle Shooting Photo & Cyclo
                </Link>
              </li>
              <li>
                <Link href="/formules" className="hover:text-gold transition-colors">
                  Packs Single Clé en Main & Podcasts
                </Link>
              </li>
              <li>
                <Link href="/materiel" className="hover:text-gold transition-colors">
                  Location Caméras (Sony FX3, A7IV) & Lumières
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 : Accès & Localisation */}
          <div className="space-y-2.5">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">
              Localisation & Horaires
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Quartier Dixième, près Avenue Aynina Fall, Thiès, Sénégal</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Lundi – Samedi : 09h00 – 22h00</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>+221 77 123 45 67 (WhatsApp disponible)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>contact@seventruth.sn</span>
              </li>
            </ul>
          </div>

          {/* Col 4 : Transparence & Back-office */}
          <div className="space-y-2.5">
            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">
              Administration & Éthique
            </h4>
            <p className="text-xs text-zinc-400">
              Plateforme transparente : inventaire mensuel numérisé par QR code, caisse de charges fixes et journal d'audit en ajout seulement.
            </p>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-surface-border hover:border-gold rounded-xl text-gold text-xs font-semibold transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Accès Espace Gestion Privé</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bas de page */}
        <div className="mt-12 pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Seven Truth Label & Media. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Conçu avec passion pour la culture thiessoise
          </p>
        </div>
      </div>
    </footer>
  );
}
