"use client";

import { useEffect, useState } from "react";
import { Claim } from "@/lib/types";
import { RiskLevelBadge } from "./RiskScoreBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClaimsTable({ onInvestigate }: { onInvestigate?: (claim: Claim) => void }) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClaims() {
      try {
        const res = await fetch("/api/claims");
        const data = await res.json();
        setClaims(data);
      } catch (error) {
        console.error("Failed to fetch claims:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchClaims();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED": return <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />;
      case "FLAGGED": return <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />;
      case "ESCALATED": return <AlertCircle className="w-4 h-4 text-red-500 mr-2" />;
      default: return <span className="w-4 h-4 rounded-full border border-gray-600 mr-2" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 border border-gray-800 bg-gray-900/50 rounded-md">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

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
            <TableHead className="font-medium text-gray-400 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.map((claim) => (
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
              <TableCell className="text-right">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="bg-emerald-950/30 text-emerald-400 border-emerald-900/50 hover:bg-emerald-900 hover:text-emerald-100"
                  onClick={() => onInvestigate?.(claim)}
                >
                  Investigate
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
