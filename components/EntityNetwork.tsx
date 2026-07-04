"use client";
import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeProps,
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { transformGraphData, APIResponse } from '@/lib/graphData';
import { Loader2, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- CUSTOM NODE COMPONENT ---
function CustomNode({ data }: NodeProps) {
  const isRing = !!data.ringId;
  const isLive = !!data.isLive;
  
  let pulseClass = isRing ? 'shadow-[0_0_15px_rgba(239,68,68,0.3)] border-red-500/50' : 'border-border/50';
  if (isLive) {
    pulseClass = 'animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.6)] border-blue-500 ring-2 ring-blue-400';
  }

  let bgClass = 'bg-card text-foreground';
  let sizeClass = 'p-2 text-xs min-w-[100px]';
  
  switch(data.type) {
    case 'attorney':
      bgClass = 'bg-red-950/40 text-red-400 font-bold';
      sizeClass = 'p-4 text-base min-w-[160px]';
      break;
    case 'clinic':
      bgClass = 'bg-orange-950/40 text-orange-400 font-semibold';
      sizeClass = 'p-3 text-sm min-w-[130px]';
      break;
    case 'repair_shop':
      bgClass = 'bg-yellow-950/40 text-yellow-400';
      sizeClass = 'p-2 text-xs min-w-[110px]';
      break;
    case 'claim':
      bgClass = data.isFraud ? 'bg-red-950/60 text-red-300' : 'bg-muted text-foreground';
      sizeClass = 'p-1 px-3 text-[10px] rounded-full min-w-[60px]';
      if (isLive) {
        bgClass = 'bg-blue-900 text-blue-200 font-bold';
        sizeClass = 'p-2 px-4 text-xs rounded-full min-w-[100px]';
      }
      break;
  }

  return (
    <div className={`border-2 rounded-lg flex items-center justify-center text-center backdrop-blur-sm ${bgClass} ${sizeClass} ${pulseClass} transition-all`}>
      {data.label}
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

// --- HELPER COMPONENT FOR ZOOM ---
function FitViewOnFilter({ activeFilter }: { activeFilter: string }) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    // Wait for nodes to update visibility, then animate zoom
    const timer = setTimeout(() => {
      fitView({ padding: 0.2, duration: 800 });
    }, 50);
    return () => clearTimeout(timer);
  }, [activeFilter, fitView]);

  return null;
}

// --- MAIN COMPONENT ---
export function EntityNetwork() {
  const [apiData, setApiData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newClaim, setNewClaim] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [selectedNodeData, setSelectedNodeData] = useState<any>(null);

  // 1. Fetch Data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/network');
      if (!res.ok) throw new Error('Failed to fetch network data');
      const data = await res.json();
      setApiData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Check for a recently analyzed claim
    const storedClaim = localStorage.getItem("claimtrace_recent_claim");
    if (storedClaim) {
      try {
        setNewClaim(JSON.parse(storedClaim));
      } catch (e) {}
    }
  }, []);

  // 2. Transform API Response to Graph Elements (Memoized)
  const { rawNodes, rawEdges } = useMemo(() => {
    const { nodes, edges } = transformGraphData(apiData, newClaim);
    return { rawNodes: nodes, rawEdges: edges };
  }, [apiData, newClaim]);

  // 3. Apply Filters Client-Side
  const filteredNodes = useMemo(() => {
    return rawNodes.map(node => {
      let hidden = false;
      if (activeFilter === "NEW" && !node.data.isLive) hidden = true;
      else if (activeFilter !== "ALL" && activeFilter !== "NEW" && node.data.ringId !== activeFilter) hidden = true;
      return { ...node, hidden };
    });
  }, [rawNodes, activeFilter]);

  const filteredEdges = useMemo(() => {
    const visibleNodeIds = new Set(filteredNodes.filter(n => !n.hidden).map(n => n.id));
    return rawEdges.map(edge => ({
      ...edge,
      hidden: !visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target)
    }));
  }, [rawEdges, filteredNodes]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNodeData(node.data);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeData(null);
  }, []);

  // Simulate Live Claim Action
  const handleSimulate = () => {
    setNewClaim({
      attorneyName: "Kaplan",
      medicalProvider: "Summit",
      repairShop: "QuickFix",
      totalClaimAmount: 16500,
      incidentState: "SC",
      injuryNarrative: "Simulated live claim submission."
    });
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-card/50">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">Querying Cognee Graph...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-card/50 text-destructive gap-4">
        <AlertCircle className="w-10 h-10" />
        <p className="font-semibold">{error}</p>
        <Button onClick={fetchData} variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> Retry</Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Top Bar: Filters & Actions */}
      <div className="p-4 border-b border-border bg-card flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-muted-foreground mr-2" />
          {["ALL", "A", "B", "C", "NEW"].map(filter => (
            <Button 
              key={filter} 
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter)}
            >
              {filter === "ALL" ? "All" : filter === "NEW" ? "Live Claim" : `Ring ${filter}`}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSimulate}>Simulate Live Claim</Button>
          <Button variant="ghost" size="icon" onClick={fetchData}><RefreshCw className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative bg-background">
        {/* React Flow Canvas */}
        <div className="flex-1 h-full">
          <ReactFlowProvider>
            <FitViewOnFilter activeFilter={activeFilter} />
            <ReactFlow
              nodes={filteredNodes}
              edges={filteredEdges}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              fitView
              minZoom={0.1}
              maxZoom={1.5}
              defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
            >
              <Controls className="bg-card border-border fill-foreground text-foreground" />
              <MiniMap 
                nodeStrokeColor="var(--border)" 
                nodeColor={(node) => (node.data.type === 'attorney' ? '#ef4444' : node.data.type === 'clinic' ? '#f97316' : 'var(--card)')} 
                maskColor="rgba(0, 0, 0, 0.4)" 
                className="bg-card border border-border"
              />
              <Background color="var(--border)" gap={20} size={1} />
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {/* Detail Panel */}
        {selectedNodeData && (
          <div className="w-80 h-full bg-card border-l border-border p-6 overflow-y-auto animate-in slide-in-from-right shadow-2xl z-10 absolute right-0">
            <h3 className="text-xl font-bold mb-1 text-foreground">{selectedNodeData.label}</h3>
            <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded uppercase tracking-wider mb-6">
              {selectedNodeData.type}
            </span>

            {selectedNodeData.type === 'claim' ? (
              <div className="space-y-4">
                {selectedNodeData.isFraud && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md font-medium">
                    CONFIRMED FRAUD
                  </div>
                )}
                {selectedNodeData.ringId && (
                  <div><p className="text-xs text-muted-foreground uppercase">Ring Affiliation</p><p className="font-semibold">Ring {selectedNodeData.ringId}</p></div>
                )}
                <div><p className="text-xs text-muted-foreground uppercase">Amount</p><p className="text-lg font-bold">${Number(selectedNodeData.amount).toLocaleString()}</p></div>
                <div><p className="text-xs text-muted-foreground uppercase">State</p><p>{selectedNodeData.state}</p></div>
                <div><p className="text-xs text-muted-foreground uppercase">Narrative Preview</p><p className="text-sm mt-1 text-muted-foreground">{selectedNodeData.narrativePreview || selectedNodeData.injuryNarrative}</p></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div><p className="text-xs text-muted-foreground uppercase">Total Claims</p><p className="text-2xl font-bold">{selectedNodeData.claimCount}</p></div>
                <div><p className="text-xs text-muted-foreground uppercase">Confirmed Fraud</p><p className="text-2xl font-bold text-destructive">{selectedNodeData.fraudCount}</p></div>
                <div><p className="text-xs text-muted-foreground uppercase">Avg Claim Amount</p><p className="font-medium">${Number(selectedNodeData.avgClaimAmount).toLocaleString()}</p></div>
                {selectedNodeData.states && (
                  <div><p className="text-xs text-muted-foreground uppercase">Operating States</p><div className="flex gap-1 mt-1">{selectedNodeData.states.map((s: string) => <span key={s} className="px-2 py-1 bg-muted rounded text-xs">{s}</span>)}</div></div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
