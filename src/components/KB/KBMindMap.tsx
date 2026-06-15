import React, { useEffect, useRef } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomNode } from './CustomNode';
import { CustomEdge } from './CustomEdge';
import type { GraphData } from '../../utils/kb-graph';

const nodeTypes = {
  customNode: CustomNode,
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
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync nodes and edges when default data changes
  useEffect(() => {
    setNodes(data.nodes);
    setEdges(data.edges);
  }, [data, setNodes, setEdges]);

  return (
    <div className="w-full h-full relative text-text-main flex" style={{ width: '100vw', height: '100vh' }} ref={wrapperRef}>
      {/* Main Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background gap={16} size={1} color="rgba(150, 150, 150, 0.1)" />
        <Controls className="!bg-background/80 !backdrop-blur-md !border-text-main/10 !shadow-lg [&>button]:!border-text-main/10 [&>button]:!text-text-main hover:[&>button]:!text-accent" />
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
