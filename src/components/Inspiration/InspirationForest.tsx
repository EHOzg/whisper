import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { WhisperTree } from './WhisperTree';
import { WhisperFlower } from './WhisperFlower';

interface InspirationForestProps {
  inspirations: Array<{
    id: string;
    data: {
      type: 'thought' | 'snippet' | 'quote';
      content: string;
      author?: string;
    }
  }>;
}

const ForestScene: React.FC<InspirationForestProps> = ({ inspirations }) => {
  // Generate orbital positions for flowers in the canopy
  const flowers = useMemo(() => {
    return inspirations.map((inspiration, index) => {
      // Create a shell distribution focused on the upper half
      const phi = Math.acos(-1 + (2 * index) / inspirations.length);
      const theta = Math.sqrt(inspirations.length * Math.PI) * phi;
      
      const radius = 18 + Math.random() * 12;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = 14 + Math.random() * 15; // Higher up in the branches
      const z = radius * Math.cos(phi);

      return {
        inspiration,
        position: [x, y, z] as [number, number, number]
      };
    });
  }, [inspirations]);

  return (
    <>
      <color attach="background" args={['#F7F5F0']} />
      <fog attach="fog" args={['#F7F5F0', 50, 180]} />
      
      <ambientLight intensity={0.15} />
      <directionalLight position={[10, 50, 10]} intensity={1.2} castShadow />
      <pointLight position={[0, 15, 0]} intensity={3} color="#FFD700" />
      
      <Suspense fallback={null}>
        {/* The World Tree (Centerpiece) */}
        <WhisperTree />

        {/* Flowering Inspirations */}
        {flowers.map((f) => (
          <WhisperFlower 
            key={f.inspiration.id} 
            inspiration={f.inspiration} 
            position={f.position} 
          />
        ))}

        {/* Ambient Particles */}
        <Sparkles 
           count={120} 
           scale={70} 
           size={1} 
           speed={0.3} 
           opacity={0.15} 
           color="#1A1A1A" 
        />
        <Sparkles 
           count={80} 
           scale={50} 
           size={2.5} 
           speed={0.5} 
           opacity={0.25} 
           color="#FFD700" 
        />
        
        {/* Sacred Altar */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
          <circleGeometry args={[50, 64]} />
          <meshStandardMaterial 
            color="#F0EEE6" 
            roughness={0.9} 
          />
        </mesh>

        <ContactShadows 
            opacity={0.35} 
            scale={120} 
            blur={4.5} 
            far={25} 
            resolution={512} 
            color="#1A1A1A" 
        />

        {/* Post-Processing Effects */}
        <EffectComposer disableNormalPass>
          <Bloom 
             luminanceThreshold={1.0} 
             mipmapBlur 
             intensity={1.0} 
             radius={0.4}
          />
        </EffectComposer>
      </Suspense>

      <OrbitControls 
        enablePan={false} 
        minDistance={50} 
        maxDistance={140} 
        maxPolarAngle={Math.PI / 2.1} 
        autoRotate 
        autoRotateSpeed={0.2}
        target={[0, 15, 0]}
      />
    </>
  );
};

export const InspirationForest: React.FC<InspirationForestProps> = ({ inspirations }) => {
  return (
    <div className="w-full h-screen bg-bg-base/50">
      <Canvas shadows camera={{ position: [90, 45, 90], fov: 38 }}>
        <ForestScene inspirations={inspirations} />
      </Canvas>

      {/* 3D UI Overlay */}
      <div className="absolute top-10 left-10 pointer-events-none">
        <h2 className="text-[10px] uppercase tracking-[0.6em] text-accent opacity-60 mb-2">
            whisper // inspiration
        </h2>
        <h1 className="text-4xl font-serif text-text-main italic">
            灵感森林
        </h1>
      </div>

      <div className="absolute bottom-10 right-10 pointer-events-none opacity-20 text-right">
        <p className="text-[9px] uppercase tracking-[0.4em]">
            Drag to explore // Hover to hear the whispers
        </p>
      </div>
    </div>
  );
};
