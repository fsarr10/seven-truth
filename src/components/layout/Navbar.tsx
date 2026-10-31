'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Music, Calendar, Camera, Disc, Sparkles,
  Shield, User, ArrowRight, Radio
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/espaces', label: 'Espaces' },
    { href: '/formules', label: 'Formules' },
    { href: '/materiel', label: 'Location' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/artistes', label: 'Artistes' },
    { href: '/formations', label: 'Formations' },
    { href: '/a-propos', label: 'À Propos' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-[37px] z-40 px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-4 sm:px-6 h-16 flex items-center justify-between shadow-2xl border border-white/[0.08]">
        {/* Logo Seven Truth 7T */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-dark via-gold to-gold-light p-0.5 shadow-lg shadow-gold/25 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
              <span className="font-display font-black text-lg text-gold group-hover:tracking-wider transition-all">
                7T
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background animate-pulse" title="Studio ouvert" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-white text-base tracking-tight leading-none group-hover:text-gold transition-colors">
              SEVEN TRUTH
            </span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold flex items-center gap-1 mt-0.5">
              <span>Label & Media</span>
              <span className="text-gold">•</span>
              <span className="text-gold font-bold">Thiès</span>
            </span>
          </div>
        </Link>

        {/* Liens Desktop */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold uppercase tracking-wider">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-all py-1.5 px-2.5 rounded-lg relative ${
                  isActive
                    ? 'text-gold bg-gold/10 font-bold'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions Droite */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Link
            href="/admin"
            className="px-3.5 py-2 rounded-xl bg-surface border border-surface-border hover:border-gold/50 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all hover:bg-surface-hover"
          >
            <Shield className="w-3.5 h-3.5 text-gold" />
            <span>Gestion</span>
          </Link>

          <Link
            href="/reserver"
            className="relative group px-4 py-2 rounded-xl bg-gradient-to-r from-gold via-gold-light to-gold text-background font-display font-bold text-xs shadow-lg shadow-gold/25 hover:shadow-gold/40 transition-all active:scale-95 flex items-center gap-1.5 overflow-hidden"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Réserver Séance</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Bouton Mobile Hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/reserver"
            className="sm:hidden px-3 py-1.5 rounded-lg bg-gold text-background font-bold text-xs"
          >
            Réserver
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-surface border border-surface-border text-zinc-300 hover:text-white"
            aria-label="Ouvrir le menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menu Déroulant Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 glass-panel rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 border border-white/10 shadow-2xl">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/[0.08]">
            <Link
              href="/reserver"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 bg-gold text-background font-bold text-xs rounded-xl text-center shadow-lg shadow-gold/15"
            >
              Réserver en ligne
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

          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                  pathname === link.href ? 'bg-gold/15 text-gold font-bold' : 'text-zinc-300 hover:bg-surface'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/espace-client"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:bg-surface flex items-center justify-between"
            >
              <span>Espace Client (Reçus)</span>
              <User className="w-4 h-4 text-gold" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
