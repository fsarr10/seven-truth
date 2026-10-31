'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';
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
    <div className="w-full bg-surface-secondary border border-surface-border rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Halo discret */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <audio
        ref={audioRef}
        src={currentTrack.media_url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Vignette vinyle animée */}
        <div
          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gold/40 shadow-lg flex-shrink-0 ${
            isPlaying ? 'animate-spin' : ''
          }`}
          style={{ animationDuration: '8s' }}
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
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-background border border-gold" />
          </div>
        </div>

        {/* Détails du morceau */}
        <div className="flex-1 w-full text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-gold/20 text-gold border border-gold/30">
              En écoute
            </span>
            <span className="text-xs text-zinc-400">Thiès Sound</span>
          </div>
          <h4 className="text-lg font-bold text-white tracking-tight">{currentTrack.title}</h4>
          <p className="text-sm text-zinc-400">{currentTrack.artist}</p>

          {/* Barre de progression */}
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-400 w-10 text-right">
              {formatSeconds(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 bg-surface rounded-lg appearance-none cursor-pointer accent-gold"
            />
            <span className="text-xs font-mono text-zinc-400 w-10">
              {formatSeconds(duration || 180)}
            </span>
          </div>
        </div>

        {/* Boutons de contrôle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-full bg-surface hover:bg-surface-border text-zinc-300 transition-colors"
            title="Précédent"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={togglePlay}
            className="p-3.5 rounded-full bg-gold hover:bg-gold-light text-background font-bold shadow-lg shadow-gold/20 transition-transform active:scale-95"
            title={isPlaying ? 'Pause' : 'Lecture'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
          <button
            onClick={handleNext}
            className="p-2.5 rounded-full bg-surface hover:bg-surface-border text-zinc-300 transition-colors"
            title="Suivant"
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
            className="p-2.5 rounded-full bg-surface hover:bg-surface-border text-zinc-400 transition-colors hidden sm:inline-flex"
            title={isMuted ? 'Rétablir le son' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
