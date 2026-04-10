import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';

interface WhisperFlowerProps {
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

export const WhisperFlower: React.FC<WhisperFlowerProps> = ({ inspiration, position }) => {
  const [hovered, setHovered] = useState(false);
  const petalGroupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  // Bloom animation state
  const bloomFactor = useRef(0);
  const targetBloom = hovered ? 1 : 0;

  const { type, content } = inspiration.data;

  // Animation Loop
  useFrame((state, delta) => {
    // Smooth lerp for blooming animation
    bloomFactor.current = THREE.MathUtils.lerp(bloomFactor.current, targetBloom, delta * 3);
    
    if (petalGroupRef.current) {
      petalGroupRef.current.children.forEach((petal, i) => {
        // Unfold petals: Rotate from closed (approx PI/2) to open (approx PI/6)
        // Adjust the angle based on bloomFactor
        const angle = THREE.MathUtils.lerp(Math.PI / 1.8, Math.PI / 4, bloomFactor.current);
        petal.rotation.x = angle;
        
        // Scale petals slightly as they open
        const scale = 0.5 + bloomFactor.current * 0.7;
        petal.scale.set(scale, scale, scale);
      });
    }

    if (coreRef.current) {
        // Core intensity pulse
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 0.8;
        (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = (2 + bloomFactor.current * 10) * pulse;
    }
  });

  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <group 
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {/* Central Pistil (Glowing Core) */}
          <mesh ref={coreRef}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial 
              color="#FFD700" 
              emissive="#FFD700" 
              emissiveIntensity={2} 
            />
          </mesh>

          {/* Petals */}
          <group ref={petalGroupRef}>
            {[0, 1, 2, 3, 4].map((i) => (
              <group key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
                <mesh position={[0, 0.4, 0.2]}>
                  <sphereGeometry args={[0.5, 16, 16, 0, Math.PI, 0, Math.PI / 2]} />
                  <meshStandardMaterial 
                    color="#f5f5f5" 
                    side={THREE.DoubleSide} 
                    roughness={0.7}
                  />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      </Float>

      {/* Content Overlay */}
      {hovered && (
        <Html distanceFactor={10} center position={[0, 2.5, 0]}>
          <div className="bg-[#0a0a0a]/90 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10 shadow-2xl w-64 animate-in fade-in zoom-in duration-500">
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
