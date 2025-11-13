'use client';

import { useEffect, useState } from 'react';

export default function InvestmentsPage() {
  const [userId, setUserId] = useState('');
  const [records, setRecords] = useState<any[]>([]);
  const [form, setForm] = useState({ user_id: '', fund_code: '', amount: '', price: '', trade_date: '', note: '' });
  const [status, setStatus] = useState('');
  const [plans, setPlans] = useState<any[]>([]);
  const [planForm, setPlanForm] = useState({ user_id: '', fund_code: '', amount: '', frequency: 'monthly', day_of_week: '', day_of_month: '', start_date: '', end_date: '' });

  async function load() {
    const url = userId ? `/api/investments?userId=${encodeURIComponent(userId)}` : '/api/investments';
    const res = await fetch(url);
    const data = await res.json();
    setRecords(Array.isArray(data) ? data : []);
    const res2 = await fetch(userId ? `/api/investments/plans?userId=${encodeURIComponent(userId)}` : '/api/investments/plans');
    const data2 = await res2.json();
    setPlans(Array.isArray(data2) ? data2 : []);
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

  async function submitPlan() {
    setStatus('提交定投计划中...');
    const payload: any = {
      user_id: planForm.user_id,
      fund_code: planForm.fund_code,
      amount: Number(planForm.amount),
      frequency: planForm.frequency,
      start_date: planForm.start_date,
    };
    if (planForm.frequency === 'weekly') payload.day_of_week = planForm.day_of_week ? Number(planForm.day_of_week) : undefined;
    if (planForm.frequency === 'monthly') payload.day_of_month = planForm.day_of_month ? Number(planForm.day_of_month) : undefined;
    if (planForm.end_date) payload.end_date = planForm.end_date;
    const res = await fetch('/api/investments/plans', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    setStatus(JSON.stringify(data));
    if (res.ok) {
      setPlanForm({ user_id: '', fund_code: '', amount: '', frequency: 'monthly', day_of_week: '', day_of_month: '', start_date: '', end_date: '' });
      load();
    }
  }

  async function runPlansNow() {
    setStatus('执行定投计划...');
    const res = await fetch('/api/investments/plans/run');
    const data = await res.json();
    setStatus(JSON.stringify(data));
    if (res.ok) load();
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

      <div className="bg-white p-4 border rounded-lg space-y-3">
        <h2 className="font-semibold">定投计划</h2>
        <div className="grid grid-cols-2 gap-2">
          <input className="border p-2" placeholder="用户ID" value={planForm.user_id} onChange={e=>setPlanForm({...planForm,user_id:e.target.value})} />
          <input className="border p-2" placeholder="基金代码" value={planForm.fund_code} onChange={e=>setPlanForm({...planForm,fund_code:e.target.value})} />
          <input className="border p-2" placeholder="定投金额" value={planForm.amount} onChange={e=>setPlanForm({...planForm,amount:e.target.value})} />
          <select className="border p-2" value={planForm.frequency} onChange={e=>setPlanForm({...planForm,frequency:e.target.value})}>
            <option value="monthly">每月</option>
            <option value="weekly">每周</option>
          </select>
          {planForm.frequency === 'weekly' && (
            <input className="border p-2" placeholder="周几(0-6)" value={planForm.day_of_week} onChange={e=>setPlanForm({...planForm,day_of_week:e.target.value})} />
          )}
          {planForm.frequency === 'monthly' && (
            <input className="border p-2" placeholder="每月几号(1-31)" value={planForm.day_of_month} onChange={e=>setPlanForm({...planForm,day_of_month:e.target.value})} />
          )}
          <input className="border p-2" type="date" placeholder="开始日期" value={planForm.start_date} onChange={e=>setPlanForm({...planForm,start_date:e.target.value})} />
          <input className="border p-2" type="date" placeholder="结束日期(可选)" value={planForm.end_date} onChange={e=>setPlanForm({...planForm,end_date:e.target.value})} />
        </div>
        <div className="flex gap-2">
          <button onClick={submitPlan} className="px-4 py-2 bg-green-600 text-white rounded">保存定投计划</button>
          <button onClick={runPlansNow} className="px-4 py-2 bg-indigo-600 text-white rounded">立即执行一次</button>
        </div>
        <div className="text-sm text-gray-600">{status}</div>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">计划ID</th>
                <th className="px-4 py-2 text-left">用户ID</th>
                <th className="px-4 py-2 text-left">基金代码</th>
                <th className="px-4 py-2 text-left">金额</th>
                <th className="px-4 py-2 text-left">频率</th>
                <th className="px-4 py-2 text-left">下一执行日</th>
                <th className="px-4 py-2 text-left">状态</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2 text-xs text-gray-500">{p.id}</td>
                  <td className="px-4 py-2 text-xs text-gray-500">{p.user_id}</td>
                  <td className="px-4 py-2">{p.fund_code}</td>
                  <td className="px-4 py-2">{p.amount}</td>
                  <td className="px-4 py-2">{p.frequency}</td>
                  <td className="px-4 py-2">{typeof p.next_run === 'string' ? p.next_run.slice(0,10) : p.next_run instanceof Date ? p.next_run.toISOString().slice(0,10) : String(p.next_run)}</td>
                  <td className="px-4 py-2">{p.status}</td>
                </tr>
              ))}
              {plans.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={7}>暂无定投计划</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
                <td className="px-4 py-2">{typeof r.trade_date === 'string' ? r.trade_date.slice(0,10) : r.trade_date instanceof Date ? r.trade_date.toISOString().slice(0,10) : String(r.trade_date)}</td>
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
