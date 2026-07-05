export default function UseCasesPage() {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Core Use Cases</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          How ClaimTrace's memory graph detects patterns that human adjusters and stateless rules engines miss.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground border-b border-border/50 pb-2">1. Organized Soft-Tissue Rings</h2>
        <p className="text-muted-foreground leading-relaxed">
          The most common form of organized auto insurance fraud involves a "triangle" of complicit actors: a runner (who stages the accident), an attorney, and a medical clinic. They file claims for subjective soft-tissue injuries (like whiplash) that are impossible to disprove with X-rays.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          <strong>How ClaimTrace solves it:</strong> By mapping every entity to a graph, ClaimTrace instantly flags when a specific Attorney and Clinic appear together at an unnatural frequency. When an adjuster flags one of their claims as fraudulent, that negative weight propagates through the graph, instantly raising the risk score of all future claims involving that pair.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground border-b border-border/50 pb-2">2. The "Swoop and Squat" Staged Collision</h2>
        <p className="text-muted-foreground leading-relaxed">
          Fraudsters stage collisions (e.g., stopping abruptly in front of a commercial truck) and repeatedly use the same vehicles or "victims" across different jurisdictions to avoid detection by localized adjusters.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          <strong>How ClaimTrace solves it:</strong> Vectorizing the claim narratives allows ClaimTrace to perform semantic searches. Even if the names change, if the LLM detects identical language or highly similar "accident choreography" across multiple claims in the memory graph, it flags a Pattern Match.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground border-b border-border/50 pb-2">3. Vendor Inflated Estimates</h2>
        <p className="text-muted-foreground leading-relaxed">
          A repair shop consistently inflates damage estimates, but only when working with specific independent appraisers.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          <strong>How ClaimTrace solves it:</strong> The graph memory reveals the hidden edge between the specific appraiser and the repair shop. When an adjuster reviews the claim, the LLM provides a Risk Brief pointing out that estimates involving this specific pair are historically 40% higher than the baseline average.
        </p>
      </div>
    </div>
  );
}
