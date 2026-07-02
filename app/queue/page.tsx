import { ClaimsTable } from "@/components/ClaimsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Network } from "lucide-react";

export default function QueuePage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Claims Queue</h1>
          <p className="text-gray-400">Review pending insurance claims and assess fraud risk.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/network">
            <Button variant="outline" className="border-gray-800 bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white">
              <Network className="w-4 h-4 mr-2" />
              Entity Network
            </Button>
          </Link>
          <Link href="/claims/new">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Claim
            </Button>
          </Link>
        </div>
      </div>
      <ClaimsTable />
    </div>
  );
}
