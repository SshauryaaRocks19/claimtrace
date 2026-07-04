import { Node, Edge } from '@xyflow/react';

export type APIEntity = {
  id: string;
  type: "attorney" | "clinic" | "repair_shop";
  label: string;
  claimCount: number;
  fraudCount: number;
  ringId: "A" | "B" | "C" | null;
  states: string[];
  avgClaimAmount: number;
};

export type APIClaim = {
  id: string;
  attorneyId: string;
  clinicId: string;
  repairShopId: string;
  isFraud: boolean;
  ringId: "A" | "B" | "C" | null;
  amount: number;
  state: string;
  narrativePreview: string;
};

export type APIResponse = {
  entities: APIEntity[];
  claims: APIClaim[];
  rings: any[];
};

export function transformGraphData(apiData: APIResponse | null, newClaim?: any): { nodes: Node[], edges: Edge[] } {
  if (!apiData) return { nodes: [], edges: [] };

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Manual Layout Anchor Points (X, Y)
  const ringAnchors = {
    "A": { x: 200, y: 300 },
    "B": { x: 800, y: 300 },
    "C": { x: 1400, y: 300 },
    "null": { x: 800, y: 800 } // Safe entities go lower
  };

  // 1. Generate Entity Nodes
  apiData.entities.forEach((entity) => {
    const anchor = ringAnchors[entity.ringId || "null"];
    let offsetX = 0;
    let offsetY = 0;
    
    // Position entities relative to their ring anchor
    if (entity.type === "attorney") { offsetX = 0; offsetY = -100; }
    if (entity.type === "clinic") { offsetX = -100; offsetY = 100; }
    if (entity.type === "repair_shop") { offsetX = 100; offsetY = 100; }

    nodes.push({
      id: entity.id,
      type: 'custom',
      position: { x: anchor.x + offsetX, y: anchor.y + offsetY },
      data: { ...entity, isLive: false }
    });
  });

  // Track claim offsets within rings for fanning out
  const ringClaimCounts = { "A": 0, "B": 0, "C": 0, "null": 0 };

  // 2. Generate Claim Nodes and Edges
  apiData.claims.forEach((claim) => {
    const rId = claim.ringId || "null";
    const anchor = ringAnchors[rId];
    const index = ringClaimCounts[rId]++;
    
    let claimX = anchor.x;
    let claimY = anchor.y;

    // Fanning logic based on Ring
    if (rId === "A") {
      // Fan out to the left
      claimX = anchor.x - 300 - (index % 3) * 50;
      claimY = anchor.y - 150 + (index * 25);
    } else if (rId === "B") {
      // Fan upward
      claimX = anchor.x - 150 + (index * 20);
      claimY = anchor.y - 300 - (index % 3) * 50;
    } else if (rId === "C") {
      // Fan out to the right
      claimX = anchor.x + 300 + (index % 3) * 50;
      claimY = anchor.y - 150 + (index * 25);
    } else {
      // Safe claims
      claimX = anchor.x - 200 + (index * 40);
      claimY = anchor.y + 150;
    }

    nodes.push({
      id: claim.id,
      type: 'custom',
      position: { x: claimX, y: claimY },
      data: { ...claim, type: 'claim', label: claim.id, isLive: false }
    });

    // Generate 3 Edges per claim
    const edgeColor = claim.isFraud ? '#ef4444' : '#6b7280';
    
    edges.push({ id: `e-${claim.id}-${claim.attorneyId}`, source: claim.attorneyId, target: claim.id, style: { stroke: edgeColor } });
    edges.push({ id: `e-${claim.id}-${claim.clinicId}`, source: claim.clinicId, target: claim.id, style: { stroke: edgeColor } });
    edges.push({ id: `e-${claim.id}-${claim.repairShopId}`, source: claim.repairShopId, target: claim.id, style: { stroke: edgeColor } });
  });

  // 3. Handle Live Claim Injection
  if (newClaim) {
    const liveClaimId = "live-claim";
    nodes.push({
      id: liveClaimId,
      type: 'custom',
      position: { x: 800, y: 50 }, // Prominent top-center position
      data: { ...newClaim, type: 'claim', label: 'NEW CLAIM', isLive: true }
    });

    // Map new claim text fields to existing entity IDs heuristically for the demo
    const liveEdges = [
      { target: "att-kaplan", type: "attorneyName", search: "Kaplan" },
      { target: "att-sterling", type: "attorneyName", search: "Sterling" },
      { target: "clin-summit", type: "medicalProvider", search: "Summit" },
      { target: "rep-quickfix", type: "repairShop", search: "QuickFix" }
    ];

    liveEdges.forEach(le => {
      const fieldVal = newClaim[le.type];
      if (fieldVal && typeof fieldVal === 'string' && fieldVal.toLowerCase().includes(le.search.toLowerCase())) {
        edges.push({
          id: `e-${liveClaimId}-${le.target}`,
          source: le.target,
          target: liveClaimId,
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 3 }
        });
      }
    });
  }

  return { nodes, edges };
}
