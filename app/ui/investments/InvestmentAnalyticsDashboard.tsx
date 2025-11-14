'use client';

import { useEffect, useMemo, useState } from 'react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface RecordItem { id: string; user_id: string; fund_code: string; amount: number; price: number; trade_date: string; note?: string; action?: 'buy'|'sell'; }
interface SeriesPoint { date: string; value: number }

async function fetchInvestments(userId?: string): Promise<RecordItem[]> {
  const url = userId ? `/api/investments?userId=${encodeURIComponent(userId)}` : '/api/investments';
  const res = await fetch(url, { cache: 'no-store' });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function fetchPingzhongSeries(code: string): Promise<SeriesPoint[]> {
  try {
    const url = `http://fund.eastmoney.com/pingzhongdata/${code}.js`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const js = await res.text();
    const trendMatch = js.match(/var\s+Data_netWorthTrend\s*=\s*(\[[\s\S]*?\]);/);
    if (!trendMatch) return [];
    const arr = JSON.parse(trendMatch[1]);
    return arr.map((p: any) => ({ date: p?.x ? new Date(p.x).toISOString().slice(0,10) : '', value: typeof p?.y === 'number' ? p.y : null })).filter((d: any) => d.value != null && d.date);
  } catch { return [] }
}

function toISO(d: any): string { try { return typeof d === 'string' ? d.slice(0,10) : d instanceof Date ? d.toISOString().slice(0,10) : new Date(d).toISOString().slice(0,10) } catch { return '' } }

export default function InvestmentAnalyticsDashboard({ userId }: { userId?: string }) {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [seriesMap, setSeriesMap] = useState<Record<string, SeriesPoint[]>>({});
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'area'|'line'|'bar'>('area');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const recs = await fetchInvestments(userId);
      // sort ascending by date for holdings calc
      recs.sort((a,b)=> new Date(toISO(a.trade_date)).getTime() - new Date(toISO(b.trade_date)).getTime());
      setRecords(recs);
      const codes = Array.from(new Set(recs.map(r=>r.fund_code)));
      const entries = await Promise.all(codes.map(async c => [c, await fetchPingzhongSeries(c)] as const));
      const map: Record<string, SeriesPoint[]> = {};
      entries.forEach(([c,s]) => { map[c] = s });
      setSeriesMap(map);
      setLoading(false);
    })();
  }, [userId]);

  const holdings = useMemo(() => {
    const byCode = new Map<string, { shares: number; cost: number; realized: number }>();
    for (const r of records) {
      const price = Number(r.price||0), amt = Number(r.amount||0);
      if (!price || !amt) continue;
      const shares = amt / price;
      const cur = byCode.get(r.fund_code) || { shares: 0, cost: 0, realized: 0 };
      if ((r.action ?? 'buy') === 'sell') {
        const avgCost = cur.shares ? cur.cost / cur.shares : 0;
        const reduceCost = avgCost * shares;
        cur.shares = Math.max(0, cur.shares - shares);
        cur.cost = Math.max(0, cur.cost - reduceCost);
        cur.realized += amt - reduceCost;
      } else {
        cur.shares += shares;
        cur.cost += amt;
      }
      byCode.set(r.fund_code, cur);
    }
    return byCode;
  }, [records]);

  const allocationData = useMemo(() => {
    const data: Array<{ name: string; value: number }>=[];
    for (const [code, pos] of holdings.entries()) {
      const s = seriesMap[code];
      const nav = s?.length ? s[s.length-1].value : 0;
      const mv = pos.shares * nav;
      data.push({ name: code, value: Number(mv.toFixed(2)) });
    }
    return data.sort((a,b)=>b.value-a.value);
  }, [holdings, seriesMap]);

  const equityData = useMemo(() => {
    // combine series per day
    const dates = new Set<string>();
    Object.values(seriesMap).forEach(s => s.forEach(p => dates.add(p.date)));
    const sorted = Array.from(dates).sort();
    const arr: Array<{ date: string; value: number }>=[];
    for (const d of sorted.slice(-180)) {
      let v = 0;
      for (const [code, pos] of holdings.entries()) {
        const s = seriesMap[code];
        if (!s || !s.length) continue;
        // find nearest <= d
        let pv: number | null = null;
        for (let i=s.length-1;i>=0;i--) { if (s[i].date <= d) { pv = s[i].value; break; } }
        if (pv != null) v += pos.shares * pv;
      }
      arr.push({ date: d, value: Number(v.toFixed(2)) });
    }
    return arr;
  }, [holdings, seriesMap]);

  const totals = useMemo(() => {
    const totalCost = Array.from(holdings.values()).reduce((s,r)=>s+r.cost,0);
    const totalMV = allocationData.reduce((s,r)=>s+r.value,0);
    const totalPNL = totalMV - totalCost;
    const totalRealized = Array.from(holdings.values()).reduce((s,r)=>s+r.realized,0);
    return { totalCost, totalMV, totalPNL, totalRealized };
  }, [holdings, allocationData]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-64 bg-gray-200 rounded mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-sm text-gray-600">组合市值</p>
          <p className="text-2xl font-bold text-gray-900">{totals.totalMV.toLocaleString(undefined,{maximumFractionDigits:2})}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-sm text-gray-600">组合成本</p>
          <p className="text-2xl font-bold text-gray-900">{totals.totalCost.toLocaleString(undefined,{maximumFractionDigits:2})}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-sm text-gray-600">未实现盈亏</p>
          <p className={`text-2xl font-bold ${totals.totalPNL>=0?'text-green-700':'text-red-600'}`}>{totals.totalPNL.toLocaleString(undefined,{maximumFractionDigits:2})}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-sm text-gray-600">已实现盈亏</p>
          <p className={`text-2xl font-bold ${totals.totalRealized>=0?'text-green-700':'text-red-600'}`}>{totals.totalRealized.toLocaleString(undefined,{maximumFractionDigits:2})}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">组合净值趋势</h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[{type:'area',label:'面积'},{type:'line',label:'折线'},{type:'bar',label:'柱状'}].map(({type,label})=> (
              <button key={type} onClick={()=>setChartType(type as any)} className={`px-2 py-1 text-xs rounded-md ${chartType===type?'bg-white text-blue-600':'text-gray-600 hover:text-gray-900'}`}>{label}</button>
            ))}
          </div>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            {chartType==='line' ? (
              <LineChart data={equityData} margin={{ top:5, right:30, left:20, bottom:5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            ) : chartType==='bar' ? (
              <BarChart data={equityData} margin={{ top:5, right:30, left:20, bottom:5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" radius={[4,4,0,0]} />
              </BarChart>
            ) : (
              <AreaChart data={equityData} margin={{ top:5, right:30, left:20, bottom:5 }}>
                <defs>
                  <linearGradient id="eqGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#eqGradient)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">持仓分布</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={allocationData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6","#06B6D4"][index % 6]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div>
              <ul className="space-y-2">
                {allocationData.map(a => (
                  <li key={a.name} className="flex items-center justify-between">
                    <span className="text-gray-700">{a.name}</span>
                    <span className="text-gray-900 font-semibold">{a.value.toLocaleString(undefined,{maximumFractionDigits:2})}</span>
                  </li>
                ))}
                {allocationData.length===0 && <div className="text-sm text-gray-500">暂无持仓</div>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

