import { cogneeImprove } from '@/lib/cognee';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { claimId, decision, aiWasCorrect } = await req.json();
    const success = await cogneeImprove(claimId, decision, aiWasCorrect);
    
    if (!success) {
      return NextResponse.json({ error: "Failed to update memory layer" }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in improve route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
