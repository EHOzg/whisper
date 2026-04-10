import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InspirationWind } from './InspirationWind';
import { InspirationForest } from './InspirationForest';
import { Wind, Trees as TreeIcon } from 'lucide-react';

interface InspirationControllerProps {
  inspirations: any[];
}

export const InspirationController: React.FC<InspirationControllerProps> = ({ inspirations }) => {
  const [mode, setMode] = useState<'wind' | 'forest'>('wind');

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Mode Toggle Switch */}
      <div className="absolute top-10 right-10 z-50 flex items-center gap-4">
        <button 
          onClick={() => setMode('wind')}
          className={`p-3 rounded-full transition-all duration-700 ${mode === 'wind' ? 'bg-accent text-white scale-110 shadow-lg' : 'bg-bg-base/40 text-accent/40 hover:bg-bg-base/60'}`}
          title="Mode: Wind"
        >
          <Wind size={18} />
        </button>
        <button 
          onClick={() => setMode('forest')}
          className={`p-3 rounded-full transition-all duration-700 ${mode === 'forest' ? 'bg-accent text-white scale-110 shadow-lg' : 'bg-bg-base/40 text-accent/40 hover:bg-bg-base/60'}`}
          title="Mode: Forest"
        >
          <TreeIcon size={18} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={mode}
           initial={{ opacity: 0, filter: 'blur(10px)' }}
           animate={{ opacity: 1, filter: 'blur(0px)' }}
           exit={{ opacity: 0, filter: 'blur(10px)' }}
           transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
           className="w-full h-full"
        >
           {mode === 'wind' ? (
             <InspirationWind inspirations={inspirations} />
           ) : (
             <InspirationForest inspirations={inspirations} />
           )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
