export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ClaimStatus = "PENDING" | "APPROVED" | "FLAGGED" | "ESCALATED";

export interface Claim {
  id: string;
  attorneyName: string;
  medicalProvider: string;
  repairShop: string;
  incidentState: string;
  incidentType: string;
  incidentSeverity: string;
  totalClaimAmount: number;
  injuryNarrative: string;
  fraudConfirmed?: boolean;
  status: ClaimStatus;
  riskScore?: number;
  riskLevel?: RiskLevel;
  createdAt: string;
}

export interface RiskBrief {
  risk_score: number;
  risk_level: RiskLevel;
  entity_alerts: string[];
  pattern_matches: string[];
  recommended_action: "APPROVE" | "FLAG_FOR_REVIEW" | "ESCALATE_TO_FRAUD_UNIT";
  summary: string;
}

export interface RecalledClaim {
  claim_id: string;
  attorney_name: string;
  medical_provider: string;
  fraud_confirmed: boolean;
  total_claim_amount: number;
  score: number;
}

export interface EntityNode {
  id: string;
  type: "attorney" | "clinic" | "repair_shop" | "claim";
  label: string;
  fraudCount?: number;
  claimCount?: number;
  ringId?: string;
}
