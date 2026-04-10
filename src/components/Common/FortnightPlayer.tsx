import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music2, ExternalLink } from 'lucide-react';

export const FortnightPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const timerRef = useRef<number | null>(null);

    // Simulation of playback
    useEffect(() => {
        if (isPlaying) {
            timerRef.current = window.setInterval(() => {
                setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
            }, 500);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying]);

    return (
        <div 
            className="fixed bottom-10 right-10 z-[100] font-typewriter group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                        className="absolute bottom-16 right-0 p-6 whisper-glass rounded-lg min-w-[280px] origin-bottom-right"
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="text-xs uppercase tracking-[0.2em] text-accent font-sans mb-1">Now Playing</h4>
                                    <h3 className="text-sm font-typewriter text-text-main leading-tight">Fortnight</h3>
                                    <p className="text-[10px] text-text-main/60 italic">feat. Post Malone</p>
                                </div>
                                <div className="p-2 rounded-full bg-accent/10">
                                    <Music2 className="w-4 h-4 text-accent" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="h-[1px] w-full bg-text-main/10 relative">
                                    <motion.div 
                                        className="absolute top-0 left-0 h-full bg-accent"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[8px] uppercase tracking-widest text-text-main/40">
                                    <span>TTPD-001</span>
                                    <span>{progress.toFixed(0)}%</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="p-3 bg-text-main text-bg-base rounded-full hover:scale-105 transition-transform"
                                >
                                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                                </button>
                                <a 
                                    href="https://open.spotify.com/track/2OzhkzW7VF90jO0v9S9v6w" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[9px] uppercase tracking-widest text-text-main/60 hover:text-accent flex items-center gap-1 transition-colors"
                                >
                                    Spotify <ExternalLink className="w-2 h-2" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button 
                className="w-14 h-14 whisper-glass rounded-full flex items-center justify-center group-hover:border-accent/40 transition-all duration-700 shadow-xl"
                onClick={() => setIsPlaying(!isPlaying)}
            >
                <div className="relative">
                     {isPlaying ? (
                        <div className="flex gap-1 items-end h-3">
                             {[1, 2, 3].map((i) => (
                                 <motion.div 
                                    key={i}
                                    animate={{ height: [4, 12, 4] }}
                                    transition={{ duration: 0.6 + i*0.2, repeat: Infinity }}
                                    className="w-1 bg-accent rounded-full"
                                 />
                             ))}
                        </div>
                     ) : (
                        <div className="w-1 h-1 bg-accent rounded-full animate-ping" />
                     )}
                </div>
            </button>
        </div>
    );
};
