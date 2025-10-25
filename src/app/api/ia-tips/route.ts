import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '../backend';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') ?? 'U1';

  const body = await req.json().catch(() => ({}));
  const res = await backendFetch(`/api/ai-tips?userId=${encodeURIComponent(userId)}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}
