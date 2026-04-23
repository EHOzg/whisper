import React, { useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Settings, Trash2, Database, LayoutTemplate } from 'lucide-react';
import { motion } from 'framer-motion';

interface FormNodeProps {
  id: string;
  data: {
    label?: string;
    fields?: Array<{ label: string, value: string, placeholder: string }>;
  };
}

export const FormNode: React.FC<FormNodeProps> = ({ id, data }) => {
  const { setNodes } = useReactFlow();
  const [formName, setFormName] = useState(data.label || 'User Registration Form');
  const [fields, setFields] = useState(
    data.fields || [
      { id: '1', name: 'Username', type: 'text', placeholder: 'Enter username' },
      { id: '2', name: 'Email', type: 'email', placeholder: 'Enter email' },
    ]
  );

  const deleteNode = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
  };

  const updateNodeData = (newFields: any) => {
    // In a real app we sync this back to React Flow's state
    setNodes(nds => nds.map(n => {
      if (n.id === id) {
        n.data = { ...n.data, fields: newFields, label: formName };
      }
      return n;
    }));
  };

  const handleFieldChange = (fieldId: string, newValue: string) => {
    const updated = fields.map(f => f.id === fieldId ? { ...f, placeholder: newValue } : f);
    setFields(updated);
    updateNodeData(updated);
  };

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="group relative flex flex-col w-[260px] bg-background/95 backdrop-blur-xl rounded-2xl border border-text-main/15 shadow-xl transition-all duration-300 hover:border-accent/30 overflow-hidden"
    >
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-accent !border-2 !border-background" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-accent !border-2 !border-background" />
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-text-main/5 border-b border-text-main/10">
        <div className="flex items-center gap-2">
          <LayoutTemplate size={16} className="text-accent" />
          <input 
            value={formName}
            onChange={(e) => {
                setFormName(e.target.value);
                updateNodeData(fields);
            }}
            className="bg-transparent border-none outline-none text-sm font-semibold text-text-main w-[150px] focus:border-b focus:border-accent/50 transition-colors"
          />
        </div>
        <Database size={14} className="text-text-main/40" />
      </div>

      {/* Body / Form Preview */}
      <div className="p-4 flex flex-col gap-3">
        {fields.map((f, i) => (
          <div key={f.id} className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-text-main/70 uppercase tracking-wider pl-1">
              {f.name}
            </label>
            <input 
              type={f.type} 
              placeholder={f.placeholder}
              onChange={(e) => handleFieldChange(f.id, e.target.value)}
              className="w-full bg-background border border-text-main/20 rounded-lg px-3 py-2 text-xs outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all text-text-main"
            />
          </div>
        ))}

        <button className="w-full mt-2 py-2 bg-accent/10 hover:bg-accent/20 text-accent text-xs font-semibold rounded-lg transition-colors border border-accent/20 flex items-center justify-center gap-2">
          <Settings size={12} />
          <span>Add Field</span>
        </button>
      </div>

      {/* Toolbar actions visible on hover */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 border border-text-main/10 rounded-lg p-1 shadow-md pointer-events-none group-hover:pointer-events-auto z-10 after:content-[''] after:absolute after:-bottom-4 after:left-0 after:w-full after:h-4">
        <button 
          onClick={deleteNode}
          className="p-1.5 text-text-main/60 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
          title="Delete Form Node"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </motion.div>
  );
};
