import React, { useRef, useMemo, useEffect, useState } from 'react';
import { InspirationCard } from './InspirationCard';

interface CanvasProps {
  inspirations: Array<{
    id: string;
    data: {
      type: 'thought' | 'snippet' | 'quote';
      content: string;
      author?: string;
    }
  }>;
}

export const Canvas: React.FC<CanvasProps> = ({ inspirations }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight
      });
    }
  }, []);

  // Generate random positions and rotations
  const scatteredData = useMemo(() => {
    return inspirations.map((item) => {
      // Create a scattered effect across the center-weighted area
      const x = (Math.random() - 0.5) * 800; 
      const y = (Math.random() - 0.5) * 500;
      const rotate = (Math.random() - 0.5) * 15;
      
      return {
        ...item,
        initialX: x,
        initialY: y,
        initialRotate: rotate
      };
    }, [inspirations]);
  }, [inspirations]);

  return (
    <div 
      className="w-full h-full min-h-[600px] flex items-center justify-center relative touch-none"
      ref={containerRef}
    >
      {/* Background ambient text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none">
        <h2 className="text-[15vw] font-serif uppercase tracking-[0.2em] whitespace-nowrap">
          Inspiration
        </h2>
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        {scatteredData.map((item) => (
          <InspirationCard 
            key={item.id}
            data={item.data}
            initialX={item.initialX}
            initialY={item.initialY}
            initialRotate={item.initialRotate}
            containerRef={containerRef}
          />
        ))}
      </div>
    </div>
  );
};
