async function fetchFund(code: string) {
  const origin = process.env.NEXT_PUBLIC_BASE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? '3000'}`);
  const res = await fetch(`${origin}/api/funds/${code}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function FundDetailPage(props: { params: Promise<{ code: string }> }) {
  const { code } = await props.params;
  const data = await fetchFund(code);
  const info = data?.data?.[0] ?? null;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">基金详情</h1>
      {!info ? (
        <div className="text-gray-600">暂无数据</div>
      ) : (
        <div className="bg-white border rounded-lg p-4 space-y-2">
          <div>代码：{info.code}</div>
          <div>名称：{info.name}</div>
          <div>类型：{info.type}</div>
          <div>净值：{info.netWorth}（{info.netWorthDate}）</div>
          <div>日涨跌：{info.dayGrowth}%</div>
          <div>近一月：{info.lastMonthGrowth}%，近三月：{info.lastThreeMonthsGrowth}%，近一年：{info.lastYearGrowth}%</div>
          <div>基金公司：{info.company}</div>
        </div>
      )}
    </div>
  );
}

