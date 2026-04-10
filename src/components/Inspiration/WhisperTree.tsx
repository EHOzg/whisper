import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Tree } from '@dgreenheck/ez-tree';
import { Html } from '@react-three/drei';

interface WhisperTreeProps {
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

export const WhisperTree: React.FC<WhisperTreeProps> = ({ inspiration, position }) => {
  const [hovered, setHovered] = useState(false);
  const { type, content } = inspiration.data;

  // Procedural Tree Generation Logic
  const treeGroup = useMemo(() => {
    const tree = new Tree();
    
    // Deterministic seed based on inspiration ID
    const seed = inspiration.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    tree.options.seed = seed;

    // Define species attributes based on inspiration type
    if (type === 'quote') {
      // Cypress-like (Tall, wisdom)
      tree.options.branch.length[0] = 15 + (content.length % 5);
      tree.options.branch.radius[0] = 0.5;
      tree.options.branch.levels = 3;
      tree.options.branch.children[0] = 10;
    } else if (type === 'thought') {
      // Oak-like (Spreading, reflection)
      tree.options.branch.length[0] = 10;
      tree.options.branch.radius[0] = 1.2;
      tree.options.branch.levels = 4;
      tree.options.branch.children[0] = 15;
    } else {
      // Shrub-like (Dense, spark)
      tree.options.branch.length[0] = 5;
      tree.options.branch.radius[0] = 0.3;
      tree.options.branch.levels = 2;
      tree.options.branch.children[0] = 20;
    }

    // Generate the tree geometry
    tree.generate();
    
    // Post-generation styling to match Whisper theme (Ink/Linen)
    // EZ-Tree creates meshes for 'trunk' and 'leaves'
    // We can traverse the generated group to apply materials
    tree.traverse((child: any) => {
        if (child.isMesh) {
            if (child.name.includes('leaves')) {
                child.material = new THREE.MeshStandardMaterial({
                    color: hovered ? '#8C7861' : '#1A1A1A', // Accent vs Ink
                    roughness: 0.8,
                    transparent: true,
                    opacity: 0.9
                });
            } else {
                child.material = new THREE.MeshStandardMaterial({
                    color: '#2A2A2A',
                    roughness: 0.9
                });
            }
        }
    });

    return tree;
  }, [inspiration.id, type, content.length, hovered]);

  return (
    <group position={position}>
      <primitive 
        object={treeGroup} 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.05 : 1}
      />
      
      {/* Dynamic Text "Whisper" revealed on hover */}
      {hovered && (
        <Html position={[0, treeGroup.options.branch.length[0] + 2, 0]} center distanceFactor={15}>
          <div className="bg-bg-base/80 backdrop-blur-md px-6 py-4 rounded-xl border border-accent/20 shadow-2xl max-w-xs animate-in fade-in zoom-in duration-500">
            <p className="text-xs uppercase tracking-widest text-accent mb-2 opacity-50">{type}</p>
            <p className="text-sm font-serif italic leading-relaxed text-text-main">
              {content}
            </p>
            {inspiration.data.author && (
              <p className="text-[10px] mt-4 opacity-40 text-right">— {inspiration.data.author}</p>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};
