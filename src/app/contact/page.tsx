import React from 'react';
import { MapPin, Phone, Mail, Clock, Share2, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
          Contact & Accès
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
          Nous Joindre à Thiès
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Notre équipe est à votre écoute pour préparer votre séance d'enregistrement, votre émission ou la location de votre kit caméra.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Coordonnées & Boutons directs */}
        <div className="bg-surface-secondary border border-surface-border rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-display font-bold text-xl text-white">
            Coordonnées Officielles
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-zinc-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Adresse du studio :</strong>
                <span>Quartier Dixième, près de l'Avenue Aynina Fall, Thiès, Sénégal</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Téléphone & WhatsApp :</strong>
                <span className="font-mono">+221 77 123 45 67</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Email professionnel :</strong>
                <span>contact@seventruth.sn</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Horaires d'ouverture :</strong>
                <span>Lundi au Samedi : 09h00 – 22h00</span>
                <span className="block text-[11px] text-zinc-500 mt-0.5">
                  (Batterie et Sabar autorisés de 10h00 à 19h00 uniquement)
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/221771234567?text=Bonjour%20Seven%20Truth,%20je%20souhaite%20réserver%20une%20séance%20au%20studio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <Share2 className="w-4 h-4" />
              <span>Discussion WhatsApp</span>
            </a>
            <Link
              href="/reserver"
              className="flex-1 py-3 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-gold/15"
            >
              <Calendar className="w-4 h-4" />
              <span>Réservation en ligne</span>
            </Link>
          </div>
        </div>

        {/* Plan / Localisation stylisée */}
        <div className="bg-surface-secondary border border-surface-border rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="font-display font-bold text-xl text-white">
            Plan d'accès
          </h2>
          <div className="h-64 sm:h-72 rounded-2xl bg-surface border border-surface-border relative overflow-hidden flex items-center justify-center text-center p-6">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#e8b23a_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 space-y-2">
              <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold flex items-center justify-center mx-auto text-gold animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Studio Seven Truth</h3>
              <p className="text-xs text-zinc-400">Thiès, Sénégal</p>
              <span className="text-[11px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/30 inline-block">
                14.7910° N, 16.9359° W
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
