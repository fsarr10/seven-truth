'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Music, Calendar, Camera, Disc, Sparkles,
  Shield, User, ArrowRight
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/espaces', label: 'Nos Espaces' },
    { href: '/formules', label: 'Formules & Packs' },
    { href: '/materiel', label: 'Location Matériel' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/artistes', label: 'Artistes' },
    { href: '/formations', label: 'Formations' },
    { href: '/a-propos', label: 'À Propos' },
    { href: '/contact', label: 'Contact' },
  ];

  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="sticky top-[37px] z-40 bg-background/90 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo Seven Truth avec typographie premium */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-dark via-gold to-gold-light p-0.5 shadow-lg shadow-gold/20 flex items-center justify-center">
            <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
              <span className="font-display font-black text-lg text-gold group-hover:scale-110 transition-transform">
                7T
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-white text-base tracking-tight leading-none">
              SEVEN TRUTH
            </span>
            <span className="text-[10px] uppercase tracking-widest text-gold font-semibold">
              Label & Media • Thiès
            </span>
          </div>
        </Link>

        {/* Liens Desktop */}
        <nav className="hidden lg:flex items-center gap-6 text-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-medium ${
                  isActive ? 'text-gold font-bold' : 'text-zinc-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Boutons d'action */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/admin"
            className="px-3 py-1.5 rounded-xl bg-surface border border-surface-border hover:border-gold text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-gold" />
            <span>Gestion</span>
          </Link>

          <Link
            href="/reserver"
            className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-gold/15 transition-all active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>Réserver en ligne</span>
          </Link>
        </div>

        {/* Bouton Menu Mobile */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/reserver"
            className="px-3 py-1.5 rounded-lg bg-gold text-background font-bold text-xs"
          >
            Réserver
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-surface text-zinc-300 hover:text-white"
            aria-label="Ouvrir le menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Tiroir Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-secondary border-b border-surface-border px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-surface-border">
            <Link
              href="/reserver"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 bg-gold text-background font-bold text-xs rounded-xl text-center shadow-lg shadow-gold/10"
            >
              Réserver une séance
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 bg-surface border border-surface-border text-gold font-bold text-xs rounded-xl text-center flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Back-office</span>
            </Link>
          </div>

          <nav className="flex flex-col space-y-1 pt-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  pathname === link.href ? 'bg-gold/15 text-gold font-bold' : 'text-zinc-300 hover:bg-surface'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/espace-client"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:bg-surface flex items-center justify-between"
            >
              <span>Mon Espace Client</span>
              <User className="w-4 h-4 text-zinc-500" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
