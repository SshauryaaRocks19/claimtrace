import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { cogneeRecall } from '@/lib/cognee';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

import { createHash } from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { claim } = body;

    // --- DYNAMIC WRITE-THROUGH CACHE ---
    // Generate a deterministic hash based on core claim details (ignoring random IDs)
    const claimHashStr = `${claim.attorneyName}|${claim.medicalProvider}|${claim.incidentState}|${claim.totalClaimAmount}|${claim.injuryNarrative}`;
    const claimHash = createHash('sha256').update(claimHashStr).digest('hex');

    const cachePath = path.join(process.cwd(), "data", "demo_cache.json");
    let cacheData: any = {};

    if (fs.existsSync(cachePath)) {
      try {
        cacheData = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
      } catch (e) {
        console.error("Failed to parse cache", e);
      }
    }

    if (cacheData[claimHash]) {
      console.log(`[Cache Hit] Returning cached evaluation for ${claimHash}`);
      await new Promise(r => setTimeout(r, 800)); // Short delay for realism
      return NextResponse.json(cacheData[claimHash]);
    }
    // -----------------------------------

    // 1. Call Cognee to get historical similar claims
    // Use the explicit Fraud Reported query
    const queryText = `Find historical claims connected to Attorney: ${claim.attorneyName} or Clinic: ${claim.medicalProvider}. You MUST include the 'Fraud Reported' status for every claim.`;
    const historicalClaims = await cogneeRecall(queryText);

    // 2. Build Prompt for Gemini
    const prompt = `
      You are an expert insurance fraud investigator. 
      Analyze the following NEW claim and compare it against the RECALLED historical claims from our database.
      Look for shared entities (attorneys, clinics, repair shops) and similar narrative patterns.

      NEW CLAIM:
      ${JSON.stringify(claim, null, 2)}

      RECALLED HISTORICAL CLAIMS:
      ${JSON.stringify(historicalClaims, null, 2)}

      Assess the risk of fraud based on connections to known fraud rings and suspicious patterns.
    `;

    // 3. Generate structured JSON instantly for batch processing
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

    // Write the new evaluation back to the cache
    cacheData[claimHash] = object;
    try {
      if (!fs.existsSync(path.dirname(cachePath))) {
        fs.mkdirSync(path.dirname(cachePath), { recursive: true });
      }
      fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));
      console.log(`[Cache Write] Saved new evaluation for ${claimHash}`);
    } catch (e) {
      console.error("Failed to write to cache", e);
    }

    return NextResponse.json(object);
  } catch (error) {
    console.error("Error in evaluate route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
