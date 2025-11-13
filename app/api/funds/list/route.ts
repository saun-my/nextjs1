import { NextRequest } from 'next/server';

function toList(data: any[]): any[] {
  return (data || []).map((it: any) => ({
    code: it.code,
    name: it.name,
    net: it.netWorth || it.net || null,
    dayGrowth: it.dayGrowth || it.expectGrowth || 0,
    lastUpdate: it.lastUpdate || it.netWorthDate || null,
    type: it.type || '',
  }));
}

async function fetchWithTimeout(url: string, ms: number) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { cache: 'no-store', signal: controller.signal });
    if (!res.ok) throw new Error('fetch failed');
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

async function fetchEastmoneyRank(pn: number) {
  const ts = Date.now();
  const url = `https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=all&rs=&gs=0&sc=zzf&st=desc&qdii=&tabSubtype=,,,,,&pi=1&pn=${pn}&dx=1&v=${ts}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('fetch failed');
  const text = await res.text();
  const m = text.match(/\/\*\*(.*?)\*\*\/|\((\{[\s\S]*?\})\)/);
  const payload = m?.[1] || m?.[2] || '';
  const jsonMatch = payload.match(/\{[\s\S]*\}/);
  const raw = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  const rows: string[] = raw?.datas || [];
  const list = rows.map((row: string) => {
    const parts = row.split(',');
    return {
      code: parts[0],
      name: parts[1],
      net: null,
      dayGrowth: Number(parts[7] || 0),
      lastUpdate: null,
      type: parts[3] || ''
    };
  });
  return list;
}

async function fetchEastmoneyMobile(pageSize: number) {
  const url = `https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo?appType=ttjj&product=EFund&plat=Iphone&SRC=kf&Sort=desc&FundTypeCode=&PageIndex=1&PageSize=${pageSize}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('fetch failed');
  const json = await res.json();
  const rows: any[] = json?.Datas || [];
  return rows.map((it: any) => ({
    code: it.FCODE,
    name: it.SHORTNAME,
    net: it.NAV ? Number(it.NAV) : null,
    dayGrowth: it.GSZZL ? Number(it.GSZZL) : 0,
    lastUpdate: it.NAVDATE || null,
    type: it.FTNAME || ''
  }));
}

async function fetchPingzhongItem(code: string) {
  const url = `http://fund.eastmoney.com/pingzhongdata/${code}.js`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('fetch failed');
  const js = await res.text();
  const nameMatch = js.match(/var\s+fS_name\s*=\s*"([^"]+)"/);
  const typeMatch = js.match(/var\s+fS_type\s*=\s*"([^"]+)"/);
  const name = nameMatch ? nameMatch[1] : code;
  const type = typeMatch ? typeMatch[1] : '';
  const trendMatch = js.match(/var\s+Data_netWorthTrend\s*=\s*(\[[\s\S]*?\]);/);
  let net: number | null = null;
  let lastUpdate: string | null = null;
  let dayGrowth = 0;
  if (trendMatch) {
    try {
      const arr = JSON.parse(trendMatch[1]);
      if (Array.isArray(arr) && arr.length > 0) {
        const l = arr.length - 1;
        const latest = arr[l];
        net = typeof latest?.y === 'number' ? latest.y : null;
        lastUpdate = latest?.x ? new Date(latest.x).toISOString().slice(0, 10) : null;
        if (l > 0 && typeof arr[l - 1]?.y === 'number' && arr[l - 1].y > 0 && net != null) {
          dayGrowth = Number((((net - arr[l - 1].y) / arr[l - 1].y) * 100).toFixed(2));
        }
      }
    } catch {}
  }
  return { code, name, net, dayGrowth, lastUpdate, type };
}

async function fetchPingzhongList(codes: string[]) {
  const results = await Promise.all(
    codes.map(async (c) => {
      try {
        return await fetchPingzhongItem(c);
      } catch {
        return { code: c, name: c, net: null, dayGrowth: 0, lastUpdate: null, type: '' };
      }
    })
  );
  return results;
}

export async function GET(req: NextRequest) {
  try {
    const listUrl = process.env.FUND_API_LIST_URL || 'https://api.doctorxiong.club/v1/fund/rank';
    try {
      const data = await fetchWithTimeout(listUrl, 4000);
      const list = toList(data?.data || data?.list || []);
      if (list.length > 0) return Response.json({ list, count: list.length, source: listUrl });
    } catch {}
    try {
      const list = await fetchEastmoneyMobile(50);
      if (list.length > 0) return Response.json({ list, count: list.length, source: 'eastmoney' });
    } catch {}
    const defaultCodes = (process.env.FUND_TOP_CODES || '110022,161725,519732,001632,003095')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      const list = await fetchPingzhongList(defaultCodes);
      return Response.json({ list, count: list.length, source: 'pingzhongdata' });
    } catch {}
    const fallback = defaultCodes.map((c) => ({ code: c, name: c, net: null, dayGrowth: 0, lastUpdate: null, type: '' }));
    return Response.json({ list: fallback, count: fallback.length, source: 'fallback' });
  } catch (e) {
    const defaultCodes = (process.env.FUND_TOP_CODES || '110022,161725,519732,001632,003095')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const fallback = defaultCodes.map((c) => ({ code: c, name: c, net: null, dayGrowth: 0, lastUpdate: null, type: '' }));
    return Response.json({ list: fallback, count: fallback.length, source: 'fallback' });
  }
}
