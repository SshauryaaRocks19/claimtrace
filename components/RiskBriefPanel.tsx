"use client";

import { useCompletion } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { X, ShieldAlert, CheckCircle2, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

interface RiskBriefPanelProps {
  isOpen: boolean;
  onClose: () => void;
  claimId: string | null;
  entities: {
    attorney?: string;
    clinic?: string;
    narrative?: string;
  } | null;
}

export function RiskBriefPanel({ isOpen, onClose, claimId, entities }: RiskBriefPanelProps) {
  const { completion, complete, isLoading, stop, error } = useCompletion({
    api: "/api/investigate",
  });
  
  const hasStartedRef = useRef(false);
  const briefContentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async () => {
    if (!briefContentRef.current) return;
    setIsDownloading(true);
    
    try {
      const element = briefContentRef.current;
      const dataUrl = await toPng(element, {
        backgroundColor: '#111827', // Match the gray-900 background
        pixelRatio: 2,
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [element.offsetWidth * 2, element.offsetHeight * 2]
      });
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth * 2, element.offsetHeight * 2);
      pdf.save(`Risk_Brief_${claimId}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (isOpen && claimId && entities && !hasStartedRef.current) {
      hasStartedRef.current = true;
      complete("", {
        body: { claimId, entities }
      });
    }
    
    if (!isOpen) {
      hasStartedRef.current = false;
      stop();
    }
  }, [isOpen, claimId, entities, complete, stop]);

  // Handle parsing markdown-like formatting simply for the demo
  const formatBrief = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.startsWith('##')) {
        return <h3 key={i} className="text-xl font-bold text-foreground mt-4 mb-2">{line.replace('##', '').trim()}</h3>;
      }
      if (line.startsWith('#')) {
        return <h2 key={i} className="text-2xl font-bold text-foreground mt-6 mb-3">{line.replace('#', '').trim()}</h2>;
      }
      if (line.startsWith('-') || line.startsWith('*')) {
        return <li key={i} className="ml-4 mb-1 text-muted-foreground">{line.substring(1).trim()}</li>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="mb-2 text-foreground">{line}</p>;
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-out Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[500px] md:w-[600px] bg-background border-l border-border z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
              Risk Brief Generation
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Claim ID: {claimId}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Target Entities Display */}
          <div className="bg-card rounded-lg p-4 border border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Investigation Targets</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Attorney:</span>
                <span className="text-card-foreground font-medium">{entities?.attorney || 'None'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Medical Provider:</span>
                <span className="text-card-foreground font-medium">{entities?.clinic || 'None'}</span>
              </div>
            </div>
          </div>

          {/* AI Streamed Content */}
          <div 
            ref={briefContentRef}
            className="bg-muted/20 rounded-lg p-6 border border-border min-h-[300px]"
          >
            {isLoading && !completion && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4 py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p>Querying Cognee Knowledge Graph...</p>
              </div>
            )}
            
            {error && (
              <div className="text-destructive p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                Failed to generate risk brief. {error.message}
              </div>
            )}
            
            <div className="prose prose-invert max-w-none text-foreground">
              {formatBrief(completion)}
              {isLoading && completion && <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-border bg-muted/30 flex flex-col gap-3">
          <Button 
            className="w-full"
            onClick={downloadPDF}
            disabled={!completion || isLoading || isDownloading}
          >
            {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Download Brief as PDF
          </Button>
          <div className="flex gap-4">
            <Button 
              variant="destructive"
              className="flex-1"
              onClick={onClose}
            >
              Flag for SIU (Fraud)
            </Button>
            <Button 
              variant="outline"
              className="flex-1 border-primary/50 text-primary hover:bg-primary/10"
              onClick={onClose}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Clear & Process
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
