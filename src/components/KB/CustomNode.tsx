import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Trash2, Edit2, Check } from 'lucide-react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'New Node');
  const inputRef = useRef<HTMLInputElement>(null);
  const { setNodes } = useReactFlow();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (data.onChange) {
      data.onChange(id, label);
    } else {
      // Fallback if onChange not provided in data
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === id) {
            n.data = { ...n.data, label };
          }
          return n;
        })
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setLabel(data.label || 'New Node');
      setIsEditing(false);
    }
  };

  const deleteNode = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
  };

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`group relative flex items-center justify-center min-w-[120px] px-4 py-2 rounded-xl border backdrop-blur-sm shadow-sm transition-all duration-300 ${
        data.isMain 
          ? 'bg-accent/10 border-accent/40 text-accent font-medium shadow-accent/20' 
          : 'bg-background/80 border-text-main/10 text-text-main hover:border-accent/30 hover:shadow-accent/5'
      }`}
      onDoubleClick={() => setIsEditing(true)}
    >
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-accent !border-none" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-accent !border-none" />
      
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="w-full min-w-[80px] bg-transparent border-b border-accent outline-none text-center text-sm font-medium"
          />
          <button onClick={handleSave} className="text-accent hover:opacity-80">
            <Check size={14} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <span className="text-sm tracking-widest">{label}</span>
          {data.category && !data.isMain && (
            <span className="text-[10px] text-text-main/50 uppercase mt-1">{data.category}</span>
          )}
        </div>
      )}

      {/* Toolbar actions visible on hover */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 border border-text-main/10 rounded-lg p-1 shadow-md pointer-events-none group-hover:pointer-events-auto z-10 after:content-[''] after:absolute after:-bottom-4 after:left-0 after:w-full after:h-4">
        <button 
          onClick={() => setIsEditing(true)}
          className="p-1.5 text-text-main/60 hover:text-accent hover:bg-accent/10 rounded-md transition-colors"
          title="Edit Node"
        >
          <Edit2 size={12} />
        </button>
        <button 
          onClick={deleteNode}
          className="p-1.5 text-text-main/60 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
          title="Delete Node"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </motion.div>
  );
};
