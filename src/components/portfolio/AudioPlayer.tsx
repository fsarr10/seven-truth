'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Share2, Sparkles } from 'lucide-react';
import { PortfolioItem } from '@/lib/types';

interface AudioPlayerProps {
  tracks: PortfolioItem[];
}

export function AudioPlayer({ tracks }: AudioPlayerProps) {
  const audioTracks = tracks.filter((t) => t.category === 'audio');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = audioTracks[currentIndex] || audioTracks[0];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % audioTracks.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + audioTracks.length) % audioTracks.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '0:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="w-full glass-card rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden border border-white/10">
      {/* Halo lumineux d'ambiance */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-neon-purple/10 rounded-full blur-2xl pointer-events-none" />

      <audio
        ref={audioRef}
        src={currentTrack.media_url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-7 relative z-10">
        {/* Disque vinyle rotatif avec pochette */}
        <div className="relative flex-shrink-0 group cursor-pointer" onClick={togglePlay}>
          <div
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-gold/40 shadow-2xl relative ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '6s' }}
          >
            {currentTrack.thumbnail_url ? (
              <img
                src={currentTrack.thumbnail_url}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-surface flex items-center justify-center text-gold">
                <Music className="w-8 h-8" />
              </div>
            )}
            {/* Trou central vinyle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-background border-2 border-gold/60 shadow-inner flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
              </div>
            </div>
          </div>

          {/* Bouton play flottant au survol */}
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {isPlaying ? (
              <Pause className="w-8 h-8 text-gold fill-current" />
            ) : (
              <Play className="w-8 h-8 text-gold fill-current ml-1" />
            )}
          </div>
        </div>

        {/* Détails du morceau & lecteur */}
        <div className="flex-1 w-full text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
              Master 24-bit / 96kHz
            </span>

            {/* Égaliseur animé live si lecture en cours */}
            {isPlaying && (
              <div className="flex items-end gap-1 h-3.5 px-2 py-0.5 rounded bg-surface border border-surface-border">
                <span className="w-0.5 bg-gold rounded-full animate-equalizer1" />
                <span className="w-0.5 bg-gold rounded-full animate-equalizer2" />
                <span className="w-0.5 bg-gold rounded-full animate-equalizer3" />
                <span className="w-0.5 bg-gold rounded-full animate-equalizer4" />
              </div>
            )}
          </div>

          <div>
            <h4 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight">
              {currentTrack.title}
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 font-medium">{currentTrack.artist}</p>
          </div>

          {/* Barre d'onde et de progression */}
          <div className="pt-2 flex items-center gap-3">
            <span className="text-[11px] font-mono text-zinc-400 w-10 text-right">
              {formatSeconds(currentTime)}
            </span>
            <div className="flex-1 relative flex items-center">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-gold relative z-10"
              />
            </div>
            <span className="text-[11px] font-mono text-zinc-400 w-10">
              {formatSeconds(duration || 180)}
            </span>
          </div>
        </div>

        {/* Contrôles de lecture */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full bg-surface border border-surface-border hover:border-gold/40 text-zinc-300 hover:text-white transition-all active:scale-95"
            title="Morceau précédent"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-gradient-to-tr from-gold-dark via-gold to-gold-light text-background font-bold shadow-lg shadow-gold/30 hover:scale-105 transition-all active:scale-95"
            title={isPlaying ? 'Pause' : 'Lecture'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-surface border border-surface-border hover:border-gold/40 text-zinc-300 hover:text-white transition-all active:scale-95"
            title="Morceau suivant"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.muted = !isMuted;
                setIsMuted(!isMuted);
              }
            }}
            className="p-3 rounded-full bg-surface border border-surface-border hover:border-gold/40 text-zinc-400 hover:text-white transition-colors hidden md:inline-flex"
            title={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
