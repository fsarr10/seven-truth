'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Disc, Camera, Calendar, Shield } from 'lucide-react';

export function BottomMobileNav() {
  const pathname = usePathname();

  const items = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/espaces', label: 'Espaces', icon: Disc },
    { href: '/reserver', label: 'Réserver', icon: Calendar, highlight: true },
    { href: '/materiel', label: 'Matériel', icon: Camera },
    { href: '/admin', label: 'Gestion', icon: Shield },
  ];

  return (
    <nav className="sm:hidden fixed bottom-3 left-3 right-3 z-50 glass-panel rounded-2xl px-2 py-1.5 shadow-2xl border border-white/10 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        if (item.highlight) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative -top-3 flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gold-dark via-gold to-gold-light text-background flex items-center justify-center shadow-lg shadow-gold/30 active:scale-95 transition-transform">
                <Icon className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-bold text-gold mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              isActive ? 'text-gold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
            <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
