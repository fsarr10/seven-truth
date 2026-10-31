import React from 'react';
import { AudioPlayer } from '@/components/portfolio/AudioPlayer';
import { INITIAL_PORTFOLIO } from '@/lib/store/initialData';
import { Disc, Play, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function PortfolioPage() {
  const audioTracks = INITIAL_PORTFOLIO.filter(p => p.category === 'audio');
  const videoItems = INITIAL_PORTFOLIO.filter(p => p.category === 'video');
  const photoItems = INITIAL_PORTFOLIO.filter(p => p.category === 'photo');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
          Créations & Réalisations
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
          Le Portfolio Seven Truth
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Découvrez la qualité sonore et visuelle de nos projets musicaux, podcasts et shootings réalisés à Thiès.
        </p>
      </div>

      {/* 1. LECTEUR AUDIO */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-surface-border pb-3">
          <Disc className="w-5 h-5 text-gold" />
          <h2 className="font-display font-bold text-xl text-white">
            Productions Sonores & Singles
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <AudioPlayer tracks={audioTracks} />
        </div>
      </section>

      {/* 2. VIDÉOS & PODCASTS */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-surface-border pb-3">
          <Play className="w-5 h-5 text-gold" />
          <h2 className="font-display font-bold text-xl text-white">
            Émissions TV & Podcasts Tournés au Plateau
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videoItems.map(item => (
            <div key={item.id} className="bg-surface-secondary border border-surface-border rounded-2xl overflow-hidden space-y-3">
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={item.media_url}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white text-base">{item.title}</h3>
                <p className="text-xs text-zinc-400 mt-1">{item.artist} • {item.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. GALERIE PHOTOS */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-surface-border pb-3">
          <ImageIcon className="w-5 h-5 text-gold" />
          <h2 className="font-display font-bold text-xl text-white">
            Shootings Photos en Studio
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-64 rounded-2xl overflow-hidden bg-surface-secondary border border-surface-border">
            <img
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80"
              alt="Shooting Mode"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="h-64 rounded-2xl overflow-hidden bg-surface-secondary border border-surface-border">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
              alt="Portrait Artiste"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="h-64 rounded-2xl overflow-hidden bg-surface-secondary border border-surface-border">
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
              alt="Shooting Pochette Album"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="h-64 rounded-2xl overflow-hidden bg-surface-secondary border border-surface-border">
            <img
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80"
              alt="Session Studio"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
