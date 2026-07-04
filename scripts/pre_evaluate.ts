import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Dummy cognee recall for the script (so we don't need full cognee SDK inside this simple node script, 
// unless we want to use the actual cognee integration. To keep it robust, we'll just mock the context for the script
// or use a simple string if we are strictly saving Gemini API quota).
const DUMMY_COGNEE_CONTEXT = [
  {
    "claim_id": "PAST-901",
    "attorney_name": "Kaplan & Associates",
    "medical_provider": "Summit Rehab Clinic",
    "fraud_reported": "Y",
  },
  {
    "claim_id": "PAST-902",
    "attorney_name": "Meridian Legal Group",
    "medical_provider": "FastTrack Medical Center",
    "fraud_reported": "Y",
  }
];

async function main() {
  const csvPath = path.join(process.cwd(), "data", "csvtobeimported.csv");
  const cachePath = path.join(process.cwd(), "data", "demo_cache.json");
  
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found at ${csvPath}`);
    return;
  }

  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const records = Papa.parse(csvContent, { header: true, skipEmptyLines: true }).data as any[];

  console.log(`Loaded ${records.length} records. Beginning pre-evaluation...`);
  
  let cache: Record<string, any> = {};
  if (fs.existsSync(cachePath)) {
    cache = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
  }

  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    // Match the ID format used in page.tsx: `row.policy_number || "UP-"...`
    // If the CSV doesn't have a policy_number, the frontend creates a dynamic ID which is hard to cache.
    // It's critical the CSV has a policy_number. We will assume it does, or use row index if we must, 
    // but the frontend UI must generate the same ID.
    const claimId = row.policy_number;
    
    if (!claimId) {
       console.warn(`Row ${i} missing policy_number, skipping caching.`);
       continue;
    }

    if (cache[claimId]) {
      console.log(`[${i+1}/${records.length}] Skipping ${claimId} (already in cache)`);
      continue;
    }

    console.log(`[${i+1}/${records.length}] Evaluating ${claimId}...`);
    
    const claim = {
      id: claimId,
      attorneyName: row.attorney_name || "Unknown",
      medicalProvider: row.medical_provider || "Unknown",
      incidentState: row.incident_state || "Unknown",
      injuryNarrative: row.injury_narrative || "",
    };

    const prompt = `
      You are an expert insurance fraud investigator. 
      Analyze the following NEW claim and compare it against the RECALLED historical claims from our database.
      Look for shared entities (attorneys, clinics, repair shops) and similar narrative patterns.

      NEW CLAIM:
      ${JSON.stringify(claim, null, 2)}

      RECALLED HISTORICAL CLAIMS:
      ${JSON.stringify(DUMMY_COGNEE_CONTEXT, null, 2)}

      Assess the risk of fraud based on connections to known fraud rings and suspicious patterns.
    `;

    try {
      const { object } = await generateObject({
        model: google('gemini-2.5-flash'),
        schema: z.object({
          risk_score: z.number().min(0).max(100).describe("0 to 100 risk score"),
          risk_level: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
          entity_alerts: z.array(z.string()).describe("List of suspicious entity connections"),
          pattern_matches: z.array(z.string()).describe("List of narrative or pattern similarities to past fraud"),
          recommended_action: z.enum(["APPROVE", "FLAG_FOR_REVIEW", "ESCALATE_TO_FRAUD_UNIT"]),
          summary: z.string().describe("A concise paragraph summarizing the fraud risk and rationale"),
        }),
        prompt: prompt,
      });

      cache[claimId] = object;
      fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
      console.log(`Saved evaluation for ${claimId}. Sleeping 10s for rate limit...`);
      
      // Wait 10 seconds between API calls to avoid triggering the 20 RPD / minute limits
      await new Promise(r => setTimeout(r, 10000));
      
    } catch (err: any) {
      console.error(`Error evaluating ${claimId}:`, err.message);
      break;
    }
  }
  
  console.log("Pre-evaluation complete!");
}

main();
