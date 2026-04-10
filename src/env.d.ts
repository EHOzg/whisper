/// <reference types="astro/client" />
declare module '@react-three/postprocessing' {
  import { ReactNode } from 'react';
  import { EffectComposer as EffectComposerType } from 'postprocessing';
  
  export const EffectComposer: React.FC<{
    children?: ReactNode;
    multisampling?: number;
    frameBufferType?: number;
    renderPriority?: number;
    disableNormalPass?: boolean;
    stencilBuffer?: boolean;
    depthBuffer?: boolean;
    autoClear?: boolean;
  }>;

  export const Bloom: React.FC<{
    luminanceThreshold?: number;
    luminanceSmoothing?: number;
    mipmapBlur?: boolean;
    intensity?: number;
    radius?: number;
  }>;
}
