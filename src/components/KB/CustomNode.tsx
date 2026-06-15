import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';

interface CustomNodeProps {
  id: string;
  data: {
    label: string;
    category?: string;
    isMain?: boolean;
    onChange?: (id: string, newLabel: string) => void;
  };
}

export const CustomNode: React.FC<CustomNodeProps> = ({ id, data }) => {
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`group relative flex items-center justify-center min-w-[120px] px-4 py-2 rounded-xl border backdrop-blur-sm shadow-sm transition-all duration-300 ${
        data.isMain 
          ? 'bg-accent/10 border-accent/40 text-accent font-medium shadow-accent/20' 
          : 'bg-background/80 border-text-main/10 text-text-main hover:border-accent/30 hover:shadow-accent/5'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-accent !border-none" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-accent !border-none" />
      
      <div className="flex flex-col items-center">
        {data.category ? (
          <a 
            href={`/kb/${id}`}
            className="text-sm tracking-widest hover:text-accent hover:underline cursor-pointer transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {data.label}
          </a>
        ) : (
          <span className="text-sm tracking-widest">{data.label}</span>
        )}
        {data.category && !data.isMain && (
          <span className="text-[10px] text-text-main/50 uppercase mt-1">{data.category}</span>
        )}
      </div>
    </motion.div>
  );
};
