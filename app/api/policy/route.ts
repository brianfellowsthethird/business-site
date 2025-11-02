import { NextRequest, NextResponse } from 'next/server';
import { getPolicyEvents } from '@/lib/db/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    const events = await getPolicyEvents(limit);
    return NextResponse.json(events);
  } catch (error: any) {
    console.error('Error fetching policy events:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
