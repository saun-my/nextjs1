'use client';

import { useState } from 'react';

export default function QuickAddWatchlist({ defaultUserId }: { defaultUserId?: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ user_id: defaultUserId || '', fund_code: '', note: '' });
  const [status, setStatus] = useState('');

  async function submit() {
    setStatus('提交中...');
    const res = await fetch('/api/investments/watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setStatus(JSON.stringify(data));
    if (res.ok) {
      setOpen(false);
      if (typeof window !== 'undefined') window.location.reload();
    }
  }

  return (
    <div>
      <button onClick={()=>setOpen(true)} className="px-3 py-1.5 text-sm rounded bg-gray-800 text-white hover:bg-gray-900">快速加入自选</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white w-full max-w-md rounded-lg border shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">加入自选</h3>
              <button onClick={()=>setOpen(false)} className="text-gray-500">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <input className="border p-2" placeholder="用户ID" value={form.user_id} onChange={e=>setForm({ ...form, user_id: e.target.value })} />
              <input className="border p-2" placeholder="基金代码" value={form.fund_code} onChange={e=>setForm({ ...form, fund_code: e.target.value })} />
              <input className="border p-2 col-span-2" placeholder="备注(可选)" value={form.note} onChange={e=>setForm({ ...form, note: e.target.value })} />
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

