"use client";

import { useState } from "react";
import { ClaimsTable } from "@/components/ClaimsTable";
import { MemoryAccuracyChart } from "@/components/MemoryAccuracyChart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Network, Upload, LineChart as LineChartIcon, ChevronDown, ChevronUp } from "lucide-react";
import { RiskBriefPanel } from "@/components/RiskBriefPanel";
import { Claim } from "@/lib/types";
import Papa from "papaparse";

export default function QueuePage() {
  const [investigatingClaim, setInvestigatingClaim] = useState<Claim | null>(null);
  const [uploadedClaims, setUploadedClaims] = useState<Claim[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isChartVisible, setIsChartVisible] = useState(false);

  const handleInvestigate = (claim: Claim) => {
    setInvestigatingClaim(claim);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        // Map CSV rows to Claim objects
        const newClaims: Claim[] = results.data.map((row: any, index) => ({
          id: row.policy_number || `UP-${Date.now()}-${index}`,
          attorneyName: row.attorney_name || "Unknown",
          medicalProvider: row.medical_provider || "Unknown",
          repairShop: row.repair_shop || "Unknown",
          incidentState: row.incident_state || "Unknown",
          incidentType: row.incident_type || "Unknown",
          incidentSeverity: row.incident_severity || "Unknown",
          totalClaimAmount: Number(row.total_claim_amount) || 0,
          injuryNarrative: row.injury_narrative || "",
          status: "PENDING",
          createdAt: new Date().toISOString(),
          riskScore: undefined,
          riskLevel: undefined,
        }));

        // Instantly display them in the UI with a "PENDING" or loading risk state
        setUploadedClaims(prev => [...newClaims, ...prev]);

        // Evaluate each claim sequentially to respect the Gemini API rate limit (5 RPM)
        for (let i = 0; i < newClaims.length; i++) {
          const claim = newClaims[i];
          try {
            const res = await fetch("/api/evaluate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ claim }),
            });
            
            if (res.status === 429) {
              console.warn("Rate limited by Gemini. Pausing for a few seconds...");
              await new Promise(r => setTimeout(r, 10000)); // Pause 10 seconds if rate limited
              i--; // Retry the same claim
              continue;
            }

            const evaluation = await res.json();
            
            // Update the specific claim with its new risk score
            setUploadedClaims(prevClaims => {
              const updated = [...prevClaims];
              const idx = updated.findIndex(c => c.id === claim.id);
              if (idx !== -1) {
                updated[idx] = {
                  ...updated[idx],
                  riskScore: evaluation.risk_score,
                  riskLevel: evaluation.risk_level,
                  status: evaluation.risk_score > 75 ? "FLAGGED" : "PENDING"
                };
              }
              return updated;
            });
          } catch (err) {
            console.error(`Failed to evaluate claim ${claim.id}`, err);
          }
        }
        
        setIsImporting(false);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        setIsImporting(false);
      }
    });
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Claims Queue</h1>
          <p className="text-muted-foreground">Review pending insurance claims and assess fraud risk.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/network">
            <Button variant="outline">
              <Network className="w-4 h-4 mr-2" />
              Entity Network
            </Button>
          </Link>
          <div className="relative">
            <input 
              type="file" 
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isImporting}
            />
            <Button variant="outline" className="pointer-events-none">
              <Upload className="w-4 h-4 mr-2" />
              {isImporting ? "Processing..." : "Import CSV"}
            </Button>
          </div>
          <Link href="/claims/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Claim
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mb-8">
        <Button 
          variant="outline" 
          onClick={() => setIsChartVisible(!isChartVisible)}
          className="w-full flex items-center justify-between mb-4 border-border/50 text-muted-foreground hover:text-foreground"
        >
          <span className="flex items-center gap-2">
            <LineChartIcon className="w-4 h-4" />
            Memory Accuracy Timeline
          </span>
          {isChartVisible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
        
        {isChartVisible && (
          <div className="animate-in slide-in-from-top-4 fade-in duration-300">
            <MemoryAccuracyChart />
          </div>
        )}
      </div>

      <ClaimsTable onInvestigate={handleInvestigate} additionalClaims={uploadedClaims} />

      <RiskBriefPanel 
        isOpen={!!investigatingClaim} 
        onClose={() => setInvestigatingClaim(null)}
        claimId={investigatingClaim?.id || null}
        entities={investigatingClaim ? {
          attorney: investigatingClaim.attorneyName,
          clinic: investigatingClaim.medicalProvider,
          narrative: investigatingClaim.injuryNarrative
        } : null}
      />
    </div>
  );
}
