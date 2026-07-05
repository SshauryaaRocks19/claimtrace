export default function DatasetPage() {
  return (
    <div className="space-y-8 ">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">The Pre-seeded Dataset</h1>
        <p className="text-xl text-foreground/80 leading-relaxed">
          Understanding the synthetic data driving the ClaimTrace demonstration.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground border-b border-border/50 pb-2">Why Pre-seeded Data?</h2>
        <p className="text-foreground/80 leading-relaxed">
          To demonstrate the efficacy of topological fraud detection, the system requires an established history. Fraud rings only become visible when evaluated against a baseline of legitimate claims over time.
        </p>
        <p className="text-foreground/80 leading-relaxed">
          The demo is pre-seeded with a synthetic dataset of hundreds of auto-insurance claims, simulating a 12-month operating window for a regional insurance carrier.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-bold mb-3 text-lg flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            The Legitimate Baseline
          </h3>
          <p className="text-sm text-foreground/80 mb-4">
            Approximately 85% of the pre-seeded graph consists of standard claims. These include genuine fender-benders, weather-related damages, and single-vehicle accidents.
          </p>
          <ul className="text-sm text-foreground/80 list-disc list-inside space-y-1">
            <li>Scattered, un-clustered entities</li>
            <li>Randomized attorneys and repair shops</li>
            <li>Low risk scores across the board</li>
          </ul>
        </div>
        
        <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold mb-3 text-lg text-destructive flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-destructive"></span>
            The Hidden Fraud Ring
          </h3>
          <p className="text-sm text-foreground mb-4">
            Hidden within the baseline is an organized soft-tissue fraud ring. A tight cluster of nodes connecting specific attorneys and medical providers submitting highly similar narratives.
          </p>
          <ul className="text-sm text-foreground list-disc list-inside space-y-1 font-medium">
            <li><strong>Attorney:</strong> Kaplan & Associates</li>
            <li><strong>Clinic:</strong> Summit Rehab</li>
            <li><strong>Pattern:</strong> Low-speed rear collisions resulting in expensive PIP claims</li>
          </ul>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl mt-8">
        <h3 className="text-primary font-bold mb-2">Testing the Limits</h3>
        <p className="text-foreground/80 text-sm leading-relaxed">
          You can test the system's resilience by uploading claims that <em>partially</em> match the fraud ring (e.g., using "Kaplan & Associates" but a different clinic). The graph will calculate a proportional risk score, demonstrating that it doesn't just use binary keyword matching, but actual topological weight.
        </p>
      </div>
    </div>
  );
}
