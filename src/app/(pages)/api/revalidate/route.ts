import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest): Promise<Response> {
  const path = request.nextUrl.searchParams.get('path');
  const secret = request.nextUrl.searchParams.get('secret');

  if (!secret || secret !== process.env.NEXT_REVALIDATION_KEY || !path || typeof path !== 'string' || path.length < 1) {
    return new Response('Invalid request', { status: 400 });
  }

  console.log('Revalidating path:', path);
  revalidatePath(path);
  return NextResponse.json({ now: Date.now(), revalidated: true });
}
