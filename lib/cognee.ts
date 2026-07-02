import { RecalledClaim } from "./types";

const COGNEE_API_URL = process.env.COGNEE_API_URL || "http://localhost:8000";
const DATASET_NAME = "claimtrace_claims";

/**
 * Wrapper for the Cognee recall API
 * Searches both graph and vector layers simultaneously for similar historical claims.
 */
export async function cogneeRecall(queryText: string): Promise<RecalledClaim[]> {
  try {
    const response = await fetch(`${COGNEE_API_URL}/api/v1/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: queryText,
        dataset: DATASET_NAME,
      }),
    });

    if (!response.ok) {
      console.error("Cognee recall failed:", await response.text());
      return [];
    }

    const data = await response.json();
    // Assuming Cognee returns an array of matched nodes with these fields
    return data.results || [];
  } catch (error) {
    console.error("Error communicating with Cognee API:", error);
    return [];
  }
}

/**
 * Wrapper for the Cognee improve API
 * Feeds adjuster feedback back into the memory layer to improve future recall accuracy.
 */
export async function cogneeImprove(claimId: string, decision: string, wasCorrect: boolean) {
  try {
    const response = await fetch(`${COGNEE_API_URL}/api/v1/improve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataset: DATASET_NAME,
        claim_id: claimId,
        feedback: decision,
        ai_was_correct: wasCorrect,
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error("Error sending feedback to Cognee:", error);
    return false;
  }
}

/**
 * Wrapper for the Cognee forget API
 * Simulates a GDPR deletion request by purging specific claim memory nodes.
 */
export async function cogneeForget(claimId: string) {
  try {
    const response = await fetch(`${COGNEE_API_URL}/api/v1/forget`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataset: DATASET_NAME,
        claim_id: claimId,
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error("Error forgetting claim in Cognee:", error);
    return false;
  }
}
