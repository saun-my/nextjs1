 

import { NextRequest } from 'next/server';



export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const res = await fetch(`https://api.doctorxiong.club/v1/fund?code=${encodeURIComponent(code)}`, { cache: 'no-store' });
    if (!res.ok) return Response.json({ error: 'fetch failed' }, { status: 500 });
    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
