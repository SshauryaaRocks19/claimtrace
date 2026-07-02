import { Badge } from "@/components/ui/badge";
import { RiskLevel } from "@/lib/types";

export function RiskLevelBadge({ level }: { level: RiskLevel }) {
  const colors = {
    LOW: "bg-green-500/20 text-green-400 border-green-500/50",
    MEDIUM: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    HIGH: "bg-orange-500/20 text-orange-400 border-orange-500/50",
    CRITICAL: "bg-red-500/20 text-red-400 border-red-500/50",
  };

  return (
    <Badge variant="outline" className={`${colors[level]} px-3 py-1 text-xs font-bold uppercase tracking-wider`}>
      {level}
    </Badge>
  );
}

export function RiskScore({ score }: { score: number }) {
  let colorClass = "text-green-400";
  if (score >= 40) colorClass = "text-yellow-400";
  if (score >= 70) colorClass = "text-orange-400";
  if (score >= 90) colorClass = "text-red-400";

  return (
    <div className={`text-4xl font-black ${colorClass}`}>
      {score}
    </div>
  );
}
