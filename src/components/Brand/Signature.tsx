import React from 'react';
import { motion } from 'framer-motion';

/**
 * Signature component using a high-fidelity Bézier path provided by the user.
 * Optimized for a larger coordinate system with enhanced ink-spread effects.
 */
export const Signature: React.FC = () => {
  // Complex high-fidelity path spelling "whisper" or stylized signature
  const userPath = "M831 57Q831 57 831 57M873 36Q1124 76.5 1375 117M0 0Q-29 46-58 92-11.5 65.5 35 39 34 68.5 33 98 80.5 53.5 128 9 111.5 17.5 95 26 122.5 33.5 150 41 198-28.5 246-98 246-98 246-98 186.5-1.5 127 95 196.5 47.5 266 0 266 0 266 0 240 47.5 214 95 275.5 65.5 337 36 345.5 23 354 10 354 10 354 10 341 55.5 328 101 375 75.5 422 50 438.5 28 455 6 455 6 455 6 437 15.5 419 25 426.5 58.5 434 92 434 92 434 92 407.5 102.5 381 113 410 82 439 51 439 51 439 51 471.5 45 504 39 518.5 24 533 9 476.5 98.5 420 188 420 188 420 188 486 102 552 16 581 14.5 610 13 584 52.5 558 92 544.5 90.5 531 89 531 89 531 89 551 68.5 571 48 612.5 40 654 32 648 46 642 60 642 60 642 60 678.5 43.5 715 27 715 27 715 27 704 12 693-3 662 39.5 631 82 631 82 631 82 647 90 663 98 663 98 663 98 714.5 69.5 766 41 766 41 766 41 776 20.5 786 0 786 0 786 0 759.5 54.5 733 109 733 109 733 109 758.5 69.5 784 30 788.5 35 793 40 797.5 28.5 802 17";

  return (
    <div className="w-full flex justify-center py-20 relative select-none">
      <svg 
        viewBox="-100 -150 1550 400" 
        className="w-full max-w-5xl h-auto overflow-visible pointer-events-none"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Whisper High-Fidelity Calligraphy</title>
        
        <defs>
          {/* Mask for the sequential progress reveal */}
          <mask id="hi-fi-mask">
            <motion.path
                d={userPath}
                stroke="white"
                strokeWidth="24"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ 
                    duration: 6, 
                    ease: [0.4, 0, 0.2, 1],
                    delay: 0.8
                }}
            />
          </mask>
          
          {/* Enhanced ink softening filter for large coords */}
          <filter id="hifi-ink-bloom" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g mask="url(#hi-fi-mask)" filter="url(#hifi-ink-bloom)">
          {/* Ambient Shadow Depth */}
          <motion.path
            d={userPath}
            stroke="var(--color-text-main)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-15 blur-[4px] translate-x-[4px] translate-y-[2px]"
          />
          
          {/* Main Ink Body - Solid "Filled" Appearance */}
          <motion.path
            d={userPath}
            stroke="var(--color-text-main)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-95"
          />
          
          {/* Medium Pressure layer */}
          <motion.path
            d={userPath}
            stroke="var(--color-text-main)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-40"
          />

          {/* Liquid Reflection Sheen */}
          <motion.path
            d={userPath}
            stroke="white"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-10 translate-x-[-1px] translate-y-[-1px]"
          />
        </g>
        
        {/* Animated Drawing Tip Follower */}
        <motion.circle
          r="4"
          fill="var(--color-text-main)"
          style={{
              offsetPath: `path('${userPath}')`,
              offsetRotate: "auto"
          }}
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
          transition={{ 
              duration: 6, 
              ease: [0.4, 0, 0.2, 1],
              delay: 0.8,
              opacity: { times: [0, 0.05, 0.95, 1] }
          }}
        />

        {/* Ambient Ground Reflection */}
        <motion.path
          d={userPath}
          stroke="var(--color-text-main)"
          strokeWidth="15"
          className="blur-[60px] opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 5, delay: 2 }}
        />
      </svg>
    </div>
  );
};

