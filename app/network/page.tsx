import { EntityNetwork } from "@/components/EntityNetwork";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NetworkPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl h-screen flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/queue">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Entity Network Visualization</h1>
          <p className="text-gray-400 text-sm">Real-time graph analysis showing multi-claim connections and fraud rings.</p>
        </div>
      </div>
      <div className="flex-1 min-h-0 border border-gray-800 rounded-lg shadow-2xl">
        <EntityNetwork />
      </div>
    </div>
  );
}
