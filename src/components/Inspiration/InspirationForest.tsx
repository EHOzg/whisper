import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import { WhisperTree } from './WhisperTree';

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
  return (
    <>
      <color attach="background" args={['#F7F5F0']} /> {/* Linen Background */}
      <fog attach="fog" args={['#F7F5F0', 50, 150]} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      <pointLight position={[-10, 15, -10]} intensity={0.5} color="#8C7861" />

      <Suspense fallback={null}>
        {inspirations.map((inspiration, index) => {
          // Arrange trees in a natural-looking circular/grid pattern
          const angle = (index / inspirations.length) * Math.PI * 2;
          const radius = 20 + Math.random() * 30;
          const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 10;
          const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 10;
          
          return (
            <WhisperTree 
              key={inspiration.id} 
              inspiration={inspiration} 
              position={[x, 0, z]} 
            />
          );
        })}
        
        {/* Ground Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <planeGeometry args={[500, 500]} />
          <meshStandardMaterial color="#F0EEE6" roughness={1} />
        </mesh>

        <ContactShadows 
            opacity={0.4} 
            scale={100} 
            blur={2.5} 
            far={10} 
            resolution={256} 
            color="#1A1A1A" 
        />
      </Suspense>

      <OrbitControls 
        enablePan={false} 
        minDistance={30} 
        maxDistance={120} 
        maxPolarAngle={Math.PI / 2.1} // Prevent going below ground
        autoRotate 
        autoRotateSpeed={0.5}
      />
    </>
  );
};

export const InspirationForest: React.FC<InspirationForestProps> = ({ inspirations }) => {
  return (
    <div className="w-full h-screen bg-bg-base/50">
      <Canvas shadows camera={{ position: [60, 40, 60], fov: 45 }}>
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
