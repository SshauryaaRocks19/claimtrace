"use client";
import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom node component that pulses if it's part of a fraud ring
function CustomNode({ data }: { data: any }) {
  const isRing = !!data.ringId;
  const pulseClass = isRing ? 'animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)] border-red-500' : 'border-gray-700';
  
  let bgClass = 'bg-gray-800';
  let sizeClass = 'p-2 text-xs';
  
  switch(data.type) {
    case 'attorney':
      bgClass = 'bg-red-950/80 text-red-200';
      sizeClass = 'p-4 text-base font-bold min-w-[150px]';
      break;
    case 'clinic':
      bgClass = 'bg-orange-950/80 text-orange-200';
      sizeClass = 'p-3 text-sm font-semibold min-w-[120px]';
      break;
    case 'repair_shop':
      bgClass = 'bg-yellow-950/80 text-yellow-200';
      sizeClass = 'p-2 text-xs min-w-[100px]';
      break;
    case 'claim':
      bgClass = 'bg-blue-950/80 text-blue-200';
      sizeClass = 'p-1 px-3 text-[11px] rounded-full min-w-[80px]';
      break;
  }

  return (
    <div className={`border-2 rounded-lg flex items-center justify-center text-center ${bgClass} ${sizeClass} ${pulseClass} transition-all`}>
      {data.label}
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

// Pre-seeded Demo Data for Ring A
const initialNodes: Node[] = [
  { id: 'att-1', type: 'custom', position: { x: 250, y: 50 }, data: { label: 'Kaplan & Associates', type: 'attorney', ringId: 'Ring-A' } },
  { id: 'clin-1', type: 'custom', position: { x: 50, y: 150 }, data: { label: 'Summit Rehab Clinic', type: 'clinic', ringId: 'Ring-A' } },
  { id: 'rep-1', type: 'custom', position: { x: 450, y: 150 }, data: { label: 'QuickFix Auto Body', type: 'repair_shop', ringId: 'Ring-A' } },
  { id: 'clm-1', type: 'custom', position: { x: 150, y: 300 }, data: { label: 'CLM-9901', type: 'claim', ringId: 'Ring-A' } },
  { id: 'clm-2', type: 'custom', position: { x: 350, y: 300 }, data: { label: 'CLM-9905', type: 'claim', ringId: 'Ring-A' } },
  // Unrelated safe claim to show contrast
  { id: 'att-2', type: 'custom', position: { x: 700, y: 50 }, data: { label: 'Smith & Doe', type: 'attorney' } },
  { id: 'clin-2', type: 'custom', position: { x: 700, y: 150 }, data: { label: 'City Hospital', type: 'clinic' } },
  { id: 'clm-3', type: 'custom', position: { x: 700, y: 300 }, data: { label: 'CLM-9903', type: 'claim' } },
];

const initialEdges: Edge[] = [
  // Ring A connections
  { id: 'e1', source: 'att-1', target: 'clm-1', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
  { id: 'e2', source: 'clin-1', target: 'clm-1', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
  { id: 'e3', source: 'rep-1', target: 'clm-1', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
  { id: 'e4', source: 'att-1', target: 'clm-2', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
  { id: 'e5', source: 'clin-1', target: 'clm-2', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
  { id: 'e6', source: 'rep-1', target: 'clm-2', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
  // Safe claim connections
  { id: 'e7', source: 'att-2', target: 'clm-3', style: { stroke: '#4b5563' } },
  { id: 'e8', source: 'clin-2', target: 'clm-3', style: { stroke: '#4b5563' } },
];

export function EntityNetwork() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="w-full h-[600px] border border-gray-800 rounded-lg overflow-hidden bg-gray-950/80 relative">
      <div className="absolute top-4 left-4 z-10 bg-gray-900/90 p-3 rounded-lg border border-gray-800 text-sm">
        <h3 className="font-bold text-gray-200 mb-2">Legend</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded"></div><span className="text-gray-400">Attorney</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded"></div><span className="text-gray-400">Clinic</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded"></div><span className="text-gray-400">Repair Shop</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-gray-400">Claim</span></div>
        </div>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-950"
      >
        <Controls className="bg-gray-900 border-gray-800 fill-gray-400 text-gray-400" />
        <MiniMap nodeStrokeColor="#374151" nodeColor="#1f2937" maskColor="rgba(0, 0, 0, 0.5)" />
        <Background color="#374151" gap={16} />
      </ReactFlow>
    </div>
  );
}
