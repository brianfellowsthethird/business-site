import { NextResponse } from 'next/server';
import { getAllModules } from '@/lib/db/client';

export async function GET() {
  try {
    const modules = await getAllModules();
    return NextResponse.json(modules);
  } catch (error: any) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
