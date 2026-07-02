import { streamText, simulateReadableStream } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});
import { cogneeRecall } from "@/lib/cognee";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { claimId, entities } = await req.json();

    // 1. Convert the new claim's entities into a query for Cognee
    // We explicitly request the Fraud Reported status to prevent Cognee's internal LLM from summarizing it out.
    const queryText = `Find historical claims connected to Attorney: ${entities.attorney || ''} or Clinic: ${entities.clinic || ''}. You MUST include the 'Fraud Reported' status for every claim in your response.`;
    
    // 2. Fetch the graph context from Cognee Cloud
    const cogneeContext = await cogneeRecall(queryText);

    // 3. Construct the prompt for the Agentic Detective (Gemini)
    const systemPrompt = `
      You are ClaimTrace, an elite insurance fraud detection AI.
      You are analyzing a new incoming claim based on historical graph memory.
      
      NEW CLAIM DETAILS:
      - Claim ID: ${claimId}
      - Attorney: ${entities.attorney || "None"}
      - Clinic: ${entities.clinic || "None"}
      
      HISTORICAL CONTEXT FROM COGNEE (Graph Database):
      ${JSON.stringify(cogneeContext, null, 2)}
      
      YOUR TASK:
      Write a concise, professional Risk Brief for a human insurance adjuster.
      1. Overall Risk Assessment (High/Medium/Low) and a score out of 100.
      2. Key Findings: 
         - Count how many historical claims are connected to this Attorney or Clinic.
         - Did those past claims involve fraud? (Search the text specifically for "Fraud Reported: Y" to determine if they were fraudulent).
      3. Recommended Action for the adjuster.
      
      Format with markdown. Be direct, authoritative, and analytical. Do not use generic AI filler.
    `;

    // 4. Stream the response back to the UI
    const result = streamText({
      model: google('gemini-2.0-flash'),
      prompt: systemPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("API Error in /investigate:", error);
    return new Response(JSON.stringify({ error: "Failed to investigate claim" }), { status: 500 });
  }
}
