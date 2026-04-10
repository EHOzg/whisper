import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Fragment {
  id: string;
  text: string;
  x: string;
  y: string;
  duration: number;
  delay: number;
  scale: number;
}

interface AmbientFragmentsProps {
  fragments?: string[];
}

export const AmbientFragments: React.FC<AmbientFragmentsProps> = ({ fragments = [] }) => {
  const generatedFragments = useMemo(() => {
    // If no fragments provided, use some default poetic bits
    const source = fragments.length > 0 ? fragments : [
      "思绪如烟", "星群落入深空", "墨水尚未干透", "灵感的阴影", 
      "数字园地", "记忆的碎片", "一秒半的永恒", "诗性的代码"
    ];

    return source.slice(0, 10).map((text, i) => ({
      id: `frag-${i}`,
      text,
      x: `${Math.random() * 80 + 10}%`,
      y: `${Math.random() * 80 + 10}%`,
      duration: 20 + Math.random() * 30,
      delay: Math.random() * -20,
      scale: 0.8 + Math.random() * 0.4,
    }));
  }, [fragments]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {generatedFragments.map((frag) => (
        <motion.div
          key={frag.id}
          className="absolute text-[10px] md:text-xs uppercase tracking-[0.4em] text-accent/20 font-sans whitespace-nowrap"
          initial={{ x: frag.x, y: frag.y, opacity: 0 }}
          animate={{
            y: ['0%', '20%', '-20%', '0%'],
            x: ['0%', '10%', '-10%', '0%'],
            opacity: [0, 0.4, 0.4, 0],
          }}
          transition={{
            duration: frag.duration,
            repeat: Infinity,
            delay: frag.delay,
            ease: "easeInOut",
          }}
          style={{ scale: frag.scale }}
        >
          {frag.text}
        </motion.div>
      ))}
      
      {/* Subtle cursor-following glow (Ambient) */}
      <motion.div 
        className="absolute w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] mix-blend-soft-light"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      />
    </div>
  );
};
