"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Database, ShieldAlert, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="max-w-4xl mx-auto px-6 mt-16">
        <div className="flex items-center gap-4 mb-12 border-b border-border/50 pb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              ClaimTrace Documentation
            </h1>
            <p className="text-xl text-muted-foreground">Demo Guide & Architecture Overview</p>
          </div>
        </div>

        <div className="space-y-12">
          
          {/* Section 1: Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary border-l-4 border-primary pl-4">1. Welcome to ClaimTrace</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ClaimTrace is an agentic insurance fraud detection platform built for the <strong>WeMakeDevs × Cognee Hackathon</strong>. 
              It solves the "Where's my context?" problem by replacing legacy, stateless rules engines with a dynamic memory graph. 
              Instead of evaluating claims in isolation, ClaimTrace uses <strong>Cognee</strong> to remember every entity, relationship, and adjuster decision.
            </p>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-sm text-primary">
              <strong>Note:</strong> This is a public, no-login demo version of the platform. Authentication and multi-tenancy are disabled to allow judges to seamlessly explore the core memory features.
            </div>
          </section>

          {/* Section 2: The Dataset */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary border-l-4 border-primary pl-4">2. The Demo Dataset</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To demonstrate the power of graph-vector memory, this demo is pre-seeded with a specific dataset of auto insurance claims.
              The dataset contains hundreds of legitimate claims mixed with a hidden, organized fraud ring.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <Database className="w-6 h-6 text-emerald-500 mb-3" />
                <h3 className="font-bold mb-2">The Baseline</h3>
                <p className="text-sm text-muted-foreground">
                  Standard claims (fender benders, weather damage) with varying attorneys and clinics. A stateless engine will correctly identify most of these as LOW risk.
                </p>
              </div>
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6 shadow-sm">
                <ShieldAlert className="w-6 h-6 text-destructive mb-3" />
                <h3 className="font-bold text-destructive mb-2">The Fraud Ring</h3>
                <p className="text-sm text-foreground">
                  A sophisticated soft-tissue fraud ring operated jointly by <strong>Kaplan & Associates</strong> and <strong>Summit Rehab</strong>. They submit medium-dollar claims that individually look normal, but together form an undeniable pattern.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: How to Use the Demo */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary border-l-4 border-primary pl-4">3. How to Use the Demo</h2>
            <div className="space-y-6">
              <div className="bg-card border border-border p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-2">A. Bulk Import via CSV</h3>
                <p className="text-muted-foreground mb-4">
                  Navigate to the <strong>Claims Queue</strong> and click <code>Import CSV</code>. Upload the provided <code>csvtobeimported.csv</code> file.
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                  <li>The system will evaluate each claim in the CSV.</li>
                  <li><strong>Caching Protocol:</strong> To ensure the demo runs instantly without hitting API rate limits, identical claims are cached locally via a dynamic write-through hash map. The first upload hits Gemini; subsequent uploads of the same data load instantly from cache.</li>
                  <li>Claims linked to the known fraud ring will instantly flag as CRITICAL.</li>
                </ul>
              </div>

              <div className="bg-card border border-border p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-2">B. The Stateless vs. Memory Comparison</h3>
                <p className="text-muted-foreground mb-4">
                  Navigate to <strong>Submit Claim</strong> to manually test the system's reasoning.
                </p>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-3">
                  <li>Fill out a fake claim using <strong>Kaplan & Associates</strong> as the attorney.</li>
                  <li>Toggle the memory switch to <strong>Memory Off</strong> (Stateless Mode). Submit the claim. Notice how the AI gives it a generic MEDIUM score because it cannot see history.</li>
                  <li>Toggle the memory switch to <strong>Memory On</strong>. Submit again. Watch as the AI pulls the historical graph context from Cognee and instantly flags the claim as CRITICAL due to the ring connection.</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Section 4: Architecture */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary border-l-4 border-primary pl-4">4. Architecture</h2>
            <div className="bg-card border border-border p-6 rounded-xl flex gap-6 items-start">
              <Cpu className="w-10 h-10 text-muted-foreground shrink-0" />
              <div>
                <p className="text-muted-foreground leading-relaxed text-sm mb-4">
                  The backend utilizes a multi-stage ingestion pipeline. Raw unstructured data is pushed through an LLM to extract entities (Attorneys, Clinics, Claimants) which are then materialized into a <strong>NetworkX / Neo4j</strong> graph via <strong>Cognee</strong>.
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  During evaluation, the frontend streams a request to Next.js API routes, which fetch historical graph context from Cognee, inject it into a highly specific Gemini 2.5 Flash prompt, and stream the structured JSON Risk Brief back to the UI in real-time.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
