"use client";
import { RiskBrief as RiskBriefType } from "@/lib/types";
import { RiskLevelBadge, RiskScore } from "./RiskScoreBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Activity, GitCommit, FileText } from "lucide-react";

interface RiskBriefProps {
  data?: Partial<RiskBriefType>;
  isLoading: boolean;
}

export function RiskBrief({ data, isLoading }: RiskBriefProps) {
  if (!data && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 border-2 border-dashed border-gray-800 rounded-lg p-12">
        <Activity className="w-12 h-12 mb-4 opacity-50" />
        <p>Submit a claim to generate the AI Risk Brief.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-blue-500" />
          AI Risk Brief
          {isLoading && <span className="ml-2 text-sm font-normal text-blue-400 animate-pulse">(Streaming...)</span>}
        </h2>
        
        {data?.risk_level && (
          <RiskLevelBadge level={data.risk_level as any} />
        )}
      </div>

      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Risk Score</CardTitle>
        </CardHeader>
        <CardContent>
          <RiskScore score={data?.risk_score || 0} />
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 leading-relaxed">
            {data?.summary || <span className="text-gray-600 animate-pulse">Analyzing narrative and entity graph...</span>}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <GitCommit className="w-4 h-4" />
              Entity Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.entity_alerts?.length ? (
              <ul className="list-disc pl-4 space-y-1">
                {data.entity_alerts.map((alert, i) => (
                  <li key={i} className="text-sm text-red-400">{alert}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No entity alerts detected yet...</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Pattern Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.pattern_matches?.length ? (
              <ul className="list-disc pl-4 space-y-1">
                {data.pattern_matches.map((pattern, i) => (
                  <li key={i} className="text-sm text-orange-400">{pattern}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No pattern matches detected yet...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
