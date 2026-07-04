import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "insurance_fraud_enriched.csv");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Parse the CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      cast: true,
    });

    // We don't want to send all 1000 claims to the frontend at once for a dashboard.
    // Let's grab the first 30 claims so there's a good mix.
    const selectedRecords = records.slice(0, 30);

    const formattedClaims = selectedRecords.map((record: any) => {
      const isFraud = record.fraud_reported === "Y";
      return {
        id: record.policy_number,
        attorneyName: record.attorney_name || "Unknown",
        medicalProvider: record.medical_provider || "Unknown",
        repairShop: record.repair_shop || "Unknown",
        incidentState: record.incident_state,
        incidentType: record.incident_type,
        incidentSeverity: record.incident_severity,
        totalClaimAmount: Number(record.total_claim_amount) || 0,
        injuryNarrative: record.injury_narrative || "",
        status: isFraud ? "FLAGGED" : "PENDING",
        riskScore: isFraud ? Math.floor(Math.random() * 15) + 80 : Math.floor(Math.random() * 30) + 10,
        riskLevel: isFraud ? "HIGH" : "LOW",
        // Adding a pseudo-timestamp just so the UI table has dates
        createdAt: new Date(record.incident_date || new Date()).toISOString(),
      };
    });

    return NextResponse.json(formattedClaims);
  } catch (error) {
    console.error("Error reading claims CSV:", error);
    return NextResponse.json({ error: "Failed to read claims" }, { status: 500 });
  }
}
