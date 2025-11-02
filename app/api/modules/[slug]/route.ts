import { NextRequest, NextResponse } from 'next/server';
import { getModule } from '@/lib/db/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const module = await getModule(slug);

    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(module);
  } catch (error: any) {
    console.error('Error fetching module:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
