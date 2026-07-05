export default function DocsPage() {
  return (
    <div className="space-y-8 ">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Introduction</h1>
        <p className="text-xl text-foreground/80 leading-relaxed">
          Welcome to the ClaimTrace Documentation. ClaimTrace is an agentic Special Investigation Unit (SIU) platform built to detect organized insurance fraud.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground border-b border-border/50 pb-2">The Intelligence Gap</h2>
        <p className="text-foreground/80 leading-relaxed">
          Modern insurance fraud rarely looks like a single, massive, millions-of-dollars heist. Instead, it looks like a thousand $2,500 fender-benders spread across different jurisdictions, different adjusters, and different months. 
        </p>
        <p className="text-foreground/80 leading-relaxed">
          Organized fraud rings—involving coordinated attorneys, medical clinics, and repair shops—rely entirely on the <strong>fragmentation</strong> of insurance systems. Traditional rules engines evaluate each incoming claim in a vacuum. A $2,500 soft-tissue injury claim with no prior history for that specific claimant will always pass through auto-adjudication as "Low Risk."
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground border-b border-border/50 pb-2">Enter ClaimTrace</h2>
        <p className="text-foreground/80 leading-relaxed">
          ClaimTrace replaces stateless rules with a <strong>dynamic knowledge graph</strong>. By parsing raw claim narratives and extracting entities, ClaimTrace builds a continuously updating memory of every actor in your insurance ecosystem.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          When a new claim is submitted, ClaimTrace doesn't just look at the dollar amount. It instantly queries the graph to see who the attorney is, who the clinic is, and whether those two entities have ever collaborated before. It then feeds that topological context into an LLM to generate an expert Risk Brief.
        </p>
      </div>
      
      <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl mt-8">
        <h3 className="text-primary font-bold mb-2">Getting Started</h3>
        <p className="text-foreground/80 text-sm">
          Navigate through the sidebar to learn about the specific memory advantage, deep use cases, and how to effectively run the platform demo using our pre-seeded dataset.
        </p>
      </div>
    </div>
  );
}
