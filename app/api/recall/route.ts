import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { cogneeRecall } from '@/lib/cognee';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { claim } = body;

    let historicalClaims: any[] = [];
    let prompt = "";

    if (claim.isStatelessMode) {
      prompt = `
        You are a standard, legacy insurance fraud rules engine. 
        Analyze the following NEW claim WITHOUT any historical context or memory.
        You cannot see past claims, entity histories, or rings. You only have this surface data.
        Provide a generic, shallow risk assessment based solely on standard industry red flags (like high claim amounts or vague narratives). 
        Keep the score in the 40-50 range (MEDIUM risk).
        Do NOT invent entity alerts. Return an empty array for entity_alerts and pattern_matches.
        Keep the summary extremely brief and generic.

        NEW CLAIM:
        ${JSON.stringify(claim, null, 2)}
      `;
    } else {
      // 1. Call Cognee to get historical similar claims
      const queryText = `Attorney: ${claim.attorneyName}, Clinic: ${claim.medicalProvider}, State: ${claim.incidentState}. Narrative: ${claim.injuryNarrative}`;
      historicalClaims = await cogneeRecall(queryText);

      // 2. Build Prompt for Gemini
      prompt = `
        You are an expert insurance fraud investigator. 
        Analyze the following NEW claim and compare it against the RECALLED historical claims from our database.
        Look for shared entities (attorneys, clinics, repair shops) and similar narrative patterns.

        NEW CLAIM:
        ${JSON.stringify(claim, null, 2)}

        RECALLED HISTORICAL CLAIMS:
        ${JSON.stringify(historicalClaims, null, 2)}

        Assess the risk of fraud based on connections to known fraud rings and suspicious patterns.
      `;
    }

    // 3. Stream structured JSON back to the client
    const result = await streamObject({
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

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in recall route:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
