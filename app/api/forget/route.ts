import { cogneeForget } from '@/lib/cognee';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    const { claimId } = await req.json();
    const success = await cogneeForget(claimId);
    
    if (!success) {
      return NextResponse.json({ error: "Failed to purge memory nodes" }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in forget route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
