import { NextRequest, NextResponse } from 'next/server';
import { createInterview } from '@/lib/actions/auth.action';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await createInterview(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error?.toString() });
  }
}
