import React, { useRef, useMemo, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface InspirationWindProps {
  inspirations: Array<{
    id: string;
    data: {
      type: 'thought' | 'snippet' | 'quote';
      content: string;
      author?: string;
    }
  }>;
}

const ThoughtFragment: React.FC<{
    data: any, 
    mouseX: any, 
    mouseY: any,
    initialX: number,
    initialY: number
}> = ({ data, mouseX, mouseY, initialX, initialY }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Spring physics for the "wind" reaction
    const springConfig = { damping: 25, stiffness: 120 };
    const x = useSpring(initialX, springConfig);
    const y = useSpring(initialY, springConfig);
    
    // Ambient floating movement
    const floatY = useMotionValue(0);
    const floatDuration = useMemo(() => 3 + Math.random() * 4, []);
    const floatDelay = useMemo(() => Math.random() * 2, []);

    useEffect(() => {
        const unsubscribeX = mouseX.on("change", (latestX: number) => {
            const dx = latestX - (window.innerWidth / 2 + initialX);
            const dy = mouseY.get() - (window.innerHeight / 2 + initialY);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 300) {
                const power = (300 - distance) / 300;
                x.set(initialX - (dx * power * 0.5));
                y.set(initialY - (dy * power * 0.5));
            } else {
                x.set(initialX);
                y.set(initialY);
            }
        });

        return () => unsubscribeX();
    }, [initialX, initialY, mouseX, mouseY, x, y]);

    const opacity = useMemo(() => 0.2 + Math.random() * 0.6, []);
    const scale = useMemo(() => 0.8 + Math.random() * 0.4, []);
    const fontSize = useMemo(() => {
        if (data.type === 'quote') return 'text-xl md:text-3xl';
        if (data.type === 'snippet') return 'text-xs md:text-sm';
        return 'text-sm md:text-lg';
    }, [data.type]);

    const fontClass = useMemo(() => {
        if (data.type === 'quote') return 'font-serif italic';
        if (data.type === 'snippet') return 'font-typewriter opacity-60';
        return 'font-sans font-light';
    }, [data.type]);

    return (
        <motion.div
            ref={containerRef}
            className={`absolute whitespace-nowrap pointer-events-auto cursor-default select-none ${fontSize} ${fontClass} text-text-main`}
            style={{ 
                x, 
                y, 
                opacity,
                scale,
                filter: `blur(${data.type === 'snippet' ? '1px' : '0px'})`
            }}
            initial={{ opacity: 0 }}
            animate={{ 
                opacity,
                y: [initialY - 10, initialY + 10, initialY - 10]
            }}
            transition={{
                opacity: { duration: 2 },
                y: {
                    duration: floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: floatDelay
                }
            }}
            whileHover={{ 
                scale: 1.1, 
                opacity: 1, 
                filter: 'blur(0px)',
                transition: { duration: 0.4 } 
            }}
        >
            {data.type === 'quote' ? `“${data.content}”` : data.content}
        </motion.div>
    );
};

export const InspirationWind: React.FC<InspirationWindProps> = ({ inspirations }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const fragments = useMemo(() => {
    return inspirations.map((item) => {
        // Spread items across the screen area
        const angle = Math.random() * Math.PI * 2;
        const radius = 100 + Math.random() * 400;
        return {
            ...item,
            initialX: Math.cos(angle) * radius,
            initialY: Math.sin(angle) * radius,
        };
    });
  }, [inspirations]);

  return (
    <div className="relative w-full h-[80vh] flex items-center justify-center overflow-visible">
        {/* Background Ambient Layers */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
            <h2 className="text-[20vw] font-serif uppercase tracking-[0.4em] blur-3xl">风</h2>
        </div>

        {fragments.map((frag) => (
            <ThoughtFragment 
                key={frag.id} 
                data={frag.data} 
                mouseX={mouseX} 
                mouseY={mouseY}
                initialX={frag.initialX}
                initialY={frag.initialY}
            />
        ))}
    </div>
  );
};
