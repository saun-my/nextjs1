import postgres from 'postgres';
import FundLiveTable from '@/app/ui/dashboard/FundLiveTable';
import FundSearchPanel from '@/app/ui/dashboard/FundSearchPanel';
import QuickAddInvestment from '@/app/ui/dashboard/QuickAddInvestment';
import { users } from '@/app/lib/placeholder-data';
import QuickAddWatchlist from '@/app/ui/dashboard/QuickAddWatchlist';

async function fetchInvestments() {
  const sql = postgres(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING!, {
    ssl: process.env.POSTGRES_SSL === 'require' ? 'require' : undefined,
  });
  try {
    const rows = await sql`SELECT id, user_id, fund_code, amount, price, trade_date, note, action FROM investments ORDER BY trade_date ASC, id ASC LIMIT 100`;
    return rows as any[];
  } catch (e) {
    return [] as any[];
  }
}

async function fetchFunds() {
  try {
    const origin = process.env.NEXT_PUBLIC_BASE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? '3000'}`);
    const res = await fetch(`${origin}/api/funds/list`, { cache: 'no-store' });
    if (!res.ok) return [] as any[];
    const data = await res.json();
    return (data?.list || []) as any[];
  } catch {
    return [] as any[];
  }
}

async function fetchFundDetail(code: string) {
  try {
    const origin = process.env.NEXT_PUBLIC_BASE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? '3000'}`);
    const res = await fetch(`${origin}/api/funds/${encodeURIComponent(code)}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const info = data?.data?.[0] ?? null;
      if (info) return { code, name: info.name ?? '基金', nav: info.netWorth ?? null };
    }
  } catch {}
  try {
    const url = `http://fund.eastmoney.com/pingzhongdata/${code}.js`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const js = await res.text();
    const nameMatch = js.match(/var\s+fS_name\s*=\s*"([^"]+)"/);
    const trendMatch = js.match(/var\s+Data_netWorthTrend\s*=\s*(\[[\s\S]*?\]);/);
    let nav: number | null = null;
    if (trendMatch) {
      try {
        const arr = JSON.parse(trendMatch[1]);
        if (Array.isArray(arr) && arr.length) {
          const l = arr[arr.length - 1];
          nav = typeof l?.y === 'number' ? l.y : null;
        }
      } catch {}
    }
    return { code, name: nameMatch ? nameMatch[1] : '基金', nav };
  } catch {
    return null;
  }
}

export default async function DashboardInvestmentsPage() {
  const [records, funds] = await Promise.all([fetchInvestments(), fetchFunds()]);
  const byCode = new Map<string, { shares: number; cost: number; realized: number }>();
  for (const r of records) {
    const price = Number(r.price || 0);
    const amt = Number(r.amount || 0);
    if (!price || !amt) continue;
    const shares = amt / price;
    const cur = byCode.get(r.fund_code) || { shares: 0, cost: 0, realized: 0 };
    if ((r.action ?? 'buy') === 'sell') {
      const avgCost = cur.shares ? cur.cost / cur.shares : 0;
      const sellShares = shares;
      const reduceCost = avgCost * sellShares;
      cur.shares = Math.max(0, cur.shares - sellShares);
      cur.cost = Math.max(0, cur.cost - reduceCost);
      cur.realized += amt - reduceCost;
    } else {
      cur.shares += shares;
      cur.cost += amt;
    }
    byCode.set(r.fund_code, cur);
  }
  const codes = Array.from(byCode.keys());
  const details = await Promise.all(codes.map((c) => fetchFundDetail(c)));
  const rows = codes.map((code, i) => {
    const pos = byCode.get(code)!;
    const info = details[i];
    const nav = Number(info?.nav || 0);
    const mv = nav ? pos.shares * nav : 0;
    const pnl = mv - pos.cost;
    const pnlPct = pos.cost ? (pnl / pos.cost) * 100 : 0;
    const avgCost = pos.shares ? pos.cost / pos.shares : 0;
    return { code, name: info?.name ?? '基金', shares: pos.shares, avgCost, nav, marketValue: mv, cost: pos.cost, pnl, pnlPct, realized: pos.realized };
  }).sort((a, b) => b.marketValue - a.marketValue);
  const totalCost = rows.reduce((s, r) => s + r.cost, 0);
  const totalMV = rows.reduce((s, r) => s + r.marketValue, 0);
  const totalPNL = totalMV - totalCost;
  const totalRealized = rows.reduce((s, r) => s + r.realized, 0);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Investments</h1>

      <div className="bg-white rounded-lg shadow-sm border">
        <FundSearchPanel />
      </div>

      <WatchlistSection />

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">持仓概览</h2>
          <div className="text-sm text-gray-600">市值 {totalMV.toLocaleString(undefined,{maximumFractionDigits:2})} · 成本 {totalCost.toLocaleString(undefined,{maximumFractionDigits:2})} · 未实现盈亏 <span className={totalPNL>=0?'text-green-700':'text-red-600'}>{totalPNL.toLocaleString(undefined,{maximumFractionDigits:2})}</span> · 已实现盈亏 <span className={totalRealized>=0?'text-green-700':'text-red-600'}>{totalRealized.toLocaleString(undefined,{maximumFractionDigits:2})}</span></div>
          <a href="/dashboard/investments/analytics" className="ml-4 px-3 py-1.5 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700">投资分析</a>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">基金</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">持仓份额</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">均价</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">现价</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">市值</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">盈亏</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">盈亏%</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">已实现盈亏</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.code} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3"><a className="text-blue-600 hover:underline" href={`/funds/${r.code}`}>{r.code} · {r.name}</a></td>
                  <td className="px-6 py-3">{r.shares.toLocaleString(undefined,{maximumFractionDigits:2})}</td>
                  <td className="px-6 py-3">{r.avgCost.toFixed(4)}</td>
                  <td className="px-6 py-3">{r.nav ? r.nav.toFixed(4) : <span className="text-xs text-gray-500">暂无</span>}</td>
                  <td className="px-6 py-3">{r.marketValue.toLocaleString(undefined,{maximumFractionDigits:2})}</td>
                  <td className={`px-6 py-3 ${r.pnl>=0?'text-green-700':'text-red-600'}`}>{r.pnl.toLocaleString(undefined,{maximumFractionDigits:2})}</td>
                  <td className={`px-6 py-3 ${r.pnl>=0?'text-green-700':'text-red-600'}`}>{r.pnlPct.toFixed(2)}%</td>
                  <td className={`px-6 py-3 ${r.realized>=0?'text-green-700':'text-red-600'}`}>{r.realized.toLocaleString(undefined,{maximumFractionDigits:2})}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-center text-gray-500" colSpan={7}>暂无持仓</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">我的投资记录</h2>
          <div className="flex items-center gap-2">
            <a href="/investments" className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700">新增持有</a>
            <QuickAddInvestment defaultUserId={users[0]?.id} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">日期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">基金代码</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">金额/份额</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">价格</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">用户ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">备注</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-6 py-3">{typeof r.trade_date === 'string' ? r.trade_date.slice(0,10) : r.trade_date instanceof Date ? r.trade_date.toISOString().slice(0,10) : String(r.trade_date)}</td>
                  <td className="px-6 py-3">{r.fund_code}</td>
                  <td className="px-6 py-3">{r.amount}</td>
                  <td className="px-6 py-3">{r.price}</td>
                  <td className="px-6 py-3 text-xs text-gray-500">{r.user_id}</td>
                  <td className="px-6 py-3">{r.note ?? ''}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-center text-gray-500" colSpan={6}>暂无记录</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <FundLiveTable />
      </div>
    </div>
  );
}

async function fetchWatchlist(userId?: string) {
  try {
    const origin = process.env.NEXT_PUBLIC_BASE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? '3000'}`);
    const res = await fetch(`${origin}/api/investments/watchlist` + (userId ? `?userId=${encodeURIComponent(userId)}` : ''), { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch { return [] }
}

async function fetchRealtime(code: string) {
  try {
    const origin = process.env.NEXT_PUBLIC_BASE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? '3000'}`);
    const res = await fetch(`${origin}/api/funds/realtime/${encodeURIComponent(code)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null }
}

async function WatchlistSection() {
  const list = await fetchWatchlist();
  const items = await Promise.all(list.map(async (w: any) => {
    const rt = await fetchRealtime(w.fund_code);
    return { id: w.id, code: w.fund_code, estNet: rt?.estNet ?? null, estPct: rt?.estChangePct ?? null, time: rt?.estTime ?? null, name: rt?.name ?? '' };
  }));
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">我的自选</h2>
        <div className="flex items-center gap-2">
          <a href="/investments" className="px-3 py-1.5 text-sm rounded bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white">管理</a>
          <QuickAddWatchlist defaultUserId={users[0]?.id} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">基金</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">估算净值</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">估算涨跌</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">时间</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it: any) => (
              <tr key={it.id} className="border-t">
                <td className="px-6 py-3"><a className="text-blue-600 hover:underline" href={`/funds/${it.code}`}>{it.code} · {it.name || '基金'}</a></td>
                <td className="px-6 py-3">{it.estNet != null ? Number(it.estNet).toFixed(4) : <span className="text-xs text-gray-500">暂无</span>}</td>
                <td className={`px-6 py-3 ${it.estPct!=null && Number(it.estPct)>=0?'text-green-700':'text-red-600'}`}>{it.estPct!=null ? `${Number(it.estPct).toFixed(2)}%` : '-'}</td>
                <td className="px-6 py-3 text-xs text-gray-500">{it.time ?? '-'}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="px-6 py-8 text-center text-gray-500" colSpan={4}>暂无自选</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
