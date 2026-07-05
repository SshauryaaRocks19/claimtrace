export default function WorkflowPage() {
  return (
    <div className="space-y-8 ">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Usage Workflow</h1>
        <p className="text-xl text-foreground/80 leading-relaxed">
          A step-by-step guide to operating the ClaimTrace platform during a demonstration.
        </p>
      </div>

      <div className="space-y-8">
        
        <div className="bg-card border border-border p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <h2 className="text-xl font-bold mb-3 text-foreground">Step 1: Bulk Ingestion (The Queue)</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            Start at the <strong>Dashboard</strong>. In a real-world scenario, this queue populates automatically from the claims management system (e.g., Guidewire). For the demo, you will simulate this by clicking <code>Import CSV</code>.
          </p>
          <ul className="list-disc list-inside text-sm text-foreground/80 space-y-2">
            <li>Upload the pre-seeded dataset.</li>
            <li>Observe how the system instantly triages the claims. Legitimate baseline claims will stay "Pending" with a low risk score.</li>
            <li>Claims tied to the hidden fraud ring will immediately turn red and be marked "Flagged."</li>
          </ul>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <h2 className="text-xl font-bold mb-3 text-foreground">Step 2: Investigation & The Network Graph</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            Click on any Flagged claim to open the <strong>Risk Brief Panel</strong>. The LLM will explain exactly <em>why</em> it flagged the claim, citing historical graph evidence.
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            Next, click <code>Graph Network</code> in the navigation bar. This visualizes the topological memory. You will see a web of nodes representing attorneys and clinics. Notice the dense clusters—these are your organized fraud rings visualized in real-time.
          </p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <h2 className="text-xl font-bold mb-3 text-foreground">Step 3: A/B Testing Memory</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            To truly understand the power of the platform, navigate to <strong>Submit Claim</strong>. This allows you to manually input a claim and watch the AI evaluate it live.
          </p>
          <ol className="list-decimal list-inside text-sm text-foreground/80 space-y-3">
            <li>Fill out the form. Ensure you use "Kaplan & Associates" as the attorney.</li>
            <li><strong>Toggle Memory OFF:</strong> Submit the claim. The AI will act like a legacy system, giving it a low/medium score because it has no historical context.</li>
            <li><strong>Toggle Memory ON:</strong> Submit the exact same claim. The AI will pull the graph memory, recognize the Kaplan entity, realize it is associated with a fraud ring, and instantly escalate the risk score to CRITICAL.</li>
          </ol>
        </div>

      </div>
    </div>
  );
}
