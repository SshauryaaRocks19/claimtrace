"""
Run once to prep data before app start.
Enriches Kaggle dataset with synthetic fraud rings & narratives, then pumps to Cognee.

Requires:
GEMINI_API_KEY
COGNEE_TENANT_URL
COGNEE_API_KEY
"""

import asyncio
import json
import os
import random
import time

import cognee
import google.generativeai as genai
import pandas as pd
from dotenv import load_dotenv

# load .env.local if it exists (since Next.js uses this), otherwise fallback to .env
load_dotenv(".env.local")
load_dotenv()

GEMINI_API_KEY    = os.environ["GEMINI_API_KEY"]
COGNEE_TENANT_URL = os.environ["COGNEE_TENANT_URL"]
COGNEE_API_KEY    = os.environ["COGNEE_API_KEY"]

INPUT_FILE = "data/Worksheet in Case Study question 2.xlsx"
OUTPUT_CSV = "data/insurance_fraud_enriched.csv" # keeping as csv for easier sanity checks
DATASET    = "claimtrace_claims"

genai.configure(api_key=GEMINI_API_KEY)
# disabling thinking tokens to speed up the batch job
model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    generation_config=genai.GenerationConfig(
        temperature=0.7,
        max_output_tokens=200,
    ),
)

# SET TO FALSE TO BYPASS RATE LIMITS AND USE FALLBACK NARRATIVES
USE_GEMINI = True

# keeping pools tiny to force overlap
# we need these artificial collisions to light up the graph demo
ATTORNEYS = {
    "fraud": [
        "Kaplan & Associates",
        "Meridian Legal Group",
        "Coastal Injury Law",
        "Summit Law Partners",
        "Tri-State Claims Group",
        "Harbor Legal Services",
        "Pinnacle Injury Attorneys",
        "Atlas Law Firm",
        "Crestview Legal",
        "Nexus Claims Law",
    ],
    "clean": [
        "Johnson & Miller LLP", "Davis Legal Group", "Thompson Law Partners",
        "Greenfield & Associates", "Hartley Legal", "Riverside Law Office",
        "Cedar Law Group", "Apex Legal Services", "Sterling Law Partners",
        "Northside Legal", "Baxter & Cohen LLP", "Crown Legal Group",
        "Elmwood Law Firm", "Fairview Legal Partners", "Grant & Sons Law",
        "Horizon Legal Services", "Irving Legal Group", "Jasper Law LLC",
        "Kingsley & Moore LLP", "Lakewood Legal", "Monroe Law Partners",
        "Nolan & Associates", "Oakdale Legal", "Preston Law Group",
        "Quinn Legal Services", "Redwood Law Partners", "Sinclair Legal",
        "Tanner Law Group", "Union Legal Partners", "Vance Law LLC",
        "Whitmore Legal", "Xavier & Associates", "Yale Legal Group",
        "Zenith Law Partners", "Aldridge Legal Services",
    ],
}

CLINICS = {
    "fraud": [
        "Summit Rehab Clinic",
        "FastTrack Medical Center",
        "Premier Wellness Center",
        "Rapid Recovery Clinic",
        "Alliance Medical Group",
        "Cornerstone Health Center",
    ],
    "clean": [
        "City General Hospital", "Northside Medical Center", "Riverside Urgent Care",
        "Lakewood Family Practice", "Oakdale Medical Group", "Sunrise Health Clinic",
        "Valley Medical Center", "Brookside Hospital", "Clearwater Medical",
        "Downtown Urgent Care", "Eastside Family Health", "Fairview Medical Center",
        "Greenview Hospital", "Harbor Health Clinic", "Inland Medical Group",
        "Jefferson Medical Center", "Kensington Health", "Lakeview Hospital",
        "Maple Grove Medical", "Northgate Health Center", "Orchard Medical",
        "Parkside Clinic", "Queensbury Medical", "Redstone Health Center",
    ],
}

REPAIR_SHOPS = {
    "fraud": [
        "QuickFix Auto Body",
        "Precision Collision Center",
        "Elite Auto Repair",
        "Speedway Body Works",
        "Premier Auto Restoration",
    ],
    "clean": [
        "City Auto Body", "Northside Collision", "Riverside Repair",
        "Valley Auto Works", "Brookside Body Shop", "Clearwater Auto",
        "Downtown Collision", "Eastside Auto Repair", "Fairview Body Works",
        "Green Valley Auto", "Harbor Auto Repair", "Inland Collision Center",
        "Jefferson Auto Body", "Kensington Repair", "Lakeview Auto",
        "Maple Auto Works", "Northgate Body Shop", "Orchard Auto Repair",
        "Parkside Collision", "Queensbury Auto",
    ],
}

# hardcoded clusters guaranteed to pop in the UI
FRAUD_RINGS = {
    "A": {
        "attorney":     "Kaplan & Associates",
        "clinic":       "Summit Rehab Clinic",
        "repair_shop":  "QuickFix Auto Body",
        "states":       ["SC", "NC"],
        "description":  "Ring A - SC/NC corridor",
    },
    "B": {
        "attorney":     "Meridian Legal Group",
        "clinic":       "FastTrack Medical Center",
        "repair_shop":  "Precision Collision Center",
        "states":       ["NY", "VA"],
        "description":  "Ring B - NY/VA corridor",
    },
    "C": {
        "attorney":     "Coastal Injury Law",
        "clinic":       "Premier Wellness Center",
        "repair_shop":  "Elite Auto Repair",
        "states":       ["OH", "WV"],
        "description":  "Ring C - OH/WV corridor",
    },
}


def assign_attorney(is_fraud: bool) -> str:
    if is_fraud:
        pool = ATTORNEYS["fraud"] if random.random() < 0.70 else ATTORNEYS["clean"]
    else:
        # baseline noise
        pool = ATTORNEYS["fraud"] if random.random() < 0.05 else ATTORNEYS["clean"]
    return random.choice(pool)


def assign_clinic(is_fraud: bool, attorney: str) -> str:
    attorney_is_fraud = attorney in ATTORNEYS["fraud"]
    if is_fraud and attorney_is_fraud:
        pool = CLINICS["fraud"] if random.random() < 0.75 else CLINICS["clean"]
    else:
        pool = CLINICS["fraud"] if random.random() < 0.03 else CLINICS["clean"]
    return random.choice(pool)


def assign_repair_shop(is_fraud: bool) -> str:
    if is_fraud:
        pool = REPAIR_SHOPS["fraud"] if random.random() < 0.60 else REPAIR_SHOPS["clean"]
    else:
        pool = REPAIR_SHOPS["fraud"] if random.random() < 0.05 else REPAIR_SHOPS["clean"]
    return random.choice(pool)


def generate_narrative(row: pd.Series) -> str:
    is_fraud = str(row.get("fraud_reported", "N")).strip().upper() == "Y"

    fraud_instruction = (
        "Subtly include these fraud indicators: "
        "immediate specialist referral within 48 hours of the incident, "
        "vague pre-existing symptom language ('aggravated a prior condition'), "
        "and a specific dollar demand from the claimant."
    ) if is_fraud else (
        "Write as a genuine, straightforward description with no suspicious elements."
    )

    prompt = f"""Write a 2-3 sentence first-person insurance claim injury description.

Incident type: {row.get('incident_type', 'unknown')}
Severity: {row.get('incident_severity', 'unknown')}
Injury claim amount: ${row.get('injury_claim', 0)}
Collision type: {row.get('collision_type', 'unknown')}
Is fraudulent: {is_fraud}

{fraud_instruction}

Return ONLY the narrative text. No labels, no quotes, no prefixes."""

    if not USE_GEMINI:
        return (
            f"I was involved in a {row.get('incident_type', 'vehicle incident')} "
            f"resulting in {row.get('incident_severity', 'significant')} damage. "
            f"I am seeking ${row.get('injury_claim', 0)} for medical expenses and lost wages."
        )

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "quota" in error_msg.lower():
            print("\n[!] Hit Gemini rate limit. Sleeping for 30 seconds to let it cool down...")
            time.sleep(30)
            return "Narrative generation paused due to API limits."
        
        print(f"Gemini failed, using fallback...")
        # prevent downstream explosions on nulls
        return (
            f"I was involved in a {row.get('incident_type', 'vehicle incident')} "
            f"resulting in {row.get('incident_severity', 'significant')} damage. "
            f"I am seeking ${row.get('injury_claim', 0)} for medical expenses and lost wages."
        )


def enrich_dataset() -> pd.DataFrame:
    print("\nLoading Kaggle dataset...")
    df = pd.read_excel(
        INPUT_FILE,
        sheet_name="Fraud_Detection_decsion tree"  # keeping the original typo from kaggle source
    )
    df.replace("?", "", inplace=True)


    print(f"Loaded {len(df)} rows, {len(df.columns)} columns")

    fraud_mask = df["fraud_reported"].str.strip().str.upper() == "Y"
    fraud_indices = df[fraud_mask].index.tolist()
    print(f"Fraud rows: {fraud_mask.sum()} | Clean rows: {(~fraud_mask).sum()}")

    ring_assignments = {}
    ring_keys = list(FRAUD_RINGS.keys())
    for i, idx in enumerate(fraud_indices[:45]):
        ring_id = ring_keys[i // 15]
        ring_assignments[idx] = ring_id
    print(f"Fraud rings embedded: {len(ring_assignments)} claims across rings A, B, C")

    attorneys    = []
    clinics      = []
    repair_shops = []
    ring_ids     = []

    for idx, row in df.iterrows():
        is_fraud = fraud_mask[idx]
        ring_id  = ring_assignments.get(idx)

        if ring_id:
            ring = FRAUD_RINGS[ring_id]
            atty  = ring["attorney"]
            clin  = ring["clinic"]
            shop  = ring["repair_shop"]
            # force geography match for realism
            df.at[idx, "incident_state"] = random.choice(ring["states"])
        else:
            atty  = assign_attorney(is_fraud)
            clin  = assign_clinic(is_fraud, atty)
            shop  = assign_repair_shop(is_fraud)

        attorneys.append(atty)
        clinics.append(clin)
        repair_shops.append(shop)
        ring_ids.append(ring_id)

    df["attorney_name"]   = attorneys
    df["medical_provider"] = clinics
    df["repair_shop"]     = repair_shops
    df["ring_id"]         = ring_ids

    print("\nGenerating narratives via Gemini 2.5 Flash...")
    print("(Running on Google AI Pro - should finish in 2-3 mins.)")

    narratives = []
    for i, (_, row) in enumerate(df.iterrows()):
        narrative = generate_narrative(row)
        narratives.append(narrative)

        if (i + 1) % 50 == 0:
            print(f"{i + 1}/1000 narratives generated...")

        # Respect Gemini free tier rate limit (15 RPM), setting to 5s to be extremely safe (12 RPM)
        time.sleep(5)
    df["injury_narrative"] = narratives

    df.to_csv(OUTPUT_CSV, index=False)
    print(f"\nEnriched dataset saved -> {OUTPUT_CSV}")
    print(f"Columns now: {list(df.columns)}")

    return df


async def ingest_into_cognee(df: pd.DataFrame):
    print("\nConnecting to Cognee Cloud...")
    await cognee.serve(
        url=COGNEE_TENANT_URL,
        api_key=COGNEE_API_KEY,
    )
    print("Connected.")

    print(f"\nIngesting {len(df)} claims into dataset '{DATASET}'...")
    print("Each claim is structured as a JSON string so Cognee can")
    print("extract entities and build graph edges automatically.\n")

    success_count = 0
    error_count   = 0

    for i, (_, row) in enumerate(df.iterrows()):
        # shoving everything into a single json blob
        # cognee parses this internally to build the graph edges and vector embeddings
        claim_obj = {
            "claim_id":        str(row.get("policy_number", f"CLM-{i:05d}")),
            "ring_id":         str(row.get("ring_id")) if pd.notna(row.get("ring_id")) else None,

            "attorney_name":   row["attorney_name"],
            "medical_provider": row["medical_provider"],
            "repair_shop":     row["repair_shop"],
            "incident_state":  str(row.get("incident_state", "")),
            "incident_city":   str(row.get("incident_city", "")),

            "incident_type":       str(row.get("incident_type", "")),
            "incident_severity":   str(row.get("incident_severity", "")),
            "collision_type":      str(row.get("collision_type", "")),
            "incident_date":       str(row.get("incident_date", "")),

            "total_claim_amount": float(row.get("total_claim_amount", 0) or 0),
            "injury_claim":       float(row.get("injury_claim", 0) or 0),
            "vehicle_claim":      float(row.get("vehicle_claim", 0) or 0),
            "property_claim":     float(row.get("property_claim", 0) or 0),

            "police_report_available": str(row.get("police_report_available", "")),
            "property_damage":         str(row.get("property_damage", "")),
            "authorities_contacted":   str(row.get("authorities_contacted", "")),

            "injury_narrative": str(row.get("injury_narrative", "")),

            # model ground truth target
            "fraud_confirmed": str(row.get("fraud_reported", "N")).strip().upper() == "Y",
        }

        memory_text = (
            f"Insurance claim {claim_obj['claim_id']}. "
            f"Attorney: {claim_obj['attorney_name']}. "
            f"Medical provider: {claim_obj['medical_provider']}. "
            f"Repair shop: {claim_obj['repair_shop']}. "
            f"Location: {claim_obj['incident_city']}, {claim_obj['incident_state']}. "
            f"Incident: {claim_obj['incident_type']} - {claim_obj['incident_severity']}. "
            f"Total claim: ${claim_obj['total_claim_amount']}. "
            f"Fraud confirmed: {claim_obj['fraud_confirmed']}. "
            f"Narrative: {claim_obj['injury_narrative']} "
            f"Full data: {json.dumps(claim_obj)}"
        )

        try:
            await cognee.remember(
                memory_text,
                dataset_name=DATASET,
            )
            success_count += 1

            if (i + 1) % 100 == 0:
                print(f"{i + 1}/1000 claims ingested into Cognee")

        except Exception as e:
            error_count += 1
            print(f"Failed claim {i}: {e}")
            # log and swallow so we don't nuke the 15 min run
            continue

    await cognee.disconnect()

    print("\nCognee ingestion complete.")
    print(f"Success: {success_count} | Errors: {error_count}")
    print("\nYour Cognee Cloud memory layer is ready.")
    print(f"Dataset name for recall() calls: '{DATASET}'")
    print("Fraud rings A, B, C are embedded and queryable.")


async def main():
    print("=" * 55)
    print("  ClaimTrace - Enrichment & Ingestion Pipeline")
    print("=" * 55)

    # bypass the slow gemini calls if we already enriched
    if os.path.exists(OUTPUT_CSV):
        print(f"\nFound existing enriched CSV at {OUTPUT_CSV}")
        print("Skipping enrichment, going straight to Cognee ingestion.")
        print("(Delete the file to re-run enrichment from scratch.)\n")
        df = pd.read_csv(OUTPUT_CSV)
    else:
        df = enrich_dataset()

    await ingest_into_cognee(df)

    print("\n" + "=" * 55)
    print("  Done! Next steps:")
    print("  1. Open your Next.js app")
    print("  2. Add COGNEE_TENANT_URL + COGNEE_API_KEY to .env.local")
    print(f"  3. Use dataset_name='{DATASET}' in all recall() calls")
    print("  4. Run: npm run dev")
    print("=" * 55)


if __name__ == "__main__":
    asyncio.run(main())