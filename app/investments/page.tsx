'use client';

import { useEffect, useState } from 'react';

export default function InvestmentsPage() {
  const [userId, setUserId] = useState('');
  const [records, setRecords] = useState<any[]>([]);
  const [form, setForm] = useState({ user_id: '', fund_code: '', amount: '', price: '', trade_date: '', note: '' });
  const [status, setStatus] = useState('');

  async function load() {
    const url = userId ? `/api/investments?userId=${encodeURIComponent(userId)}` : '/api/investments';
    const res = await fetch(url);
    const data = await res.json();
    setRecords(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function submit() {
    setStatus('提交中...');
    const res = await fetch('/api/investments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
        price: Number(form.price),
      }),
    });
    const data = await res.json();
    setStatus(JSON.stringify(data));
    if (res.ok) {
      setForm({ user_id: '', fund_code: '', amount: '', price: '', trade_date: '', note: '' });
      load();
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">我的投资记录</h1>

      <div className="bg-white p-4 border rounded-lg space-y-3">
        <h2 className="font-semibold">筛选</h2>
        <input className="border p-2 w-full" placeholder="用户ID(UUID)" value={userId} onChange={(e)=>setUserId(e.target.value)} />
      </div>

      <div className="bg-white p-4 border rounded-lg space-y-3">
        <h2 className="font-semibold">新增记录</h2>
        <div className="grid grid-cols-2 gap-2">
          <input className="border p-2" placeholder="用户ID" value={form.user_id} onChange={e=>setForm({...form,user_id:e.target.value})} />
          <input className="border p-2" placeholder="基金代码" value={form.fund_code} onChange={e=>setForm({...form,fund_code:e.target.value})} />
          <input className="border p-2" placeholder="份额/金额" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} />
          <input className="border p-2" placeholder="买入价格" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
          <input className="border p-2" type="date" placeholder="交易日期" value={form.trade_date} onChange={e=>setForm({...form,trade_date:e.target.value})} />
          <input className="border p-2" placeholder="备注" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} />
        </div>
        <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded">保存</button>
        <div className="text-sm text-gray-600">{status}</div>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">日期</th>
              <th className="px-4 py-2 text-left">基金代码</th>
              <th className="px-4 py-2 text-left">金额/份额</th>
              <th className="px-4 py-2 text-left">价格</th>
              <th className="px-4 py-2 text-left">用户ID</th>
              <th className="px-4 py-2 text-left">备注</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2">{r.trade_date}</td>
                <td className="px-4 py-2">{r.fund_code}</td>
                <td className="px-4 py-2">{r.amount}</td>
                <td className="px-4 py-2">{r.price}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{r.user_id}</td>
                <td className="px-4 py-2">{r.note ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

