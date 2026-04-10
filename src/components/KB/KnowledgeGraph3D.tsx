import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three-stdlib';
import type { GraphData } from '../../utils/kb-graph';

interface KnowledgeGraph3DProps {
  data: GraphData;
}

export const KnowledgeGraph3D: React.FC<KnowledgeGraph3DProps> = ({ data }) => {
  const fgRef = useRef<any>();

  // 1. Post-Processing Setup (Bloom)
  useEffect(() => {
    if (!fgRef.current) return;

    const composer = fgRef.current.postProcessingComposer();
    
    // Add Unreal Bloom Pass
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.8,  // strength
      0.4,  // radius
      0.85  // threshold
    );
    composer.addPass(bloomPass);

    // Add Scene Fog for depth
    const scene = fgRef.current.scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0012);

    // Initial camera position
    fgRef.current.cameraPosition({ z: 400 });

    return () => {
    };
  }, []);

  // 2. Texture Loader
  const texture = useMemo(() => {
    return new THREE.TextureLoader().load('/assets/kb/node-texture.png');
  }, []);

  // 3. Custom Node Design: "Crystals of Thought" (Dodecahedrons)
  const nodeThreeObject = useCallback((node: any) => {
    const group = new THREE.Group();
    
    // Core Geometry: Faceted Crystal
    const baseColor = node.category === 'Digital Aesthetics' ? '#94a3b8' : 
                     node.category === 'Astro Mastery' ? '#d4af37' : '#8dd3c7';
    
    // Crystals are Dodecahedrons (12 sides)
    const coreGeo = new THREE.DodecahedronGeometry(node.val);
    const coreMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      map: texture,
      emissive: baseColor,
      emissiveIntensity: 2.0,
      roughness: 0.2,
      metalness: 0.8
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Outer Faceted Shell (Glass Layer)
    const shellGeo = new THREE.DodecahedronGeometry(node.val * 1.25);
    const shellMat = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.15,
      transmission: 0.9,
      thickness: 1.0,
      roughness: 0.1,
      ior: 1.8 // High refraction for gemstone look
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    group.add(shell);

    // Category Hub Ring (Saturn Style)
    // We assume hub nodes have greater 'val' (which is set for order:1 in our util)
    if (node.val > 3.5) {
        const ringGeo = new THREE.TorusGeometry(node.val * 2.2, 0.1, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ 
            color: baseColor, 
            transparent: true, 
            opacity: 0.3 
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
        
        // Secondary outer glowing ring
        const outerRingGeo = new THREE.TorusGeometry(node.val * 2.5, 0.05, 16, 100);
        const outerRing = new THREE.Mesh(outerRingGeo, ringMat);
        outerRing.rotation.x = Math.PI / 2;
        (group as any).__ringData = { speed: 0.01 };
        group.add(outerRing);
    }

    // Floating Label (Sprite-based)
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
        canvas.width = 512;
        canvas.height = 128;
        context.font = '500 42px Inter, "Playfair Display", serif';
        context.fillStyle = 'rgba(255, 255, 255, 0.9)';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(node.name, 256, 64);

        const labelTexture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ 
            map: labelTexture,
            transparent: true,
            opacity: 0,
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(40, 10, 1);
        sprite.position.y = node.val + 25;
        (group as any).__labelSprite = sprite;
        group.add(sprite);
    }

    // Animation Metadata
    (group as any).__breathData = {
      offset: node.phaseOffset,
      speed: 0.001 + node.randomFactor * 0.001
    };

    return group;
  }, [texture]);

  // 4. Animation Loop (Breathing & Hub Rotation)
  useEffect(() => {
    let animationId: number;
    const animate = () => {
        if (fgRef.current) {
            const time = Date.now();
            fgRef.current.scene().traverse((obj: any) => {
                // Breathing Animation
                if (obj.__breathData) {
                    const { offset, speed } = obj.__breathData;
                    const scale = 1 + Math.sin(time * speed + offset) * 0.03;
                    obj.scale.set(scale, scale, scale);
                    obj.rotation.y += 0.005;
                    obj.rotation.x += 0.002;
                }
                // Hub Ring Rotation
                if (obj.geometry && obj.geometry.type === 'TorusGeometry') {
                    obj.rotation.z += 0.01;
                }
            });
        }
        animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleNodeHover = useCallback((node: any) => {
    if (node && node.__threeObj && node.__threeObj.__labelSprite) {
        node.__threeObj.__labelSprite.material.opacity = 1;
    }
  }, []);

  const handleNodeClick = useCallback((node: any) => {
    window.location.href = `/kb/${node.id}`;
  }, []);

  return (
    <div className="w-full h-full bg-[#010101]">
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        nodeLabel="name"
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={false}
        
        // Link Aesthetics (Energy Streams)
        linkColor={() => 'rgba(255, 255, 255, 0.04)'}
        linkWidth={0.6}
        linkDirectionalParticles={3}
        linkDirectionalParticleSpeed={0.006}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleColor={() => 'rgba(255, 255, 255, 0.5)'}
        
        backgroundColor="#000000"
        showNavInfo={false}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        enableNodeDrag={false}
        
        d3VelocityDecay={0.3}
        warmupTicks={100}
        cooldownTicks={1000}
      />
      
      {/* HUD Info */}
      <div className="absolute bottom-12 left-12 z-50 pointer-events-none whisper-fade-in font-sans">
        <div className="flex items-center gap-4 mb-4">
           <div className="w-12 h-[1px] bg-accent/30"></div>
           <h2 className="text-white font-serif text-3xl italic tracking-tight opacity-60">
             神经网络架构
           </h2>
        </div>
        <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] ml-16 max-w-xs leading-relaxed">
          通过节点分布与能量流动进行的交互式知识映射。
        </p>
      </div>
    </div>
  );
};
