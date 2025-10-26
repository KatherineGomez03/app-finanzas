import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '../backend';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') ?? 'U1';

  const res = await backendFetch(`/api/inventory?userId=${encodeURIComponent(userId)}`);
  const data = await res.json();
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') ?? 'U1';
  const body = await req.json();

  const res = await backendFetch(`/api/inventory?userId=${encodeURIComponent(userId)}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}
