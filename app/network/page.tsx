import { EntityNetwork } from "@/components/EntityNetwork";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NetworkPage() {
  return (
    <div className="container mx-auto pt-24 pb-4 md:py-10 md:pt-32 px-4 max-w-6xl h-[100dvh] flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/queue">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Entity Network Visualization</h1>
          <p className="text-muted-foreground text-sm">Real-time graph analysis showing multi-claim connections and fraud rings.</p>
        </div>
      </div>
      <div className="flex-1 min-h-0 border border-border rounded-lg shadow-2xl">
        <EntityNetwork />
      </div>
    </div>
  );
}
