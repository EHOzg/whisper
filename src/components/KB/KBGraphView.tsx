import React, { useState, Suspense, lazy } from 'react';
import type { GraphData } from '../../utils/kb-graph';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load the heavy 3D graph
const KnowledgeGraph3D = lazy(() => import('./KnowledgeGraph3D').then(m => ({ default: m.KnowledgeGraph3D })));

interface KBGraphViewProps {
  data: GraphData;
}

export const KBGraphView: React.FC<KBGraphViewProps> = ({ data }) => {
  const [view, setView] = useState<'bento' | 'graph'>('bento');

  return (
    <div className="relative">
      {/* View Switcher UI */}
      <div className="flex justify-center mb-16 relative z-30 font-sans">
        <div className="flex p-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
          <button 
            onClick={() => setView('bento')}
            className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${view === 'bento' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
          >
            工作台
          </button>
          <button 
            onClick={() => setView('graph')}
            className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${view === 'graph' ? 'bg-accent/40 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
          >
            深空图谱
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'bento' ? (
          <motion.div 
            key="bento"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          >
             {/* Bento Dashboard remains here */}
          </motion.div>
        ) : (
          <motion.div 
            key="graph"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black"
          >
             <button 
               onClick={() => setView('bento')}
               className="absolute top-8 right-8 z-[110] px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-white/20 transition-all font-sans"
             >
               退出图谱
             </button>
             
             <Suspense fallback={
               <div className="w-full h-full flex flex-col items-center justify-center bg-black">
                 <div className="w-12 h-12 rounded-full border border-accent/30 border-t-accent animate-spin mb-4"></div>
                 <span className="text-white/20 text-[10px] uppercase tracking-[0.5em]">星群落入深空的碎片</span>
               </div>
             }>
               <KnowledgeGraph3D data={data} />
             </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
