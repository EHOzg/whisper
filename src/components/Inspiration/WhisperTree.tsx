import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Tree } from '@dgreenheck/ez-tree';
import { Html } from '@react-three/drei';

interface WhisperTreeProps {
  position?: [number, number, number];
}

export const WhisperTree: React.FC<WhisperTreeProps> = ({ position = [0, 0, 0] }) => {
  // World Tree Generation
  const treeGroup = useMemo(() => {
    const tree = new Tree();
    
    // Fixed seed for the master tree
    tree.options.seed = 42;

    // Massive World Tree Attributes
    tree.options.branch.length[0] = 25;
    tree.options.branch.radius[0] = 3.5;
    tree.options.branch.levels = 5;
    tree.options.branch.children[0] = 20;
    
    // Lush Autumn Canopy
    tree.options.leaves.count = 350;
    tree.options.leaves.size = 2.0;
    tree.options.leaves.sizeVariance = 0.8;
    tree.options.leaves.alphaTest = 0;

    tree.generate();
    
    // Aesthetic Palette
    const autumnColors = ['#A13D2D', '#D48C45', '#C29B40', '#8A4A31', '#6B3E26'];
    
    tree.traverse((child: any) => {
        if (child.isMesh) {
            if (child.name.includes('leaves')) {
                // Determine color based on position for a natural gradient
                const y = child.position?.y || 0;
                const colorIdx = Math.floor(Math.abs(y * 10)) % autumnColors.length;
                
                child.material = new THREE.MeshPhysicalMaterial({
                    color: autumnColors[colorIdx],
                    roughness: 0.5,
                    metalness: 0.1,
                    transparent: true,
                    opacity: 0.9,
                    side: THREE.DoubleSide,
                    transmission: 0.1,
                    thickness: 1.0,
                });
            } else {
                child.material = new THREE.MeshStandardMaterial({
                    color: '#1A0E06', // Deep ancient bark
                    roughness: 1.0,
                    metalness: 0.05
                });
            }
        }
    });

    return tree;
  }, []);

  return (
    <group position={position}>
      <primitive object={treeGroup} />
    </group>
  );
};
