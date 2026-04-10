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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleInteractionStart = () => {
    setIsPlaying(true);
    videoRef.current?.play();
  };

  const handleInteractionEnd = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className={`relative rounded-lg overflow-hidden cursor-pointer group select-none shadow-sm hover:shadow-xl transition-all duration-700 ${className}`}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      style={{ width, height }}
    >
      {/* "LIVE" Badge */}
      <div className={`absolute top-4 left-4 z-20 flex items-center gap-2 px-2 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/10 transition-all duration-500 ${isPlaying ? 'opacity-100 scale-105 bg-accent/40 text-white' : 'opacity-60 scale-100 text-white/80'} group-hover:opacity-100`}>
        <LivePhotoIcon size={12} />
        <span className="text-[9px] font-sans uppercase tracking-[0.2em] font-medium">Live</span>
      </div>

      {/* Static Poster */}
      <img 
        src={poster} 
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-700 ${isPlaying ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
      />

      {/* Live Video */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        loop
        onLoadedData={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
      />

      {/* Ambient Depth (Premium Polish) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
    </div>
  );
};
