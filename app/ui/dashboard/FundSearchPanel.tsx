'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

type FundDetail = {
  code: string;
  name: string;
  type: string;
  netWorth: number | null;
  netWorthDate: string | null;
  dayGrowth: number;
  lastMonthGrowth?: number;
  lastThreeMonthsGrowth?: number;
  lastYearGrowth?: number;
};

export default function FundSearchPanel() {
  const [code, setCode] = useState('');
  const [detail, setDetail] = useState<FundDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search() {
    if (!code.trim()) return;
    try {
      setLoading(true);
      setError(null);
      setDetail(null);
      const res = await fetch(`/api/funds/${encodeURIComponent(code.trim())}`, { cache: 'no-store' });
      const data = await res.json();
      const info = Array.isArray(data?.data) ? data.data[0] : null;
      if (!info) throw new Error('未找到基金信息');
      setDetail({
        code: info.code,
        name: info.name,
        type: info.type,
        netWorth: info.netWorth ?? null,
        netWorthDate: info.netWorthDate ?? null,
        dayGrowth: Number(info.dayGrowth ?? 0),
        lastMonthGrowth: info.lastMonthGrowth != null ? Number(info.lastMonthGrowth) : undefined,
        lastThreeMonthsGrowth: info.lastThreeMonthsGrowth != null ? Number(info.lastThreeMonthsGrowth) : undefined,
        lastYearGrowth: info.lastYearGrowth != null ? Number(info.lastYearGrowth) : undefined,
      });
    } catch (e: any) {
      setError(e?.message || '查询失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="px-6 py-4 border-b flex items-center gap-3">
        <div className="text-lg font-semibold">基金代码查询</div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
            <input
              className="border rounded pl-7 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="如 110022"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <button onClick={search} className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white">查询</button>
        </div>
      </div>
      {detail && (
        <div className="px-6 pt-3 text-sm text-gray-700">
          <span className="font-medium">{detail.code}</span>
          <span className="mx-2 text-gray-400">·</span>
          <span>{detail.name}</span>
        </div>
      )}
      {error && <div className="px-6 pt-2 text-sm text-red-600">{error}</div>}

      {loading && (
        <div className="px-6 py-8 text-center text-gray-500">加载中...</div>
      )}

      {!loading && detail && (
        <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border p-4 bg-gradient-to-br from-blue-50 to-white">
            <div className="text-sm text-gray-500">净值</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{detail.netWorth ?? '-'}</div>
            <div className="text-xs text-gray-500 mt-1">{detail.netWorthDate ?? '-'}</div>
          </div>
          <div className="rounded-xl border p-4 bg-gradient-to-br from-green-50 to-white">
            <div className="text-sm text-gray-500">日涨跌</div>
            <div className={`text-2xl font-bold mt-1 ${Number(detail.dayGrowth)>=0?'text-green-700':'text-red-600'} flex items-center gap-1`}>
              {Number(detail.dayGrowth) >= 0 ? <ArrowTrendingUpIcon className="w-5 h-5"/> : <ArrowTrendingDownIcon className="w-5 h-5"/>}
              {Number(detail.dayGrowth).toFixed(2)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">{detail.type || '-'}</div>
          </div>
          <div className="rounded-xl border p-4 bg-gradient-to-br from-indigo-50 to-white">
            <div className="text-sm text-gray-500">区间涨跌</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs ${Number(detail.lastMonthGrowth||0)>=0?'bg-green-50 text-green-700 border border-green-200':'bg-red-50 text-red-700 border border-red-200'}`}>近一月 {detail.lastMonthGrowth!=null?`${detail.lastMonthGrowth}%`:'-'}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${Number(detail.lastThreeMonthsGrowth||0)>=0?'bg-green-50 text-green-700 border border-green-200':'bg-red-50 text-red-700 border border-red-200'}`}>近三月 {detail.lastThreeMonthsGrowth!=null?`${detail.lastThreeMonthsGrowth}%`:'-'}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${Number(detail.lastYearGrowth||0)>=0?'bg-green-50 text-green-700 border border-green-200':'bg-red-50 text-red-700 border border-red-200'}`}>近一年 {detail.lastYearGrowth!=null?`${detail.lastYearGrowth}%`:'-'}</span>
            </div>
          </div>
        </div>
      )}

      {!loading && detail && (
        <div className="px-6 pb-5">
          <a href={`/funds/${detail.code}?name=${encodeURIComponent(detail.name)}`} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white">查看详情</a>
        </div>
      )}

      {!loading && !detail && (
        <div className="px-6 py-8 text-center text-gray-500">请输入基金代码查询</div>
      )}
    </div>
  );
}
