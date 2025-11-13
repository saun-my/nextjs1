 

import { NextRequest } from 'next/server';



export async function GET(req: NextRequest) {
  try {
    const res = await fetch('https://api.doctorxiong.club/v1/fund/rank', { cache: 'no-store' });
    if (!res.ok) return Response.json({ error: 'fetch failed' }, { status: 500 });
    const data = await res.json();
    const list = (data?.data || []).map((it: any) => ({
      code: it.code,
      name: it.name,
      net: it.netWorth || it.net || null,
      dayGrowth: it.dayGrowth || it.expectGrowth || 0,
      lastUpdate: it.lastUpdate || it.netWorthDate || null,
      type: it.type || '',
    }));
    return Response.json({ list, count: list.length });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
