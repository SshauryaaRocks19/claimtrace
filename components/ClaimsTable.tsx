"use client";

import { useEffect, useState } from "react";
import { Claim } from "@/lib/types";
import { RiskLevelBadge } from "./RiskScoreBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClaimsTable({ 
  onInvestigate, 
  additionalClaims = [] 
}: { 
  onInvestigate?: (claim: Claim) => void,
  additionalClaims?: Claim[]
}) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClaims() {
      try {
        const res = await fetch("/api/claims");
        const data = await res.json();
        if (Array.isArray(data)) {
          setClaims(data);
        } else {
          console.error("API did not return an array:", data);
          setClaims([]);
        }
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
      case "ESCALATED": return <AlertCircle className="w-4 h-4 text-destructive mr-2" />;
      default: return <span className="w-4 h-4 rounded-full border border-border mr-2" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 border border-border bg-card/50 rounded-md">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-card/50 overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="font-medium text-muted-foreground">Claim ID</TableHead>
            <TableHead className="font-medium text-muted-foreground">Date</TableHead>
            <TableHead className="font-medium text-muted-foreground">Attorney</TableHead>
            <TableHead className="font-medium text-muted-foreground">Provider</TableHead>
            <TableHead className="font-medium text-muted-foreground">Amount</TableHead>
            <TableHead className="font-medium text-muted-foreground text-center">Risk</TableHead>
            <TableHead className="font-medium text-muted-foreground">Status</TableHead>
            <TableHead className="font-medium text-muted-foreground text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...additionalClaims, ...claims]
            .sort((a, b) => {
              // Bubble highest risk scores to the top. If undefined (still processing), put it at the very top.
              const scoreA = a.riskScore ?? 999;
              const scoreB = b.riskScore ?? 999;
              return scoreB - scoreA;
            })
            .map((claim) => (
            <TableRow key={claim.id} className="border-border hover:bg-muted/50 transition-colors">
              <TableCell className="font-mono text-xs font-medium text-primary">{claim.id}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{new Date(claim.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-foreground font-medium">{claim.attorneyName}</TableCell>
              <TableCell className="text-foreground">{claim.medicalProvider}</TableCell>
              <TableCell className="text-foreground">${claim.totalClaimAmount.toLocaleString()}</TableCell>
              <TableCell className="text-center">
                {claim.riskLevel ? (
                  <RiskLevelBadge level={claim.riskLevel} />
                ) : (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Scoring...</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {getStatusIcon(claim.status)}
                  <span className="text-sm font-medium text-foreground">{claim.status}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-primary/50 text-primary hover:bg-primary/10"
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
