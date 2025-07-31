import { NextRequest, NextResponse } from 'next/server';
import { createFeedback } from '@/lib/actions/general.action';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await createFeedback(body);
  return NextResponse.json(result);
}
