import postgres from 'postgres';
import FundLiveTable from '@/app/ui/dashboard/FundLiveTable';
import FundSearchPanel from '@/app/ui/dashboard/FundSearchPanel';

async function fetchInvestments() {
  const sql = postgres(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING!, {
    ssl: process.env.POSTGRES_SSL === 'require' ? 'require' : undefined,
  });
  try {
    const rows = await sql`SELECT id, user_id, fund_code, amount, price, trade_date, note FROM investments ORDER BY trade_date DESC LIMIT 100`;
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

export default async function DashboardInvestmentsPage() {
  const [records, funds] = await Promise.all([fetchInvestments(), fetchFunds()]);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Investments</h1>

      <div className="bg-white rounded-lg shadow-sm border">
        <FundSearchPanel />
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">我的投资记录</h2>
          <a href="/investments" className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700">新增持有</a>
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
