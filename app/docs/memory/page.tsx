export default function MemoryPage() {
  return (
    <div className="space-y-8 ">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">The Memory Advantage</h1>
        <p className="text-xl text-foreground/80 leading-relaxed">
          Why traditional AI fails at fraud detection without a vector-graph memory architecture.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground border-b border-border/50 pb-2">The Limit of "Stateless" AI</h2>
        <p className="text-foreground/80 leading-relaxed">
          Many modern platforms attempt to solve fraud by throwing a Large Language Model (LLM) at an incoming claim. They ask the LLM: <em>"Read this claim narrative and tell me if it sounds fraudulent."</em>
        </p>
        <p className="text-foreground/80 leading-relaxed">
          This is fundamentally flawed. An LLM cannot spot fraud in a vacuum. A well-written, perfectly plausible narrative describing a rear-end collision at a stoplight will always look legitimate. Stateless AI engines suffer from the same problem as traditional rules engines: they lack <strong>historical context</strong>.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground border-b border-border/50 pb-2">Injecting Graph Memory</h2>
        <p className="text-foreground/80 leading-relaxed">
          ClaimTrace uses a graph database to maintain a living memory of every entity in your ecosystem. When a claim enters the system, ClaimTrace doesn't just evaluate the claim text. It performs a <strong>Topological Recall</strong>.
        </p>
        <ul className="list-disc list-inside text-foreground/80 space-y-3 ml-4">
          <li><strong>Entity Extraction:</strong> The system identifies "Attorney Smith" and "City Med Clinic".</li>
          <li><strong>Graph Traversal:</strong> It queries the memory layer: <em>"Have we seen Attorney Smith and City Med Clinic on the same claim before?"</em></li>
          <li><strong>Context Assembly:</strong> The memory layer returns a subgraph showing that these two entities have collaborated on 14 claims in the last 6 months, and 5 of them were flagged by SIU.</li>
          <li><strong>Prompt Injection:</strong> This historical subgraph is injected directly into the LLM's prompt alongside the new claim.</li>
        </ul>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-xl mt-8">
        <h3 className="text-emerald-500 font-bold mb-2">The Result</h3>
        <p className="text-foreground/80 text-sm leading-relaxed">
          Instead of asking the LLM <em>"Does this sound fake?"</em>, we are asking: <em>"Given that this exact attorney and clinic have collaborated on 5 known fraudulent claims this year, how risky is this new claim?"</em> The difference in accuracy is night and day.
        </p>
      </div>
    </div>
  );
}
