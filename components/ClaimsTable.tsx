import { Claim } from "@/lib/types";
import { RiskLevelBadge } from "./RiskScoreBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

export const DEMO_CLAIMS: Claim[] = [
  {
    id: "CLM-9901",
    attorneyName: "Kaplan & Associates",
    medicalProvider: "Summit Rehab Clinic",
    repairShop: "QuickFix Auto Body",
    incidentState: "SC",
    incidentType: "Rear-end Collision",
    incidentSeverity: "Moderate",
    totalClaimAmount: 14500,
    injuryNarrative: "Patient reports severe whiplash and lower back pain following rear-end collision at stoplight. Requires 6 weeks physical therapy.",
    status: "PENDING",
    createdAt: "2026-07-01T10:23:00Z",
  },
  {
    id: "CLM-9902",
    attorneyName: "Meridian Legal Group",
    medicalProvider: "FastTrack Medical Center",
    repairShop: "Precision Collision Center",
    incidentState: "NY",
    incidentType: "Intersection T-Bone",
    incidentSeverity: "Severe",
    totalClaimAmount: 32000,
    injuryNarrative: "Multiple contusions and suspected hairline fracture of the left wrist. Recommending MRI and extended chiropractic care.",
    status: "ESCALATED",
    riskScore: 92,
    riskLevel: "CRITICAL",
    createdAt: "2026-07-01T11:45:00Z",
  },
  {
    id: "CLM-9903",
    attorneyName: "Smith & Doe",
    medicalProvider: "City Hospital",
    repairShop: "Bob's Garage",
    incidentState: "TX",
    incidentType: "Fender Bender",
    incidentSeverity: "Minor",
    totalClaimAmount: 2100,
    injuryNarrative: "Minor neck stiffness, resolved after 2 days. No ongoing treatment required.",
    status: "APPROVED",
    riskScore: 12,
    riskLevel: "LOW",
    createdAt: "2026-07-01T14:12:00Z",
  },
  {
    id: "CLM-9904",
    attorneyName: "Coastal Injury Law",
    medicalProvider: "Premier Wellness Center",
    repairShop: "Elite Auto Repair",
    incidentState: "OH",
    incidentType: "Sideswipe",
    incidentSeverity: "Moderate",
    totalClaimAmount: 18500,
    injuryNarrative: "Client suffering from severe anxiety and muscular spasms in the cervical spine. Prescribed 12 sessions of deep tissue massage.",
    status: "FLAGGED",
    riskScore: 78,
    riskLevel: "HIGH",
    createdAt: "2026-07-02T09:05:00Z",
  },
  {
    id: "CLM-9905",
    attorneyName: "Kaplan & Associates",
    medicalProvider: "Summit Rehab Clinic",
    repairShop: "QuickFix Auto Body",
    incidentState: "NC",
    incidentType: "Rear-end Collision",
    incidentSeverity: "Moderate",
    totalClaimAmount: 15200,
    injuryNarrative: "Patient reports severe whiplash and lower back pain following rear-end collision on highway. Requires 8 weeks physical therapy.",
    status: "PENDING",
    createdAt: "2026-07-02T10:30:00Z",
  }
];

export function ClaimsTable() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED": return <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />;
      case "FLAGGED": return <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />;
      case "ESCALATED": return <AlertCircle className="w-4 h-4 text-red-500 mr-2" />;
      default: return null;
    }
  };

  return (
    <div className="rounded-md border border-gray-800 bg-gray-900/50 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-900">
          <TableRow className="border-gray-800 hover:bg-transparent">
            <TableHead className="font-medium text-gray-400">Claim ID</TableHead>
            <TableHead className="font-medium text-gray-400">Date</TableHead>
            <TableHead className="font-medium text-gray-400">Attorney</TableHead>
            <TableHead className="font-medium text-gray-400">Provider</TableHead>
            <TableHead className="font-medium text-gray-400">Amount</TableHead>
            <TableHead className="font-medium text-gray-400 text-center">Risk</TableHead>
            <TableHead className="font-medium text-gray-400">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DEMO_CLAIMS.map((claim) => (
            <TableRow key={claim.id} className="border-gray-800 hover:bg-gray-800/50 transition-colors">
              <TableCell className="font-mono text-xs font-medium text-blue-400">{claim.id}</TableCell>
              <TableCell className="text-gray-400 text-sm">{new Date(claim.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-gray-300 font-medium">{claim.attorneyName}</TableCell>
              <TableCell className="text-gray-300">{claim.medicalProvider}</TableCell>
              <TableCell className="text-gray-300">${claim.totalClaimAmount.toLocaleString()}</TableCell>
              <TableCell className="text-center">
                {claim.riskLevel ? <RiskLevelBadge level={claim.riskLevel} /> : <span className="text-gray-600">-</span>}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {getStatusIcon(claim.status)}
                  <span className="text-sm font-medium text-gray-300">{claim.status}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
