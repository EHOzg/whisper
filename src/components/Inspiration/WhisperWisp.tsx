import React, { useState } from 'react';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';

interface WhisperWispProps {
  inspiration: {
    id: string;
    data: {
      type: 'thought' | 'snippet' | 'quote';
      content: string;
      author?: string;
    }
  };
  position: [number, number, number];
}

export const WhisperWisp: React.FC<WhisperWispProps> = ({ inspiration, position }) => {
  const [hovered, setHovered] = useState(false);
  const { type, content } = inspiration.data;

  // Determining wisp color based on type
  const color = type === 'quote' ? '#F7D08A' : type === 'thought' ? '#A13D2D' : '#D48C45';

  return (
    <group position={position}>
      <Float
        speed={1.5 + Math.random() * 2} 
        rotationIntensity={1} 
        floatIntensity={2}
      >
        <mesh 
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={hovered ? 5 : 2} 
            transparent 
            opacity={0.8}
          />
        </mesh>

        {/* Outer Glow Ring */}
        <mesh>
          <ringGeometry args={[0.4, 0.45, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      </Float>

      {/* Content Overlay */}
      {hovered && (
        <Html distanceFactor={10} center position={[0, 1.5, 0]}>
          <div className="bg-[#0a0a0a]/90 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10 shadow-2xl w-64 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[8px] uppercase tracking-[0.2em] text-white/40">{type}</span>
              <div className="flex-grow h-[1px] bg-white/5"></div>
            </div>
            <p className="text-xs text-white/80 font-serif italic leading-relaxed">
              "{content}"
            </p>
            {inspiration.data.author && (
              <p className="text-[9px] mt-2 text-white/30 text-right">— {inspiration.data.author}</p>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};
