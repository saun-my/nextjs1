async function fetchFund(code: string) {
  try {
    const res = await fetch(`/api/funds/${code}`, { cache: 'no-store' });
    if (res?.ok) return res.json();
  } catch {}
  try {
    const origin = process.env.NEXT_PUBLIC_BASE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? '3000'}`);
    const res2 = await fetch(`${origin}/api/funds/${code}`, { cache: 'no-store' });
    if (res2?.ok) return res2.json();
  } catch {}
  return null;
}

async function fetchPingzhongSeries(code: string): Promise<Array<{ date: string; value: number }>> {
  try {
    const url = `http://fund.eastmoney.com/pingzhongdata/${code}.js`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const js = await res.text();
    const trendMatch = js.match(/var\s+Data_netWorthTrend\s*=\s*(\[[\s\S]*?\]);/);
    if (!trendMatch) return [];
    const arr = JSON.parse(trendMatch[1]);
    return arr
      .map((p: any) => ({ date: p?.x ? new Date(p.x).toISOString().slice(0, 10) : '', value: typeof p?.y === 'number' ? p.y : null }))
      .filter((d: any) => d.value != null && d.date);
  } catch {
    return [];
  }
}

async function fetchPingzhongBasic(code: string): Promise<{ name?: string; type?: string } | null> {
  try {
    const url = `http://fund.eastmoney.com/pingzhongdata/${code}.js`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const js = await res.text();
    const nameMatch = js.match(/var\s+fS_name\s*=\s*"([^"]+)"/);
    const typeMatch = js.match(/var\s+fS_type\s*=\s*"([^"]+)"/);
    return { name: nameMatch ? nameMatch[1] : undefined, type: typeMatch ? typeMatch[1] : undefined };
  } catch {
    return null;
  }
}

async function fetchEastmoneyBasic(code: string): Promise<{ name?: string; type?: string } | null> {
  try {
    const url = `http://fund.eastmoney.com/${code}.html`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const html = await res.text();
    const nameMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/);
    const typeMatch = html.match(/基金类型：<a[^>]*>(.*?)<\/a>/);
    return { name: nameMatch ? nameMatch[1].trim() : undefined, type: typeMatch ? typeMatch[1].trim() : undefined };
  } catch {
    return null;
  }
}

function buildLinePath(series: Array<{ date: string; value: number }>, width: number, height: number, padding: number) {
  const n = series.length;
  if (n === 0) return '';
  const values = series.map((s) => s.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const w = width - padding * 2;
  const h = height - padding * 2;
  const norm = (v: number) => (max === min ? 0.5 : (v - min) / (max - min));
  let d = '';
  series.forEach((s, i) => {
    const x = padding + (n === 1 ? w / 2 : (i / (n - 1)) * w);
    const y = padding + (1 - norm(s.value)) * h;
    d += `${i === 0 ? 'M' : 'L'}${x},${y} `;
  });
  return d.trim();
}

export default async function FundDetailPage(props: { params: Promise<{ code: string }>, searchParams?: { name?: string } }) {
  const { code } = await props.params;
  const data = await fetchFund(code);
  const info = data?.data?.[0] ?? null;
  let series: Array<{ date: string; value: number }> = Array.isArray(data?.series) ? data.series : [];
  if (!series || series.length === 0) {
    series = await fetchPingzhongSeries(code);
  }
  let basic = (!info?.name || info.name === '基金') ? await fetchPingzhongBasic(code) : null;
  if ((!basic?.name || basic.name === '基金') && (!info?.name || info.name === '基金')) {
    const htmlBasic = await fetchEastmoneyBasic(code);
    basic = htmlBasic ?? basic;
  }
  const displayName = props.searchParams?.name ?? basic?.name ?? info?.name ?? '未知基金';
  const trimmed = series.slice(Math.max(0, series.length - 180));
  const path = buildLinePath(trimmed, 800, 240, 24);
  const min = trimmed.length ? Math.min(...trimmed.map((s) => s.value)) : null;
  const max = trimmed.length ? Math.max(...trimmed.map((s) => s.value)) : null;
  const startDate = trimmed[0]?.date ?? null;
  const endDate = trimmed[trimmed.length - 1]?.date ?? null;
  const latest = series?.length ? series[series.length - 1] : null;
  const prev = series?.length > 1 ? series[series.length - 2] : null;
  const fallbackNet = latest?.value ?? null;
  const fallbackDate = latest?.date ?? null;
  const fallbackDay = latest && prev && prev.value ? ((latest.value - prev.value) / prev.value) * 100 : null;
  function findByDaysAgo(days: number) {
    if (!latest) return null;
    const t = new Date(latest.date).getTime() - days * 24 * 60 * 60 * 1000;
    for (let i = series.length - 1; i >= 0; i--) {
      const d = new Date(series[i].date).getTime();
      if (d <= t) return series[i];
    }
    return series[0] ?? null;
  }
  function pct(a?: number | null, b?: number | null) {
    if (a == null || b == null || b === 0) return null;
    return ((a - b) / b) * 100;
  }
  const p1m = findByDaysAgo(30);
  const p3m = findByDaysAgo(90);
  const p1y = findByDaysAgo(365);
  const fallback1m = pct(latest?.value ?? null, p1m?.value ?? null);
  const fallback3m = pct(latest?.value ?? null, p3m?.value ?? null);
  const fallback1y = pct(latest?.value ?? null, p1y?.value ?? null);
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">基金详情</h1>
          <div className="mt-1 text-sm text-gray-600">{code} · {displayName}</div>
        </div>
        <a href="/dashboard/investments" className="px-3 py-1.5 text-sm rounded bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white">返回</a>
      </div>
      <div className="bg-white border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border p-4 bg-gradient-to-br from-blue-50 to-white">
            <div className="text-sm text-gray-500">净值</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{(info?.netWorth ?? fallbackNet) ?? '-'}</div>
            <div className="text-xs text-gray-500 mt-1">{(info?.netWorthDate ?? fallbackDate) ?? '-'}</div>
          </div>
          <div className="rounded-xl border p-4 bg-gradient-to-br from-green-50 to-white">
            <div className="text-sm text-gray-500">日涨跌</div>
            {(() => {
              const d = info?.dayGrowth ?? fallbackDay;
              const cls = d == null ? 'text-gray-500' : Number(d) >= 0 ? 'text-green-700' : 'text-red-600';
              const txt = d == null ? '-' : `${Number(d).toFixed(2)}%`;
              return <div className={`text-2xl font-bold mt-1 ${cls}`}>{txt}</div>;
            })()}
            <div className="text-xs text-gray-500 mt-1">{basic?.type ?? info?.type ?? '-'}</div>
          </div>
          <div className="rounded-xl border p-4 bg-gradient-to-br from-indigo-50 to-white">
            <div className="text-sm text-gray-500">区间涨跌</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(() => {
                const v = info?.lastMonthGrowth ?? (fallback1m != null ? Number(fallback1m).toFixed(2) : null);
                const cls = v != null && Number(v) < 0 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200';
                return <span className={`px-2 py-0.5 rounded-full text-xs ${cls}`}>近一月 {v!=null?`${v}%`:'-'}</span>;
              })()}
              {(() => {
                const v = info?.lastThreeMonthsGrowth ?? (fallback3m != null ? Number(fallback3m).toFixed(2) : null);
                const cls = v != null && Number(v) < 0 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200';
                return <span className={`px-2 py-0.5 rounded-full text-xs ${cls}`}>近三月 {v!=null?`${v}%`:'-'}</span>;
              })()}
              {(() => {
                const v = info?.lastYearGrowth ?? (fallback1y != null ? Number(fallback1y).toFixed(2) : null);
                const cls = v != null && Number(v) < 0 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200';
                return <span className={`px-2 py-0.5 rounded-full text-xs ${cls}`}>近一年 {v!=null?`${v}%`:'-'}</span>;
              })()}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border rounded-lg p-4 mt-6">
        <div className="text-lg font-semibold mb-2">净值走势</div>
        <FundDetailChart series={series} />
      </div>
    </div>
  );
}
import FundDetailChart from '@/app/ui/dashboard/FundDetailChart';
