import { NextRequest } from 'next/server';

async function fetchFundGZ(code: string) {
  const url = `http://fundgz.1234567.com.cn/js/${code}.js?rt=${Date.now()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('fetch failed');
  const txt = await res.text();
  const m = txt.match(/jsonpgz\((\{[\s\S]*?\})\);/);
  if (!m) throw new Error('parse failed');
  const obj = JSON.parse(m[1]);
  return obj;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const data = await fetchFundGZ(code);
    return Response.json({
      code: data?.fundcode || code,
      name: data?.name || undefined,
      estNet: data?.gsz ? Number(data.gsz) : null,
      estChangePct: data?.gszzl ? Number(data.gszzl) : null,
      estTime: data?.gztime || null,
      lastNet: data?.dwjz ? Number(data.dwjz) : null,
      lastDate: data?.jzrq || null,
    });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}

