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
import { Loader2, AlertCircle, RefreshCw, Layers, Check, X, ArchiveX, DatabaseZap, Activity, Radar, MessageSquareText, Clock, Lightbulb, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// --- TYPES ---
export type FeedItemType = 'acceleration' | 'emerging' | 'narrative' | 'dormancy' | 'portfolio';

export interface FeedItem {
  id: string;
  type: FeedItemType;
  title: string;
  timeAgo: string;
  content: string;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  borderColor: string;
}

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
      bgClass = 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 font-bold';
      sizeClass = 'p-4 text-base min-w-[160px]';
      break;
    case 'clinic':
      bgClass = 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 font-semibold';
      sizeClass = 'p-3 text-sm min-w-[130px]';
      break;
    case 'repair_shop':
      bgClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-400';
      sizeClass = 'p-2 text-xs min-w-[110px]';
      break;
    case 'claim':
      bgClass = data.isFraud ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300' : 'bg-muted text-foreground';
      sizeClass = 'p-1 px-3 text-[10px] rounded-full min-w-[60px]';
      if (isLive) {
        bgClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-bold';
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
  const [activeTab, setActiveTab] = useState<'feed' | 'details'>('feed');
  
  // Interactive Analysis State
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [liveClaimPosition, setLiveClaimPosition] = useState<{x: number, y: number} | undefined>(undefined);
  const [formData, setFormData] = useState({
    attorneyName: "Kaplan & Associates",
    medicalProvider: "Summit Rehab Clinic",
    repairShop: "QuickFix Auto Body",
    totalClaimAmount: "16500",
    incidentState: "SC",
    injuryNarrative: "Simulated live claim submission."
  });
  
  // Feed State
  const [memoryFeed, setMemoryFeed] = useState<FeedItem[]>([]);
  const [isSimulatingFeed, setIsSimulatingFeed] = useState(false);

  // Simulated Feed Population
  const triggerFeedSimulation = useCallback((isLiveClaim = false, targetRing = 'A') => {
    if (isLiveClaim) {
      setIsSimulatingFeed(true);
      setTimeout(() => {
        let content = '';
        let title = '';
        let borderColor = 'border-red-500';
        
        if (targetRing === 'A') {
          title = 'RING A ACTIVITY DETECTED';
          content = 'Live claim maps perfectly to Ring A pattern. This is the 3rd Ring A claim this session. Pattern strength increasing.';
        } else if (targetRing === 'B') {
          title = 'RING B RE-ACTIVATION ALERT';
          content = 'Live claim maps to Ring B. This breaks the 52-day dormancy period. Immediate investigation recommended.';
        } else {
          title = 'ANOMALY DETECTED';
          content = 'Claim entities do not strongly map to known fraud rings, but share isolated characteristics. Tagged for manual review.';
          borderColor = 'border-yellow-500';
        }

        setMemoryFeed(prev => [{
          id: `feed-live-1-${Date.now()}`,
          type: 'acceleration',
          title,
          timeAgo: 'just now',
          content,
          confidence: targetRing !== 'null' ? 'HIGH' : 'MEDIUM',
          borderColor
        }, ...prev]);
        setIsSimulatingFeed(false);
      }, 1500);
      return;
    }

    // Default Portfolio Simulation (Immediate Load)
    const initialFeed: FeedItem[] = [
      {
        id: `feed-1`,
        type: 'acceleration',
        title: 'RING ACCELERATION',
        timeAgo: 'just now',
        content: 'Ring A claim velocity up 23% vs last 30 days. Kaplan & Associates filed 4 claims this week vs 1.2 weekly avg.',
        confidence: 'HIGH',
        borderColor: 'border-red-500'
      },
      {
        id: `feed-2`,
        type: 'emerging',
        title: 'EMERGING PATTERN',
        timeAgo: '2 min ago',
        content: 'Summit Rehab Clinic appearing with new attorney "Harbor Legal Services" in 3 recent claims. No ring tag yet. Watch for fourth occurrence.',
        confidence: 'MEDIUM',
        borderColor: 'border-yellow-500'
      },
      {
        id: `feed-3`,
        type: 'narrative',
        title: 'NARRATIVE SIGNAL',
        timeAgo: '4 min ago',
        content: '"Referred to specialist within 48hrs" appears in 68% of confirmed fraud vs 9% of legitimate claims in portfolio. Present in today\'s submission.',
        borderColor: 'border-blue-500'
      },
      {
        id: `feed-4`,
        type: 'dormancy',
        title: 'RING DORMANCY ALERT',
        timeAgo: '1 hr ago',
        content: 'Ring B last active 52 days ago. Historical avg dormancy: 38 days. Statistically overdue for reactivation. Consider proactive monitoring.',
        borderColor: 'border-orange-500'
      },
      {
        id: `feed-5`,
        type: 'portfolio',
        title: 'PORTFOLIO INSIGHT',
        timeAgo: '3 hrs ago',
        content: 'Claims from SC with Major Damage + attorney referral to clinic same day: fraud confirmation rate 84% (n=31). Highest single-pattern predictor.',
        borderColor: 'border-green-500'
      }
    ];

    setMemoryFeed(initialFeed);
  }, []);

  // 1. Fetch Data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/network');
      if (!res.ok) throw new Error('Failed to fetch network data');
      const data = await res.json();
      setApiData(data);
      triggerFeedSimulation(false); // Trigger feed on load
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
    const { nodes, edges } = transformGraphData(apiData, newClaim, liveClaimPosition);
    return { rawNodes: nodes, rawEdges: edges };
  }, [apiData, newClaim, liveClaimPosition]);

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
    setActiveTab('details');
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeData(null);
    setActiveTab('feed');
  }, []);

  // Interactive Analysis Action
  const handleAnalyzeClaim = () => {
    setIsAnalysisModalOpen(false);
    setLiveClaimPosition({ x: 1000, y: -300 }); // Starting position
    
    const submittedClaim = {
      ...formData,
      amount: Number(formData.totalClaimAmount)
    };
    
    // Determine Target Ring
    let targetRing = "A";
    let end = { x: 0, y: 300 }; // Ring A anchor
    
    const attorney = formData.attorneyName.toLowerCase();
    if (attorney.includes("sterling")) {
      targetRing = "B";
      end = { x: 1000, y: 300 }; // Ring B anchor
    } else if (attorney.includes("kaplan")) {
      targetRing = "A";
      end = { x: 0, y: 300 }; // Ring A anchor
    } else {
      targetRing = "null";
      end = { x: 1000, y: 1200 }; // Safe / Unknown zone
    }

    setNewClaim(submittedClaim);
    triggerFeedSimulation(true, targetRing); // Trigger new feed insights
    
    // Start animation towards the determined Ring
    const start = { x: 1000, y: -300 };
    const duration = 2000;
    const frames = 60;
    const stepTime = duration / frames;
    let currentFrame = 0;

    const interval = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / frames;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      
      setLiveClaimPosition({
        x: start.x + (end.x - start.x) * easeProgress,
        y: start.y + (end.y - start.y) * easeProgress,
      });

      if (currentFrame >= frames) {
        clearInterval(interval);
        // Pop open the detail panel for decision
        setSelectedNodeData({
          ...submittedClaim,
          type: 'claim',
          label: 'NEW CLAIM',
          isLive: true,
          showDecision: true
        });
        setActiveTab('details');
      }
    }, stepTime);
  };

  const handleFeedAction = (id: string, actionType: string) => {
    // In production, this would call cognee.improve() or cognee.forget()
    setMemoryFeed(prev => prev.filter(item => item.id !== id));
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

  const getIconForType = (type: string) => {
    switch(type) {
      case 'acceleration': return <Activity className="w-4 h-4 text-red-500" />;
      case 'emerging': return <Radar className="w-4 h-4 text-yellow-500" />;
      case 'narrative': return <MessageSquareText className="w-4 h-4 text-blue-500" />;
      case 'dormancy': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'portfolio': return <Lightbulb className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

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
          <Button variant="default" size="sm" onClick={() => setIsAnalysisModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Play className="w-4 h-4 mr-2" /> Analyze New Claim
          </Button>
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
              <Controls className="fill-foreground text-foreground [&>button]:bg-card [&>button]:border-border [&>button:hover]:bg-accent [&>button>svg]:fill-foreground" />
              <MiniMap 
                nodeColor={(node) => (node.data.type === 'attorney' ? '#ef4444' : node.data.type === 'clinic' ? '#f97316' : '#64748b')} 
                maskColor="rgba(0, 0, 0, 0.6)"
                className="!bg-background !border-border"
              />
              <Background color="var(--border)" gap={20} size={1} />
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {/* Unified Right Panel (Tabs) */}
        <div className="w-[400px] h-full bg-card/95 backdrop-blur-xl border-l border-border flex flex-col relative z-20 shadow-2xl">
          
          {/* Tab Header */}
          <div className="flex border-b border-border bg-muted/30">
            <button 
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'feed' ? 'bg-card text-primary border-b-2 border-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
              onClick={() => setActiveTab('feed')}
            >
              <div className="flex items-center justify-center gap-2">
                <DatabaseZap className="w-4 h-4" />
                Memory Feed
              </div>
            </button>
            <button 
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'details' ? 'bg-card text-primary border-b-2 border-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
              onClick={() => setActiveTab('details')}
              disabled={!selectedNodeData && activeTab !== 'details'}
            >
              <div className="flex items-center justify-center gap-2">
                <Layers className="w-4 h-4" />
                Details
              </div>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto relative">
            
            {/* Memory Feed Tab */}
            {activeTab === 'feed' && (
              <div className="absolute inset-0 p-4 space-y-4 animate-in fade-in duration-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted-foreground uppercase font-semibold">Active Patterns</span>
                  <Button variant="ghost" size="icon" onClick={() => triggerFeedSimulation(false)} disabled={isSimulatingFeed} className="h-6 w-6">
                    <RefreshCw className={`w-3 h-3 ${isSimulatingFeed ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                {memoryFeed.map((item) => (
                  <div key={item.id} className="py-3 border-b border-border/50 animate-in slide-in-from-right fade-in duration-300 last:border-0">
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        {getIconForType(item.type)}
                        <h4 className="font-semibold text-xs text-foreground/90">{item.title}</h4>
                      </div>
                      <span className="text-[10px] text-muted-foreground/70">{item.timeAgo}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                ))}
                {isSimulatingFeed && (
                  <div className="flex items-center justify-center p-4 text-muted-foreground animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-xs">Cognee recalling patterns...</span>
                  </div>
                )}
                {memoryFeed.length === 0 && !isSimulatingFeed && (
                  <div className="text-center p-8 text-muted-foreground text-sm">
                    No active insights. Waiting for new graph events.
                  </div>
                )}
              </div>
            )}

            {/* Node Detail Tab */}
            {activeTab === 'details' && selectedNodeData && (
              <div className="absolute inset-0 p-6 animate-in slide-in-from-right fade-in duration-200">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-foreground">{selectedNodeData.label}</h3>
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded uppercase tracking-wider">
                      {selectedNodeData.type}
                    </span>
                  </div>
                </div>

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

                {selectedNodeData.showDecision && (
                  <div className="mt-8 space-y-3 border-t border-border pt-6">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Investigator Decision</h4>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={() => {
                      setSelectedNodeData(null);
                      setNewClaim(null);
                      setLiveClaimPosition(undefined);
                      setActiveTab('feed');
                    }}>
                      <AlertCircle className="w-4 h-4 mr-2" /> Flag for Investigation
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => {
                      setSelectedNodeData(null);
                      setNewClaim(null);
                      setLiveClaimPosition(undefined);
                      setActiveTab('feed');
                    }}>
                      <Check className="w-4 h-4 mr-2" /> Mark as Safe (False Positive)
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'details' && !selectedNodeData && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm p-8 text-center">
                Select a node on the graph to view its details.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Modal */}
      <Dialog open={isAnalysisModalOpen} onOpenChange={setIsAnalysisModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Analyze New Claim</DialogTitle>
            <DialogDescription>
              Enter the claim details below. Cognee will connect the entities and analyze the fraud risk against its memory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase">Attorney Name</label>
              <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.attorneyName} onChange={e => setFormData({...formData, attorneyName: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase">Medical Provider</label>
              <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.medicalProvider} onChange={e => setFormData({...formData, medicalProvider: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase">Repair Shop</label>
              <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.repairShop} onChange={e => setFormData({...formData, repairShop: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-xs font-semibold uppercase">Amount</label>
                <input type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.totalClaimAmount} onChange={e => setFormData({...formData, totalClaimAmount: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-semibold uppercase">State</label>
                <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.incidentState} onChange={e => setFormData({...formData, incidentState: e.target.value})} />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase">Narrative</label>
              <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.injuryNarrative} onChange={e => setFormData({...formData, injuryNarrative: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleAnalyzeClaim} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Play className="w-4 h-4 mr-2" /> Start AI Analysis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
