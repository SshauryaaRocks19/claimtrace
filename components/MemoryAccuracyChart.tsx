"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BrainCircuit } from "lucide-react";

const data = [
  { week: "Week 1", accuracy: 68 },
  { week: "Week 2", accuracy: 74 },
  { week: "Week 3", accuracy: 82 },
  { week: "Week 4", accuracy: 91 },
];

export function MemoryAccuracyChart() {
  return (
    <Card className="w-full bg-card/80 backdrop-blur-md border-border/50 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <BrainCircuit className="w-5 h-5 text-primary" />
            Memory Accuracy Over Time
          </CardTitle>
          <div className="flex items-center gap-1 text-sm font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
            <TrendingUp className="w-4 h-4" />
            +23%
          </div>
        </div>
        <CardDescription>
          Adjuster agreement rate with AI risk scores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} vertical={false} />
              <XAxis 
                dataKey="week" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}%`}
                domain={[50, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
                itemStyle={{ color: 'hsl(var(--primary))' }}
                formatter={(value: number) => [`${value}%`, 'Accuracy']}
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ r: 4, fill: "hsl(var(--background))", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground flex justify-between items-center">
          <span>Based on 47 decisions logged via <code>improve()</code> feedback</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Learning Active
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
