'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc, Radio, Sliders } from 'lucide-react';
import { PortfolioItem } from '@/lib/types';

interface AudioPlayerProps {
  tracks: PortfolioItem[];
}

/**
 * Lecteur Audio Studio Master (Inspiré des consoles analogiques et racks d'écoute pro)
 * Authentique, physique, tactile, sans artifices IA ni halos néons.
 */
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
    <div className="w-full bg-[#101116] border border-[#262833] rounded-2xl p-5 sm:p-6 shadow-2xl relative">
      {/* 4 Vis de rack de studio aux 4 coins */}
      <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full border border-zinc-600 bg-zinc-800 flex items-center justify-center">
        <div className="w-1 h-0.5 bg-zinc-500 rotate-45" />
      </div>
      <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full border border-zinc-600 bg-zinc-800 flex items-center justify-center">
        <div className="w-1 h-0.5 bg-zinc-500 rotate-12" />
      </div>
      <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full border border-zinc-600 bg-zinc-800 flex items-center justify-center">
        <div className="w-1 h-0.5 bg-zinc-500 -rotate-45" />
      </div>
      <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full border border-zinc-600 bg-zinc-800 flex items-center justify-center">
        <div className="w-1 h-0.5 bg-zinc-500 rotate-90" />
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.media_url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleNext}
      />

      {/* Barre supérieure d'étalonnage audio */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4 text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-zinc-400 uppercase tracking-widest font-semibold">
            SEVEN TRUTH · MONITORING MASTER 01
          </span>
        </div>
        <div className="flex items-center gap-3 text-zinc-500">
          <span className="text-gold font-bold">24-BIT / 48kHz</span>
          <span className="hidden sm:inline">OUTPUT: XLR BALANCED</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
        {/* Pochette vinyle avec bague laiton */}
        <div
          className="relative flex-shrink-0 cursor-pointer group"
          onClick={togglePlay}
          title={isPlaying ? 'Pause' : 'Lecture'}
        >
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gold/60 shadow-lg relative bg-black ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '4.5s' }}
          >
            {currentTrack.thumbnail_url ? (
              <img
                src={currentTrack.thumbnail_url}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#181a22] flex items-center justify-center text-gold">
                <Disc className="w-8 h-8" />
              </div>
            )}
            {/* Centre vinyle trou laiton */}
            <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-[#0a0a0c] border border-gold" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            {isPlaying ? (
              <Pause className="w-6 h-6 text-gold fill-current" />
            ) : (
              <Play className="w-6 h-6 text-gold fill-current ml-0.5" />
            )}
          </div>
        </div>

        {/* Détails du morceau & Fiche technique */}
        <div className="flex-1 w-full space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <span className="text-[10px] font-mono text-gold uppercase tracking-wider block">
                Session Studio #{currentIndex + 1}
              </span>
              <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
                {currentTrack.title}
              </h3>
              <p className="text-xs text-zinc-400">
                {currentTrack.artist || 'Artiste Seven Truth'} · {currentTrack.duration || 'Session Studio'}
              </p>
            </div>

            {/* VU-mètre numérique à segments */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a0b0e] border border-zinc-800 self-start sm:self-auto">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">VU</span>
              <div className="flex items-end gap-0.5 h-4">
                {[40, 70, 95, 60, 85, 100, 50, 75].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-sm transition-all duration-150 ${
                      !isPlaying
                        ? 'h-1 bg-zinc-800'
                        : i >= 6
                        ? 'bg-red-500'
                        : i >= 4
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(4, (h * (i + 1) * 11) % 16)}px` : '4px',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Curseur temporel de la bande */}
          <div className="space-y-1">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-gold"
            />
            <div className="flex justify-between text-[11px] font-mono text-zinc-500">
              <span>{formatSeconds(currentTime)}</span>
              <span>{formatSeconds(duration)}</span>
            </div>
          </div>

          {/* Boutons de commande analogiques */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-lg bg-[#181a24] hover:bg-[#202330] border border-zinc-700/60 text-zinc-300 flex items-center justify-center transition-colors active:scale-95"
                title="Piste précédente"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="px-4 h-9 rounded-lg bg-gold hover:bg-gold-light text-[#0a0a0c] font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>LECTURE</span>
                  </>
                )}
              </button>

              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-lg bg-[#181a24] hover:bg-[#202330] border border-zinc-700/60 text-zinc-300 flex items-center justify-center transition-colors active:scale-95"
                title="Piste suivante"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-zinc-400">
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }
                }}
                className="hover:text-gold p-1"
                title={isMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
