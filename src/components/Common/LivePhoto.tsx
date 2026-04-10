import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LivePhotoIcon } from './Icons';

interface LivePhotoProps {
  src: string;        // Video MOV/MP4 source
  poster: string;     // Static JPG source
  alt?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const LivePhoto: React.FC<LivePhotoProps> = ({
  src,
  poster,
  alt = "Live Photo",
  className = "",
  width = "100%",
  height = "auto",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const startPlayback = () => {
    setIsInteracting(true);
    videoRef.current?.play().catch(() => {
        // Handle potential autoplay block if interaction didn't register
    });
  };

  const stopPlayback = () => {
    setIsInteracting(false);
    setIsVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className={`relative rounded-3xl overflow-hidden cursor-pointer group select-none shadow-sm hover:shadow-2xl transition-all duration-1000 ease-whisper ${className}`}
      onMouseEnter={startPlayback}
      onMouseLeave={stopPlayback}
      onTouchStart={startPlayback}
      onTouchEnd={stopPlayback}
      style={{ width, height }}
    >
      {/* "LIVE" Badge - Premium Glassmorphism */}
      <div 
        className={`absolute top-5 left-5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-700 ${isInteracting ? 'opacity-100 scale-105 border-accent/40 bg-accent/20' : 'opacity-60 scale-100'} group-hover:opacity-100`}
      >
        <div className={`relative flex items-center justify-center ${isInteracting ? 'animate-pulse' : ''}`}>
           <LivePhotoIcon size={14} className={isInteracting ? 'text-accent' : 'text-white'} />
        </div>
        <span className={`text-[10px] font-sans uppercase tracking-[0.2em] font-semibold ${isInteracting ? 'text-white' : 'text-white/80'}`}>
            Live
        </span>
      </div>

      {/* Static Background Layer - Stays underlying to prevent black frames */}
      <img 
        src={poster} 
        alt={alt}
        className={`w-full h-full object-cover transition-transform duration-1000 ease-whisper ${isInteracting ? 'scale-105' : 'scale-100'}`}
      />

      {/* Live Video Layer - Fades in ONLY when actual pixels are moving */}
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        loop
        preload="auto"
        onPlaying={() => setIsVideoPlaying(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isVideoPlaying ? 'opacity-100' : 'opacity-0'} pointer-events-none`}
      />

      {/* Visual Polish: Vignette and Light Leak Effect */}
      <div className={`absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none`}></div>
      
      {/* Interactive Overlay - Soft Glow */}
      <div className={`absolute inset-0 bg-accent/5 opacity-0 ${isInteracting ? 'opacity-20' : 'opacity-0'} transition-opacity duration-1000 pointer-events-none`}></div>
    </div>
  );
};
