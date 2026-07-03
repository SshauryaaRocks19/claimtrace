"use client";

import { useCompletion } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import { X, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        return <h3 key={i} className="text-xl font-bold text-white mt-4 mb-2">{line.replace('##', '').trim()}</h3>;
      }
      if (line.startsWith('#')) {
        return <h2 key={i} className="text-2xl font-bold text-white mt-6 mb-3">{line.replace('#', '').trim()}</h2>;
      }
      if (line.startsWith('-') || line.startsWith('*')) {
        return <li key={i} className="ml-4 mb-1 text-gray-300">{line.substring(1).trim()}</li>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="mb-2 text-gray-300">{line}</p>;
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
        className={`fixed top-0 right-0 h-full w-full sm:w-[500px] md:w-[600px] bg-gray-950 border-l border-gray-800 z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-500" />
              Risk Brief Generation
            </h2>
            <p className="text-sm text-gray-400 mt-1">Claim ID: {claimId}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Target Entities Display */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Investigation Targets</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Attorney:</span>
                <span className="text-gray-200 font-medium">{entities?.attorney || 'None'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Medical Provider:</span>
                <span className="text-gray-200 font-medium">{entities?.clinic || 'None'}</span>
              </div>
            </div>
          </div>

          {/* AI Streamed Content */}
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 min-h-[300px]">
            {isLoading && !completion && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4 py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                <p>Querying Cognee Knowledge Graph...</p>
              </div>
            )}
            
            {error && (
              <div className="text-red-400 p-4 bg-red-950/30 rounded-lg border border-red-900/50">
                Failed to generate risk brief. {error.message}
              </div>
            )}
            
            <div className="prose prose-invert max-w-none text-gray-300">
              {formatBrief(completion)}
              {isLoading && completion && <span className="inline-block w-2 h-4 ml-1 bg-emerald-500 animate-pulse" />}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex gap-4">
          <Button 
            className="flex-1 bg-red-900/80 hover:bg-red-800 text-red-100 border border-red-800"
            onClick={onClose}
          >
            Flag for SIU (Fraud)
          </Button>
          <Button 
            className="flex-1 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-800"
            onClick={onClose}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Clear & Process
          </Button>
        </div>
      </div>
    </>
  );
}
