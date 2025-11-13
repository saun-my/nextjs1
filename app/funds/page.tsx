import Link from 'next/link';

async function fetchFunds() {
  const origin = process.env.NEXT_PUBLIC_BASE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? '3000'}`);
  const res = await fetch(`${origin}/api/funds/list`, { cache: 'no-store' });
  if (!res.ok) return { list: [] } as any;
  return res.json();
}

export default async function FundsPage() {
  const data = await fetchFunds();
  const list = (data?.list || []) as any[];
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">今日热门基金</h1>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">代码</th>
              <th className="px-4 py-2 text-left">名称</th>
              <th className="px-4 py-2 text-left">日涨跌</th>
              <th className="px-4 py-2 text-left">净值</th>
              <th className="px-4 py-2 text-left">更新时间</th>
              <th className="px-4 py-2 text-left">详情</th>
            </tr>
          </thead>
          <tbody>
            {list.map((f) => (
              <tr key={f.code} className="border-t">
                <td className="px-4 py-2">{f.code}</td>
                <td className="px-4 py-2">{f.name}</td>
                <td className={`px-4 py-2 ${Number(f.dayGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{f.dayGrowth}%</td>
                <td className="px-4 py-2">{f.net ?? '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{f.lastUpdate ?? '-'}</td>
                <td className="px-4 py-2">
                  <Link className="text-blue-600 hover:underline" href={`/funds/${f.code}`}>查看</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

