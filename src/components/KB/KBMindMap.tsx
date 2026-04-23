import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, Save, Trash2, RotateCcw, Box, LayoutTemplate } from 'lucide-react';
import { CustomNode } from './CustomNode';
import { FormNode } from './FormNode';
import { CustomEdge } from './CustomEdge';
import type { GraphData } from '../../utils/kb-graph';

const nodeTypes = {
  customNode: CustomNode,
  formNode: FormNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

interface KBMindMapProps {
  data: GraphData;
}

const FlowEditor: React.FC<KBMindMapProps> = ({ data }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(data.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data.edges);
  const { screenToFlowPosition } = useReactFlow();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Load from local storage on mount
  useEffect(() => {
    const savedGraph = localStorage.getItem('kb-graph-data');
    if (savedGraph) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedGraph);
        if (savedNodes && savedNodes.length > 0) setNodes(savedNodes);
        if (savedEdges && savedEdges.length > 0) setEdges(savedEdges);
      } catch (e) {
        console.error('Failed to parse saved graph data', e);
      }
    }
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, type: 'customEdge', animated: true, style: { stroke: '#6366f1', strokeWidth: 1.5 } }, eds)),
    [setEdges]
  );

  const onSave = useCallback(() => {
    localStorage.setItem('kb-graph-data', JSON.stringify({ nodes, edges }));
    alert('图表已保存到本地存储 (LocalStorage) / Graph saved to local storage!');
  }, [nodes, edges]);
  
  const onClear = useCallback(() => {
    if (window.confirm('确定要清空画布吗？ Are you sure you want to clear the graph?')) {
      setNodes([]);
      setEdges([]);
      localStorage.removeItem('kb-graph-data');
    }
  }, [setNodes, setEdges]);

  const onReset = useCallback(() => {
    if (window.confirm('确定要恢复为知识库中的默认数据吗？ Restore original?')) {
      setNodes(data.nodes);
      setEdges(data.edges);
      localStorage.removeItem('kb-graph-data');
    }
  }, [data.nodes, data.edges, setNodes, setEdges]);

  // Handle Drag & Drop from Toolbox
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // Project the pixel coordinates to React Flow coordinates
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9);
      
      const newNode: Node = {
        id: newId,
        type,
        position,
        data: { label: type === 'formNode' ? 'Registration Form' : 'New Component' },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  const spawnNodeToCenter = (type: string) => {
      const position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9);
      const newNode: Node = {
        id: newId,
        type,
        position,
        data: { label: type === 'formNode' ? 'My Form' : 'New Concept' },
      };
      setNodes((nds) => nds.concat(newNode));
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-full h-full relative text-text-main flex" style={{ width: '100vw', height: '100vh' }} ref={wrapperRef}>
      
      {/* Toolbox Panel (Left) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-[200px] bg-background/80 backdrop-blur-xl border border-text-main/15 shadow-2xl rounded-2xl p-4 flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-main/50 mb-2">Components</h3>
        
        <div 
          className="flex flex-col items-center justify-center p-4 border border-dashed border-text-main/30 rounded-xl bg-background/50 hover:bg-accent/5 hover:border-accent hover:text-accent cursor-grab transition-all group"
          onDragStart={(event) => onDragStart(event, 'customNode')}
          onClick={() => spawnNodeToCenter('customNode')}
          draggable
          title="Drag or click to add"
        >
          <Box size={24} className="mb-2 text-text-main/60 group-hover:text-accent" />
          <span className="text-xs font-medium">Text Node</span>
        </div>

        <div 
          className="flex flex-col items-center justify-center p-4 border border-dashed border-text-main/30 rounded-xl bg-background/50 hover:bg-accent/5 hover:border-accent hover:text-accent cursor-grab transition-all group"
          onDragStart={(event) => onDragStart(event, 'formNode')}
          onClick={() => spawnNodeToCenter('formNode')}
          draggable
          title="Drag or click to add a form node"
        >
          <LayoutTemplate size={24} className="mb-2 text-text-main/60 group-hover:text-accent" />
          <span className="text-xs font-medium">Form Node</span>
        </div>
      </div>

      {/* Main Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <Background gap={16} size={1} color="rgba(150, 150, 150, 0.1)" />
        <Controls className="!bg-background/80 !backdrop-blur-md !border-text-main/10 !shadow-lg [&>button]:!border-text-main/10 [&>button]:!text-text-main hover:[&>button]:!text-accent" />
        <Panel position="top-right" className="flex items-center gap-1 m-4 bg-background/80 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-text-main/10">
          <button 
            onClick={onSave} 
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-text-main hover:text-accent hover:bg-accent/10 rounded-lg transition-colors cursor-pointer"
            title="保存更改 / Save Changes"
          >
            <Save size={16} />
            <span className="hidden sm:inline">保存</span>
          </button>
          <div className="w-px h-5 bg-text-main/10 mx-1"></div>
          <button 
            onClick={onReset} 
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-text-main hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors cursor-pointer"
            title="恢复初始 / Restore Original"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">恢复为默认</span>
          </button>
          <div className="w-px h-5 bg-text-main/10 mx-1"></div>
          <button 
            onClick={onClear} 
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
            title="清空画布 / Clear Canvas"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">清空</span>
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export const KBMindMap: React.FC<KBMindMapProps> = (props) => {
  return (
    <ReactFlowProvider>
      <FlowEditor {...props} />
    </ReactFlowProvider>
  );
};
