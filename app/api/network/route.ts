import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  const data = {
    rings: [
      {
        id: "A",
        attorneyId: "att-kaplan",
        clinicId: "clin-summit",
        repairShopId: "rep-quickfix",
        claimCount: 15,
        confirmedFraudCount: 12,
        corridor: "SC/NC Corridor"
      },
      {
        id: "B",
        attorneyId: "att-sterling",
        clinicId: "clin-vitality",
        repairShopId: "rep-precision",
        claimCount: 22,
        confirmedFraudCount: 22,
        corridor: "GA/FL Corridor"
      },
      {
        id: "C",
        attorneyId: "att-vanguard",
        clinicId: "clin-pinnacle",
        repairShopId: "rep-apex",
        claimCount: 8,
        confirmedFraudCount: 8,
        corridor: "TX/LA Corridor"
      }
    ],
    entities: [
      // RING A
      { id: "att-kaplan", type: "attorney", label: "Kaplan & Associates", claimCount: 18, fraudCount: 15, ringId: "A", states: ["SC", "NC"], avgClaimAmount: 14500 },
      { id: "clin-summit", type: "clinic", label: "Summit Rehab Clinic", claimCount: 21, fraudCount: 17, ringId: "A", states: ["SC", "NC"], avgClaimAmount: 8200 },
      { id: "rep-quickfix", type: "repair_shop", label: "QuickFix Auto Body", claimCount: 15, fraudCount: 12, ringId: "A", states: ["SC"], avgClaimAmount: 3400 },
      // RING B
      { id: "att-sterling", type: "attorney", label: "Sterling Legal Group", claimCount: 25, fraudCount: 25, ringId: "B", states: ["GA", "FL"], avgClaimAmount: 22000 },
      { id: "clin-vitality", type: "clinic", label: "Vitality Wellness Center", claimCount: 30, fraudCount: 28, ringId: "B", states: ["FL"], avgClaimAmount: 11500 },
      { id: "rep-precision", type: "repair_shop", label: "Precision Collision", claimCount: 22, fraudCount: 22, ringId: "B", states: ["GA", "FL"], avgClaimAmount: 6200 },
      // RING C
      { id: "att-vanguard", type: "attorney", label: "Vanguard Law Partners", claimCount: 12, fraudCount: 8, ringId: "C", states: ["TX"], avgClaimAmount: 19500 },
      { id: "clin-pinnacle", type: "clinic", label: "Pinnacle Pain Management", claimCount: 14, fraudCount: 10, ringId: "C", states: ["TX", "LA"], avgClaimAmount: 10500 },
      { id: "rep-apex", type: "repair_shop", label: "Apex Customs", claimCount: 9, fraudCount: 8, ringId: "C", states: ["TX"], avgClaimAmount: 4800 },
      // LEGITIMATE (No Ring)
      { id: "att-smith", type: "attorney", label: "Smith & Doe", claimCount: 45, fraudCount: 1, ringId: null, states: ["NY", "NJ"], avgClaimAmount: 6500 },
      { id: "clin-city", type: "clinic", label: "City General Hospital", claimCount: 250, fraudCount: 2, ringId: null, states: ["NY"], avgClaimAmount: 4200 },
      { id: "rep-bobs", type: "repair_shop", label: "Bob's Auto", claimCount: 85, fraudCount: 0, ringId: null, states: ["NY", "NJ"], avgClaimAmount: 1800 }
    ],
    claims: [] as any[]
  };

  // Generate Claims for Ring A
  for (let i = 0; i < 15; i++) {
    data.claims.push({
      id: `clm-a-${i}`, attorneyId: "att-kaplan", clinicId: "clin-summit", repairShopId: "rep-quickfix",
      isFraud: i < 12, ringId: "A", amount: 15000 + (Math.random() * 5000), state: "SC",
      narrativePreview: "Rear-end collision at low speed. Patient reports severe whiplash..."
    });
  }
  
  // Generate Claims for Ring B
  for (let i = 0; i < 22; i++) {
    data.claims.push({
      id: `clm-b-${i}`, attorneyId: "att-sterling", clinicId: "clin-vitality", repairShopId: "rep-precision",
      isFraud: true, ringId: "B", amount: 25000 + (Math.random() * 8000), state: "FL",
      narrativePreview: "Intersection T-bone. Multiple passengers claiming soft tissue injuries..."
    });
  }

  // Generate Claims for Ring C
  for (let i = 0; i < 8; i++) {
    data.claims.push({
      id: `clm-c-${i}`, attorneyId: "att-vanguard", clinicId: "clin-pinnacle", repairShopId: "rep-apex",
      isFraud: i < 8, ringId: "C", amount: 18000 + (Math.random() * 6000), state: "TX",
      narrativePreview: "Sideswipe on highway. Driver claims extensive vehicle damage and back pain..."
    });
  }

  // Generate Safe Claims
  for (let i = 0; i < 10; i++) {
    data.claims.push({
      id: `clm-safe-${i}`, attorneyId: "att-smith", clinicId: "clin-city", repairShopId: "rep-bobs",
      isFraud: false, ringId: null, amount: 4500 + (Math.random() * 2000), state: "NY",
      narrativePreview: "Fender bender in parking lot. Minor bumper damage and precautionary checkup."
    });
  }

  return NextResponse.json(data);
}
