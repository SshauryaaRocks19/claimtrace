"use client";
import { RiskBrief as RiskBriefType } from "@/lib/types";
import { RiskLevelBadge, RiskScore } from "./RiskScoreBadge";
import { ShieldAlert, Activity, GitCommit, FileText } from "lucide-react";

interface RiskBriefProps {
  data?: Partial<RiskBriefType>;
  isLoading: boolean;
}

export function RiskBrief({ data, isLoading }: RiskBriefProps) {
  if (!data && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed border-border rounded-xl p-12 bg-background/30">
        <Activity className="w-12 h-12 mb-4 opacity-50 text-primary" />
        <p className="text-lg">Submit a claim to generate the AI Risk Brief.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-primary" />
          AI Risk Assessment
          {isLoading && <span className="ml-3 text-sm font-normal text-primary animate-pulse tracking-wide">(Streaming...)</span>}
        </h2>
        {data?.risk_level && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Risk Score: {data.risk_score}/100</span>
            <RiskLevelBadge level={data.risk_level as any} />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-muted-foreground" />
          Executive Summary
        </h3>
        <div className="text-foreground/90 leading-relaxed text-lg whitespace-pre-wrap">
          {data?.summary || <span className="text-muted-foreground animate-pulse">Analyzing narrative and entity graph...</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-destructive" />
            Entity Alerts
          </h3>
          {data?.entity_alerts?.length ? (
            <ul className="list-disc pl-5 space-y-2">
              {data.entity_alerts.map((alert, i) => (
                <li key={i} className="text-base text-destructive/90">{alert}</li>
              ))}
            </ul>
          ) : (
            <p className="text-base text-muted-foreground italic">No entity alerts detected.</p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" />
            Pattern Matches
          </h3>
          {data?.pattern_matches?.length ? (
            <ul className="list-disc pl-5 space-y-2">
              {data.pattern_matches.map((pattern, i) => (
                <li key={i} className="text-base text-amber-600 dark:text-amber-500/90">{pattern}</li>
              ))}
            </ul>
          ) : (
            <p className="text-base text-muted-foreground italic">No pattern matches detected.</p>
          )}
        </div>
      </div>
    </div>
  );
}
