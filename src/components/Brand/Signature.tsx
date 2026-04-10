import React from 'react';
import { motion } from 'framer-motion';

/**
 * High-fidelity 'Pen Stroke' Signature for Project Whisper.
 * Technique: SVG Masking with dynamic pathLength.
 * Aesthetic: TTPD Ink-on-Linen Calligraphy.
 */
export const Signature: React.FC = () => {
  return (
    <div className="w-full flex justify-center py-12">
      <svg 
        viewBox="0 0 500 150" 
        className="w-full max-w-2xl h-auto"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Whisper High-Fidelity Signature</title>
        
        <defs>
          {/* The Hidden Path that acts as a mask reveal */}
          <mask id="ink-mask">
            <motion.path
                d="M50 80C50 80 85 20 110 80C135 140 150 40 150 40M150 40C150 40 160 100 180 80C200 60 210 40 210 40M210 40C210 40 215 110 235 80C255 50 265 40 265 40M265 40C265 40 270 120 290 80C310 40 320 40 320 40M320 40C320 40 325 100 345 80C365 60 375 40 375 40M375 40C375 40 380 90 400 80C420 70 430 40 430 40"
                stroke="white"
                strokeWidth="12" // Thicker than the visible path for full coverage
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ 
                    duration: 5, 
                    ease: "easeInOut",
                    delay: 1
                }}
            />
          </mask>
        </defs>

        <g mask="url(#ink-mask)">
          {/* Main Calligraphic Body - Using multiple layers for "ink weight" */}
          <motion.path
            d="M50 80C50 80 85 20 110 80C135 140 150 40 150 40M150 40C150 40 160 100 180 80C200 60 210 40 210 40M210 40C210 40 215 110 235 80C255 50 265 40 265 40M265 40C265 40 270 120 290 80C310 40 320 40 320 40M320 40C320 40 325 100 345 80C365 60 375 40 375 40M375 40C375 40 380 90 400 80C420 70 430 40 430 40"
            stroke="var(--color-text-main)"
            strokeWidth="3.2" // Base ink path
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-90"
          />
          
          {/* Secondary Layer - Variable Pressure Effect */}
          <motion.path
            d="M50 80C50 80 85 20 110 80C135 140 150 40 150 40M150 40C150 40 160 100 180 80C200 60 210 40 210 40M210 40C210 40 215 110 235 80C255 50 265 40 265 40M265 40C265 40 270 120 290 80C310 40 320 40 320 40M320 40C320 40 325 100 345 80C365 60 375 40 375 40M375 40C375 40 380 90 400 80C420 70 430 40 430 40"
            stroke="var(--color-text-main)"
            strokeWidth="1.2" // Fine details
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-40"
          />

          {/* Third Layer - Ink Shadow / Bleed */}
          <motion.path
            d="M50 80C50 80 85 20 110 80C135 140 150 40 150 40M150 40C150 40 160 100 180 80C200 60 210 40 210 40M210 40C210 40 215 110 235 80C255 50 265 40 265 40M265 40C265 40 270 120 290 80C310 40 320 40 320 40M320 40C320 40 325 100 345 80C365 60 375 40 375 40M375 40C375 40 380 90 400 80C420 70 430 40 430 40"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-20 translate-x-[0.5px] translate-y-[0.5px]"
          />
        </g>
        
        {/* Subtle Ambient Fade-in for background shadow */}
        <motion.path
          d="M50 80C50 80 85 20 110 80C135 140 150 40 150 40M150 40C150 40 160 100 180 80C200 60 210 40 210 40M210 40C210 40 215 110 235 80C255 50 265 40 265 40M265 40C265 40 270 120 290 80C310 40 320 40 320 40M320 40C320 40 325 100 345 80C365 60 375 40 375 40M375 40C375 40 380 90 400 80C420 70 430 40 430 40"
          stroke="var(--color-whisper-glow)"
          strokeWidth="6"
          className="blur-xl opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 4, delay: 2.5 }}
        />
      </svg>
    </div>
  );
};
