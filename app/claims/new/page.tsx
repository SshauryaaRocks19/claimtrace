"use client";
import { useState } from "react";
import { ClaimForm } from "@/components/ClaimForm";
import { RiskBrief } from "@/components/RiskBrief";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { ArrowLeft, Check, X, ShieldAlert } from "lucide-react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { RiskBrief as RiskBriefType } from "@/lib/types";
import { useRef } from "react";
import jsPDF from "jspdf";
import { Loader2, Download, Building, MapPin, DollarSign, ActivitySquare, User, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { z } from "zod";

export default function NewClaimPage() {
  const [claimId, setClaimId] = useState<string>("CLM-" + Math.floor(Math.random() * 9000 + 1000));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [isMemoryActive, setIsMemoryActive] = useState(true);
  const briefRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
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
    setSubmittedData(claimData);
    setIsSubmitted(true);
    submit({ claim: { id: claimId, isStatelessMode: !isMemoryActive, ...claimData } });
  };

  const handleDecision = async (decision: string) => {
    // Call /api/improve
    await fetch("/api/improve", {
      method: "POST",
      body: JSON.stringify({ claimId, decision, aiWasCorrect: true }),
    });
    alert(`Decision '${decision}' recorded. Knowledge graph updated.`);
  };

  const downloadPDF = async () => {
    if (!object) return;
    setIsDownloading(true);
    
    try {
      // Create a native A4 PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });

      const margin = 40;
      let y = 60;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const contentWidth = pageWidth - (margin * 2);

      // Header
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text("RISK BRIEF by ClaimTrace", margin, y);
      
      y += 30;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Claim ID: ${claimId}`, margin, y);
      pdf.text(`Date Generated: ${new Date().toLocaleDateString()}`, margin, y + 15);
      
      y += 45;
      
      // Intake Data Section
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("CLAIM DETAILS", margin, y);
      y += 20;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.text(`Attorney: ${submittedData?.attorneyName || "N/A"}`, margin, y);
      y += 15;
      pdf.text(`Medical Provider: ${submittedData?.medicalProvider || "N/A"}`, margin, y);
      y += 15;
      pdf.text(`Repair Shop: ${submittedData?.repairShop || "N/A"}`, margin, y);
      y += 15;
      pdf.text(`Incident State: ${submittedData?.incidentState || "N/A"}`, margin, y);
      y += 15;
      pdf.text(`Total Amount: $${Number(submittedData?.totalClaimAmount || 0).toLocaleString()}`, margin, y);
      y += 20;

      const narrativeLines = pdf.splitTextToSize(`Narrative: ${submittedData?.injuryNarrative || "N/A"}`, contentWidth);
      pdf.text(narrativeLines, margin, y);
      y += (narrativeLines.length * 15) + 15;
      
      // Divider
      pdf.setLineWidth(1);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 20;

      // Risk Score Section
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("RISK ASSESSMENT", margin, y);
      
      y += 20;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.text(`Overall Risk Level: ${object.risk_level?.toUpperCase()} (${object.risk_score}/100)`, margin, y);
      
      y += 35;
      
      // Executive Summary
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("EXECUTIVE SUMMARY", margin, y);
      
      y += 20;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      
      const summaryLines = pdf.splitTextToSize(object.summary || "No summary provided.", contentWidth);
      pdf.text(summaryLines, margin, y);
      y += (summaryLines.length * 15) + 20;

      // Entity Alerts
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("ENTITY ALERTS", margin, y);
      
      y += 20;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      
      if (object.entity_alerts && object.entity_alerts.length > 0) {
        object.entity_alerts.forEach(alert => {
          const alertLines = pdf.splitTextToSize(`• ${alert}`, contentWidth);
          pdf.text(alertLines, margin, y);
          y += (alertLines.length * 15) + 5;
        });
      } else {
        pdf.text("None detected.", margin, y);
        y += 20;
      }
      y += 15;

      // Pattern Matches
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("HISTORICAL PATTERN MATCHES", margin, y);
      
      y += 20;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      
      if (object.pattern_matches && object.pattern_matches.length > 0) {
        object.pattern_matches.forEach(pattern => {
          const patternLines = pdf.splitTextToSize(`• ${pattern}`, contentWidth);
          pdf.text(patternLines, margin, y);
          y += (patternLines.length * 15) + 5;
        });
      } else {
        pdf.text("None detected.", margin, y);
        y += 20;
      }
      y += 15;

      // Recommended Action
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("RECOMMENDED ACTION", margin, y);
      
      y += 20;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      const actionLines = pdf.splitTextToSize(object.recommended_action || "Pending review.", contentWidth);
      pdf.text(actionLines, margin, y);

      // Save
      pdf.save(`ClaimTrace_SIU_Report_${claimId}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/queue">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Analyze New Claim</h1>
          <p className="text-muted-foreground text-sm">Submit a claim to generate an AI Risk Brief via Cognee Cloud memory.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full flex flex-col items-center gap-6"
          >
            <div className="w-full max-w-[1200px] bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 flex items-center justify-between shadow-sm">
              <div>
                <h3 className="font-bold text-foreground">Cognee Memory Layer</h3>
                <p className="text-sm text-muted-foreground mt-1">Toggle to compare a legacy stateless evaluation against graph-vector memory.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${!isMemoryActive ? 'text-destructive' : 'text-muted-foreground'}`}>
                  Memory Off
                </span>
                <Switch 
                  checked={isMemoryActive} 
                  onCheckedChange={setIsMemoryActive} 
                  className="data-[state=checked]:bg-primary"
                />
                <span className={`text-sm font-medium ${isMemoryActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  Memory On
                </span>
              </div>
            </div>
            <div className="w-full flex justify-center">
              <ClaimForm onSubmit={onSubmitClaim} isLoading={isLoading} />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full"
          >
            {/* Left Side: Entered Data Summary */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-muted-foreground uppercase tracking-wider">
                  <FileText className="text-primary w-5 h-5" />
                  Intake Data
                </h3>
                
                <div className="space-y-5">
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 mb-1 uppercase tracking-widest"><User className="w-3 h-3"/> Attorney</p>
                    <p className="text-lg font-medium text-foreground">{submittedData?.attorneyName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 mb-1 uppercase tracking-widest"><ActivitySquare className="w-3 h-3"/> Medical Provider</p>
                    <p className="text-lg font-medium text-foreground">{submittedData?.medicalProvider || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 mb-1 uppercase tracking-widest"><Building className="w-3 h-3"/> Repair Shop</p>
                    <p className="text-lg font-medium text-foreground">{submittedData?.repairShop || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 mb-1 uppercase tracking-widest"><MapPin className="w-3 h-3"/> State</p>
                    <p className="text-lg font-medium text-foreground">{submittedData?.incidentState}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 mb-1 uppercase tracking-widest"><DollarSign className="w-3 h-3"/> Amount</p>
                    <p className="text-3xl font-bold text-primary tracking-tight">${Number(submittedData?.totalClaimAmount).toLocaleString()}</p>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">Narrative</p>
                    <p className="text-base leading-relaxed text-foreground">{submittedData?.injuryNarrative}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Streaming Brief & Actions */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Adjuster Action Buttons - Moved to top */}
              {!isLoading && object?.risk_score && (
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border/50">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Adjuster Decision</h3>
                    <p className="text-sm text-muted-foreground mt-1">Record your decision to update Cognee knowledge graph.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={() => handleDecision("APPROVED")} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full">
                      <Check className="w-4 h-4 mr-2" /> Approve
                    </Button>
                    <Button onClick={() => handleDecision("FLAGGED")} className="bg-amber-600 hover:bg-amber-500 text-white rounded-full">
                      <X className="w-4 h-4 mr-2" /> Flag
                    </Button>
                    <Button onClick={() => handleDecision("ESCALATED")} className="bg-rose-600 hover:bg-rose-500 text-white rounded-full">
                      <ShieldAlert className="w-4 h-4 mr-2" /> Escalate
                    </Button>
                    <Button 
                      onClick={downloadPDF} 
                      disabled={isDownloading}
                      variant="outline"
                      className="rounded-full ml-2"
                    >
                      {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4" />}
                      PDF
                    </Button>
                  </div>
                </div>
              )}

              <div ref={briefRef} className="flex-1 relative">
                {!isMemoryActive && (
                  <div className="absolute top-4 right-4 z-10 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-destructive-foreground/20 animate-pulse">
                    STATELESS MODE
                  </div>
                )}
                <RiskBrief data={object as any} isLoading={isLoading || (isSubmitted && !object)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
