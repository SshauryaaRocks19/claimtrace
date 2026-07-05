import { RecalledClaim } from "./types";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const DATASET_NAME = "claimtrace_clean";

export async function cogneeRecall(queryText: string): Promise<any[]> {
  try {
    // For Hackathon Demo: Use the local CSV as a "cached" version of the Cognee Graph Database
    // We parse the query to find the Attorney or Clinic being searched
    const attorneyMatch = queryText.match(/Attorney:\s*([^,.|]+)/i);
    const clinicMatch = queryText.match(/Clinic:\s*([^,.|]+)/i);
    
    const targetAttorney = attorneyMatch ? attorneyMatch[1].trim() : null;
    const targetClinic = clinicMatch ? clinicMatch[1].trim() : null;

    const filePath = path.join(process.cwd(), "data", "insurance_fraud_enriched.csv");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const records = parse(fileContent, { columns: true, skip_empty_lines: true, cast: true });

    // Simulate Graph Traversal: Find all historical claims that share this Attorney or Clinic
    const connectedClaims = records.filter((r: any) => {
      const matchA = targetAttorney && targetAttorney !== "None" && targetAttorney !== "Unknown" && r.attorney_name === targetAttorney;
      const matchC = targetClinic && targetClinic !== "None" && targetClinic !== "Unknown" && r.medical_provider === targetClinic;
      return matchA || matchC;
    });

    // Format the results to match what the LLM expects
    const results = connectedClaims.slice(0, 15).map((r: any) => ({
      claim_id: r.policy_number,
      attorney: r.attorney_name,
      clinic: r.medical_provider,
      repair_shop: r.repair_shop,
      fraud_reported: r.fraud_reported, // Critical for the LLM to know if it was fraud!
      narrative: r.injury_narrative
    }));

    console.log(`[COGNEE MOCK] Found ${results.length} connections for Attorney: ${targetAttorney}, Clinic: ${targetClinic}`);
    return results;
  } catch (error) {
    console.error("Error in mock Cognee recall:", error);
    return [];
  }
}

/**
 * Wrapper for the Cognee improve API
 * Feeds adjuster feedback back into the memory layer to improve future recall accuracy.
 */
export async function cogneeImprove(claimId: string, decision: string, wasCorrect: boolean) {
  console.log(`[COGNEE MOCK] Received feedback for ${claimId}: ${decision} (Correct: ${wasCorrect})`);
  // In the real implementation, this hits /api/v1/improve. We just return true for the demo.
  return true;
}

/**
 * Wrapper for the Cognee forget API
 * Simulates a GDPR deletion request by purging specific claim memory nodes.
 */
export async function cogneeForget(claimId: string) {
  console.log(`[COGNEE MOCK] Forgetting claim data for ${claimId}`);
  // In the real implementation, this hits /api/v1/forget. We just return true for the demo.
  return true;
}
