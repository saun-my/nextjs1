'use client';

import { useMemo, useRef, useState } from 'react';

type Point = { date: string; value: number };

export default function FundDetailChart({ series }: { series: Point[] }) {
  const [range, setRange] = useState<'1M'|'3M'|'1Y'|'3Y'|'MAX'>('3M');
  const [interval, setInterval] = useState<'D'|'W'|'M'>('D');

  const parsed = useMemo(() => series.map(s => ({ t: new Date(s.date).getTime(), v: s.value })).filter(s => !isNaN(s.t) && typeof s.v === 'number'), [series]);

  const filtered = useMemo(() => {
    if (parsed.length === 0) return [] as {t:number;v:number}[];
    const end = parsed[parsed.length - 1].t;
    const ms = 24*3600*1000;
    const delta = range === '1M' ? 30*ms : range === '3M' ? 90*ms : range === '1Y' ? 365*ms : range === '3Y' ? 365*3*ms : Infinity;
    const start = isFinite(delta) ? end - delta : parsed[0].t;
    return parsed.filter(p => p.t >= start);
  }, [parsed, range]);

  function endOfMonth(t:number){ const d = new Date(t); return new Date(d.getFullYear(), d.getMonth()+1, 0).getTime(); }
  function weekKey(t:number){ const d=new Date(t); const day=(d.getDay()+6)%7; const monday=new Date(d); monday.setDate(d.getDate()-day); monday.setHours(0,0,0,0); return monday.getTime(); }

  const resampled = useMemo(() => {
    if (filtered.length === 0) return [] as {t:number;v:number}[];
    if (interval === 'D') return filtered;
    if (interval === 'W') {
      const map = new Map<number,{t:number;v:number}>();
      filtered.forEach(p=>{ const k=weekKey(p.t); map.set(k,p); });
      return Array.from(map.values()).sort((a,b)=>a.t-b.t);
    }
    const map = new Map<number,{t:number;v:number}>();
    filtered.forEach(p=>{ const k=endOfMonth(p.t); map.set(k,p); });
    return Array.from(map.values()).sort((a,b)=>a.t-b.t);
  }, [filtered, interval]);

  const stats = useMemo(() => {
    if (resampled.length < 2) return { min:null as number|null, max:null as number|null, change:null as number|null };
    const values = resampled.map(p=>p.v);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const change = ((resampled[resampled.length-1].v - resampled[0].v) / resampled[0].v) * 100;
    return { min, max, change: Number(change.toFixed(2)) };
  }, [resampled]);

  const width = 800, height = 280, padding = 28;
  const path = useMemo(() => {
    const n = resampled.length; if (n === 0) return '';
    const xs = resampled.map(p=>p.t);
    const minX = xs[0], maxX = xs[n-1];
    const ys = resampled.map(p=>p.v);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const w = width - padding*2, h = height - padding*2;
    const px = (t:number) => (maxX===minX? w/2 : ((t-minX)/(maxX-minX))*w) + padding;
    const py = (v:number) => padding + (1 - (maxY===minY?0.5:((v-minY)/(maxY-minY))))*h;
    let d='';
    resampled.forEach((p,i)=>{ const x=px(p.t), y=py(p.v); d += `${i===0?'M':'L'}${x},${y} `; });
    return d.trim();
  }, [resampled]);

  const startLabel = resampled[0]?.t ? new Date(resampled[0].t).toISOString().slice(0,10) : '';
  const endLabel = resampled[resampled.length-1]?.t ? new Date(resampled[resampled.length-1].t).toISOString().slice(0,10) : '';

  const xs = useMemo(()=>resampled.map(p=>p.t),[resampled]);
  const minX = xs[0] ?? 0, maxX = xs[xs.length-1] ?? 1;
  const ys = useMemo(()=>resampled.map(p=>p.v),[resampled]);
  const minY = ys.length? Math.min(...ys):0, maxY = ys.length? Math.max(...ys):1;
  const w = width - padding*2, h = height - padding*2;
  const px = (t:number) => (maxX===minX? w/2 : ((t-minX)/(maxX-minX))*w) + padding;
  const py = (v:number) => padding + (1 - (maxY===minY?0.5:((v-minY)/(maxY-minY))))*h;
  const coords = useMemo(()=>resampled.map(p=>({ x: px(p.t), y: py(p.v), t: p.t, v: p.v })),[resampled,minX,maxX,minY,maxY]);
  const svgRef = useRef<SVGSVGElement|null>(null);
  const [hoverIdx, setHoverIdx] = useState<number|null>(null);
  function onMove(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || coords.length===0) return;
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    const viewX = (e.clientX - rect.left) * scaleX;
    // find nearest by viewBox x
    let nearest = 0;
    let best = Math.abs(coords[0].x - viewX);
    for (let i=1;i<coords.length;i++) {
      const d = Math.abs(coords[i].x - viewX);
      if (d < best) { best = d; nearest = i; }
    }
    setHoverIdx(nearest);
  }
  function onLeave() { setHoverIdx(null); }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md border bg-white">
            {(['1M','3M','1Y','3Y','MAX'] as const).map(r=> (
              <button key={r} onClick={()=>setRange(r)} className={`px-3 py-1 text-xs ${range===r?'bg-blue-600 text-white':'text-gray-700'} ${r==='1M'?'rounded-l-md':''} ${r==='MAX'?'rounded-r-md':''}`}>{r}</button>
            ))}
          </div>
          <div className="inline-flex rounded-md border bg-white ml-2">
            {(['D','W','M'] as const).map(iv=> (
              <button key={iv} onClick={()=>setInterval(iv)} className={`px-3 py-1 text-xs ${interval===iv?'bg-blue-600 text-white':'text-gray-700'} ${iv==='D'?'rounded-l-md':''} ${iv==='M'?'rounded-r-md':''}`}>{iv}</button>
            ))}
          </div>
        </div>
        <div className="text-sm text-gray-500">{startLabel} 至 {endLabel}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-xl border p-3 bg-gradient-to-br from-indigo-50 to-white">
          <div className="text-xs text-gray-500">区间涨跌</div>
          <div className={`text-xl font-bold ${Number(stats.change||0)>=0?'text-green-700':'text-red-600'}`}>{stats.change!=null?`${stats.change}%`:'-'}</div>
        </div>
        <div className="rounded-xl border p-3 bg-gradient-to-br from-blue-50 to-white">
          <div className="text-xs text-gray-500">最高</div>
          <div className="text-xl font-bold text-gray-900">{stats.max ?? '-'}</div>
        </div>
        <div className="rounded-xl border p-3 bg-gradient-to-br from-slate-50 to-white">
          <div className="text-xs text-gray-500">最低</div>
          <div className="text-xl font-bold text-gray-900">{stats.min ?? '-'}</div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border bg-white">
        {resampled.length === 0 ? (
          <div className="p-6 text-center text-gray-500">暂无走势数据</div>
        ) : (
          <svg ref={svgRef} width="100%" viewBox="0 0 800 280" preserveAspectRatio="none" onMouseMove={onMove} onMouseLeave={onLeave}>
            <defs>
              <linearGradient id="fd-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="800" height="280" fill="white" />
            <path d={path} fill="none" stroke="#2563eb" strokeWidth="2" />
            <path d={`${path} L 772,252 L 28,252 Z`} fill="url(#fd-fill)" />
            <line x1="28" y1="252" x2="772" y2="252" stroke="#e5e7eb" />
            <line x1="28" y1="28" x2="28" y2="252" stroke="#e5e7eb" />
            <text x="32" y="44" fontSize="10" fill="#6b7280">高 {stats.max ?? '-'}</text>
            <text x="32" y="248" fontSize="10" fill="#6b7280">低 {stats.min ?? '-'}</text>
            <text x="28" y="270" fontSize="10" fill="#6b7280">{startLabel}</text>
            <text x="744" y="270" fontSize="10" fill="#6b7280" textAnchor="end">{endLabel}</text>
            {hoverIdx!=null && (
              <g>
                <line x1={coords[hoverIdx].x} y1={28} x2={coords[hoverIdx].x} y2={252} stroke="#c7d2fe" strokeDasharray="4 2" />
                <circle cx={coords[hoverIdx].x} cy={coords[hoverIdx].y} r={3.5} fill="#2563eb" />
                {(() => {
                  const boxW = 160, boxH = 34;
                  const bx = Math.min(width - 28 - boxW, Math.max(28, coords[hoverIdx].x + 10));
                  const by = Math.min(height - 28 - boxH, Math.max(28, coords[hoverIdx].y - boxH - 6));
                  return (
                    <g>
                      <rect x={bx} y={by} width={boxW} height={boxH} rx={8} fill="#111827" opacity="0.9" />
                      <text x={bx + 8} y={by + 14} fontSize="12" fill="#ffffff">{new Date(coords[hoverIdx].t).toISOString().slice(0,10)}</text>
                      <text x={bx + 8} y={by + 28} fontSize="12" fill="#ffffff">净值 {Number(coords[hoverIdx].v).toFixed(4)}</text>
                    </g>
                  );
                })()}
              </g>
            )}
          </svg>
        )}
      </div>
    </div>
  );
}
