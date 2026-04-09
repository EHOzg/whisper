import React from 'react';
import { motion } from 'framer-motion';

export const Signature: React.FC = () => {
  return (
    <div className="w-full flex justify-center">
      <svg 
        viewBox="0 0 500 150" 
        className="w-full max-w-2xl h-auto"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Whisper Signature</title>
        <motion.path
          d="M50 80C50 80 85 20 110 80C135 140 150 40 150 40M150 40C150 40 160 100 180 80C200 60 210 40 210 40M210 40C210 40 215 110 235 80C255 50 265 40 265 40M265 40C265 40 270 120 290 80C310 40 320 40 320 40M320 40C320 40 325 100 345 80C365 60 375 40 375 40M375 40C375 40 380 90 400 80C420 70 430 40 430 40"
          stroke="var(--text-main)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ 
            duration: 3, 
            ease: [0.2, 0.8, 0.2, 1],
            delay: 0.8
          }}
        />
        {/* Subtle glow effect following the path */}
        <motion.path
          d="M50 80C50 80 85 20 110 80C135 140 150 40 150 40M150 40C150 40 160 100 180 80C200 60 210 40 210 40M210 40C210 40 215 110 235 80C255 50 265 40 265 40M265 40C265 40 270 120 290 80C310 40 320 40 320 40M320 40C320 40 325 100 345 80C365 60 375 40 375 40M375 40C375 40 380 90 400 80C420 70 430 40 430 40"
          stroke="var(--whisper-glow)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="blur-sm"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ 
            duration: 3.5, 
            ease: [0.2, 0.8, 0.2, 1],
            delay: 1
          }}
        />
      </svg>
    </div>
  );
};
