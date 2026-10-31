'use client';

import React, { Suspense, useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Hero3DFallback } from './Hero3DFallback';

const DynamicCanvas = dynamic(
  () =>
    import('@react-three/fiber').then((mod) => {
      const { Canvas } = mod;
      return function CanvasWrapper(props: any) {
        return <Canvas {...props} />;
      };
    }),
  { ssr: false, loading: () => <Hero3DFallback /> }
);

import { Vinyl3D } from './Vinyl3D';

export function HeroCanvas() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Vérification du respect de prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    // Détection mobile (largeur < 768px ou CPU limité)
    setIsMobile(window.innerWidth < 768);

    // Arrêt du rendu Three.js hors écran (Intersection Observer pour autonomie batterie & CPU)
    if (containerRef.current && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setIsVisible(entry.isIntersecting);
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
      return () => {
        mediaQuery.removeEventListener('change', handler);
        observer.disconnect();
      };
    }

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Si l'utilisateur demande moins de mouvement, afficher le rendu statique haute performance
  if (prefersReducedMotion) {
    return <Hero3DFallback />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[360px] sm:h-[440px] md:h-[500px] flex items-center justify-center overflow-hidden"
    >
      {/* Halo d'ambiance */}
      <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-gold/15 blur-3xl pointer-events-none" />

      {isVisible ? (
        <Suspense fallback={<Hero3DFallback />}>
          <DynamicCanvas
            camera={{ position: [0, 1.8, 4.5], fov: 45 }}
            dpr={[1, 1.5]} // Plafonné à 1.5 pour fluidité sur téléphones Android d'entrée de gamme
            gl={{ antialias: false, powerPreference: 'low-power' }}
            frameloop="always"
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 6, 4]} intensity={1.5} color="#ffd875" />
            <pointLight position={[-4, 2, -2]} intensity={1.2} color="#9d4edd" />
            <Vinyl3D isMobile={isMobile} />
          </DynamicCanvas>
        </Suspense>
      ) : (
        <Hero3DFallback />
      )}
    </div>
  );
}
