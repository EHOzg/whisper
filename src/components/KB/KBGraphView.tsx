import React, { Suspense, lazy } from 'react';
import type { GraphData } from '../../utils/kb-graph';

// Lazy load the new 2D mind map
const KBMindMap = lazy(() => import('./KBMindMap').then(m => ({ default: m.KBMindMap })));

interface KBGraphViewProps {
  data: GraphData;
}

export const KBGraphView: React.FC<KBGraphViewProps> = ({ data }) => {
  return (
    <div className="w-full h-full">
      <Suspense fallback={
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full border border-accent/30 border-t-accent animate-spin mb-4"></div>
          <span className="text-text-main/30 text-[10px] uppercase tracking-[0.5em]">构建思维导图...</span>
        </div>
      }>
        <KBMindMap data={data} />
      </Suspense>
    </div>
  );
};
