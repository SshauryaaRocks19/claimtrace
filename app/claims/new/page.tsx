"use client";
import { useState } from "react";
import { ClaimForm } from "@/components/ClaimForm";
import { RiskBrief } from "@/components/RiskBrief";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Check, X, ShieldAlert } from "lucide-react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { RiskBrief as RiskBriefType } from "@/lib/types";

import { z } from "zod";

export default function NewClaimPage() {
  const [claimId, setClaimId] = useState<string>("CLM-" + Math.floor(Math.random() * 9000 + 1000));
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { object, submit, isLoading } = useObject({
    api: "/api/recall",
    schema: z.object({
      risk_score: z.number().min(0).max(100),
      risk_level: z.string(),
      entity_alerts: z.array(z.string()),
      pattern_matches: z.array(z.string()),
      recommended_action: z.string(),
      summary: z.string(),
    }),
  });

  const onSubmitClaim = (claimData: any) => {
    setIsSubmitted(true);
    submit({ claim: { id: claimId, ...claimData } });
  };

  const handleDecision = async (decision: string) => {
    // Call /api/improve
    await fetch("/api/improve", {
      method: "POST",
      body: JSON.stringify({ claimId, decision, aiWasCorrect: true }),
    });
    alert(`Decision '${decision}' recorded. Knowledge graph updated.`);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/queue">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Analyze New Claim</h1>
          <p className="text-gray-400 text-sm">Submit a claim to generate an AI Risk Brief via Cognee Cloud memory.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Form */}
        <div className="bg-gray-900/40 p-6 rounded-xl border border-gray-800">
          <ClaimForm onSubmit={onSubmitClaim} isLoading={isLoading} />
        </div>

        {/* Right Side: Streaming Brief */}
        <div className="flex flex-col gap-6">
          <div className="bg-gray-900/40 p-6 rounded-xl border border-gray-800 flex-1">
            <RiskBrief data={object as any} isLoading={isLoading || (isSubmitted && !object)} />
          </div>

          {/* Adjuster Action Buttons */}
          {!isLoading && object?.risk_score && (
            <div className="bg-gray-900/40 p-6 rounded-xl border border-gray-800 space-y-4 shadow-xl">
              <h3 className="text-lg font-semibold text-white">Adjuster Decision</h3>
              <p className="text-sm text-gray-400">Record your decision. This feedback loops back into Cognee to improve future recall accuracy.</p>
              <div className="flex gap-4 mt-2">
                <Button onClick={() => handleDecision("APPROVED")} className="bg-green-600 hover:bg-green-500 text-white flex-1">
                  <Check className="w-4 h-4 mr-2" /> Approve
                </Button>
                <Button onClick={() => handleDecision("FLAGGED")} className="bg-orange-600 hover:bg-orange-500 text-white flex-1">
                  <X className="w-4 h-4 mr-2" /> Flag
                </Button>
                <Button onClick={() => handleDecision("ESCALATED")} className="bg-red-600 hover:bg-red-500 text-white flex-1">
                  <ShieldAlert className="w-4 h-4 mr-2" /> Escalate
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
