'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowPathIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

type FundItem = {
  code: string;
  name: string;
  net: number | null;
  dayGrowth: number;
  lastUpdate: string | null;
  type: string;
};

export default function FundLiveTable() {
  const [list, setList] = useState<FundItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>('');
  const [sort, setSort] = useState<'growth' | 'code'>('growth');
  const router = useRouter();

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/funds/list', { cache: 'no-store' });
      const data = await res.json();
      setSource(typeof data.source === 'string' ? data.source : '');
      setList(Array.isArray(data.list) ? data.list : []);
    } catch (e: any) {
      setError(e?.message || '加载失败');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  const sorted = useMemo(() => {
    const arr = [...list];
    if (sort === 'growth') arr.sort((a, b) => Number(b.dayGrowth) - Number(a.dayGrowth));
    if (sort === 'code') arr.sort((a, b) => a.code.localeCompare(b.code));
    return arr;
  }, [list, sort]);

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold">今日热门基金</div>
          {source && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">{source}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md border bg-white">
            <button
              onClick={() => setSort('growth')}
              className={`px-3 py-1 text-xs ${sort==='growth'?'bg-blue-600 text-white':'text-gray-700'} rounded-l-md`}
            >涨跌</button>
            <button
              onClick={() => setSort('code')}
              className={`px-3 py-1 text-xs ${sort==='code'?'bg-blue-600 text-white':'text-gray-700'} rounded-r-md`}
            >代码</button>
          </div>
          <button onClick={load} className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded bg-blue-600 text-white">
            <ArrowPathIcon className={`w-4 h-4 ${loading?'animate-spin':''}`} /> 刷新
          </button>
        </div>
      </div>
      {error && (
        <div className="px-6 pb-2 text-sm text-red-600">{error}</div>
      )}
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">代码</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">名称</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">日涨跌</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">净值</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">更新时间</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">详情</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((f) => (
            <tr
              key={f.code}
              className="group border-t hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => router.push(`/funds/${f.code}?name=${encodeURIComponent(f.name)}`)}
            >
              <td className="px-6 py-3 font-mono text-sm">{f.code}</td>
              <td className="px-6 py-3">{f.name}</td>
              <td className="px-6 py-3">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${Number(f.dayGrowth)>=0?'bg-green-50 text-green-700 border border-green-200':'bg-red-50 text-red-700 border border-red-200'}`}>
                  {Number(f.dayGrowth) >= 0 ? <ArrowTrendingUpIcon className="w-3 h-3"/> : <ArrowTrendingDownIcon className="w-3 h-3"/>}
                  {Number(f.dayGrowth).toFixed(2)}%
                </span>
              </td>
              <td className="px-6 py-3">{f.net ?? '-'}</td>
              <td className="px-6 py-3 text-xs text-gray-500">{f.lastUpdate ?? '-'}</td>
              <td className="px-6 py-3">
                <Link href={`/funds/${f.code}?name=${encodeURIComponent(f.name)}`} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white">
                  查看 <ArrowRightIcon className="w-3 h-3" />
                </Link>
              </td>
            </tr>
          ))}
          {sorted.length === 0 && !loading && (
            <tr>
              <td className="px-6 py-8 text-center text-gray-500" colSpan={6}>暂无数据</td>
            </tr>
          )}
          {loading && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={`sk-${i}`} className="border-t animate-pulse">
                  <td className="px-6 py-3"><div className="h-3 w-16 bg-gray-200 rounded"/></td>
                  <td className="px-6 py-3"><div className="h-3 w-32 bg-gray-200 rounded"/></td>
                  <td className="px-6 py-3"><div className="h-4 w-20 bg-gray-200 rounded"/></td>
                  <td className="px-6 py-3"><div className="h-3 w-20 bg-gray-200 rounded"/></td>
                  <td className="px-6 py-3"><div className="h-3 w-24 bg-gray-200 rounded"/></td>
                  <td className="px-6 py-3"><div className="h-3 w-12 bg-gray-200 rounded"/></td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
