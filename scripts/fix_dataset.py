import os
import requests
import pandas as pd
from dotenv import load_dotenv

load_dotenv(".env.local")

COGNEE_TENANT_URL = os.environ.get("COGNEE_TENANT_URL")
COGNEE_API_KEY = os.environ.get("COGNEE_API_KEY")

DATASET_NAME = "claimtrace_clean"

def run_fix():
    print(f"Loading real data from CSV...")
    df = pd.read_csv("data/insurance_fraud_enriched.csv")
    
    # Filter for the target fraud ring
    kaplan_claims = df[df['attorney_name'] == 'Kaplan & Associates']
    print(f"Found {len(kaplan_claims)} historical claims for Kaplan & Associates.")
    
    # Format them into clean, unambiguous text blocks for the vector DB
    text_chunks = []
    for _, row in kaplan_claims.iterrows():
        chunk = (
            f"Historical Claim File: {row['policy_number']}\n"
            f"Attorney: {row['attorney_name']}\n"
            f"Medical Provider: {row['medical_provider']}\n"
            f"Repair Shop: {row['repair_shop']}\n"
            f"Claim Amount: ${row['total_claim_amount']}\n"
            f"Fraud Reported: {row['fraud_reported']}\n"
            f"Injury Narrative: {row['injury_narrative']}\n"
        )
        text_chunks.append(chunk)

    headers = {
        "Content-Type": "application/json",
        "x-api-key": COGNEE_API_KEY
    }

    print(f"Adding {len(text_chunks)} clean chunks to new dataset: '{DATASET_NAME}'...")
    
    for i, chunk in enumerate(text_chunks):
        res = requests.post(
            f"{COGNEE_TENANT_URL}/api/v1/add_text",
            headers=headers,
            json={"textData": [chunk], "datasetName": DATASET_NAME}
        )
        if not res.ok:
            print(f"Error adding chunk {i}:", res.text)
            
    print("Triggering Cognee cognify (graph extraction)...")
    res = requests.post(
        f"{COGNEE_TENANT_URL}/api/v1/cognify",
        headers=headers,
        json={"datasets": [DATASET_NAME]}
    )
    
    if res.ok:
        print(f"Successfully ingested and cognified data into '{DATASET_NAME}'!")
    else:
        print("Error cognifying:", res.text)

if __name__ == "__main__":
    run_fix()
