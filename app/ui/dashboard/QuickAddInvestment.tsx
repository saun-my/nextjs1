'use client';

import { useState } from 'react';

export default function QuickAddInvestment({ defaultUserId, defaultFundCode }: { defaultUserId?: string; defaultFundCode?: string }) {
  const today = new Date().toISOString().slice(0,10);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ user_id: defaultUserId || '', fund_code: defaultFundCode || '', amount: '', price: '', trade_date: today, note: '', action: 'buy' });
  const [status, setStatus] = useState('');
  const [mode, setMode] = useState<'amount'|'shares'>('amount');

  async function submit() {
    setStatus('提交中...');
    const body: any = { ...form };
    const priceNum = Number(body.price);
    if (mode === 'shares') {
      const sharesNum = Number(body.amount);
      body.amount = sharesNum * priceNum;
    } else {
      body.amount = Number(body.amount);
    }
    body.price = priceNum;
    const res = await fetch('/api/investments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    setStatus(JSON.stringify(data));
    if (res.ok) { setOpen(false); }
  }

  return (
    <div>
      <button onClick={()=>setOpen(true)} className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700">快速新增</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white w-full max-w-md rounded-lg border shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">新增持有</h3>
              <button onClick={()=>setOpen(false)} className="text-gray-500">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <input className="border p-2" placeholder="用户ID" value={form.user_id} onChange={e=>setForm({...form,user_id:e.target.value})} />
              <input className="border p-2" placeholder="基金代码" value={form.fund_code} onChange={e=>setForm({...form,fund_code:e.target.value})} />
              <input className="border p-2" placeholder="份额/金额" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} />
              <input className="border p-2" placeholder="价格" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
              <input className="border p-2" type="date" value={form.trade_date} onChange={e=>setForm({...form,trade_date:e.target.value})} />
              <select className="border p-2" value={form.action} onChange={e=>setForm({...form,action:e.target.value})}>
                <option value="buy">买入/加仓</option>
                <option value="sell">卖出/减仓</option>
              </select>
              <div className="col-span-2 flex items-center gap-2">
                <span className="text-sm text-gray-600">录入模式</span>
                <div className="flex bg-gray-100 rounded p-1">
                  <button className={`px-2 py-1 text-xs rounded ${mode==='amount'?'bg-white text-blue-600':'text-gray-700'}`} onClick={()=>setMode('amount')}>金额+价格</button>
                  <button className={`px-2 py-1 text-xs rounded ${mode==='shares'?'bg-white text-blue-600':'text-gray-700'}`} onClick={()=>setMode('shares')}>份额+价格</button>
                </div>
              </div>
              <input className="border p-2 col-span-2" placeholder="备注" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} />
            </div>
            <div className="flex gap-2">
              <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded">保存</button>
              <button onClick={()=>setOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded">取消</button>
            </div>
            <div className="text-sm text-gray-600 mt-2">{status}</div>
          </div>
        </div>
      )}
    </div>
  );
}

