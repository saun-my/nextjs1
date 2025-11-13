import { NextRequest } from 'next/server';
import postgres from 'postgres';
import { randomUUID } from 'crypto';

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL!, {
  ssl: 'require',
  prepare: false,
});

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS investment_plans (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      fund_code TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      frequency TEXT NOT NULL, -- 'weekly' | 'monthly'
      day_of_week INT, -- 0-6, for weekly
      day_of_month INT, -- 1-31, for monthly
      start_date DATE NOT NULL,
      end_date DATE,
      next_run DATE NOT NULL,
      status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'paused'
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

function fmtDate(d: Date) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10);
}

function nextWeekly(from: Date, dow: number) {
  const curDow = from.getUTCDay();
  const diff = (dow - curDow + 7) % 7;
  const next = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate() + diff));
  return next;
}

function nextMonthly(from: Date, dom: number) {
  const y = from.getUTCFullYear();
  const m = from.getUTCMonth();
  const cur = new Date(Date.UTC(y, m, Math.min(dom, 28))); // avoid overflow for simplicity
  if (from.getUTCDate() <= dom) return new Date(Date.UTC(y, m, dom));
  const next = new Date(Date.UTC(y, m + 1, dom));
  return next;
}

export async function GET(req: NextRequest) {
  await ensureSchema();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const rows = userId
    ? await sql`SELECT * FROM investment_plans WHERE user_id = ${userId} ORDER BY created_at DESC`
    : await sql`SELECT * FROM investment_plans ORDER BY created_at DESC LIMIT 100`;
  return Response.json(rows);
}

export async function POST(req: NextRequest) {
  await ensureSchema();
  const body = await req.json();
  const { user_id, fund_code, amount, frequency, day_of_week, day_of_month, start_date, end_date } = body;
  if (!user_id || !fund_code || !amount || !frequency || !start_date) {
    return Response.json({ error: 'missing fields' }, { status: 400 });
  }
  const start = new Date(start_date);
  let next: Date;
  if (frequency === 'weekly') {
    const dow = typeof day_of_week === 'number' ? day_of_week : start.getUTCDay();
    next = nextWeekly(start, dow);
  } else if (frequency === 'monthly') {
    const dom = typeof day_of_month === 'number' ? day_of_month : start.getUTCDate();
    next = nextMonthly(start, dom);
  } else {
    return Response.json({ error: 'invalid frequency' }, { status: 400 });
  }
  await sql`
    INSERT INTO investment_plans (id, user_id, fund_code, amount, frequency, day_of_week, day_of_month, start_date, end_date, next_run, status)
    VALUES (${randomUUID()}, ${user_id}, ${fund_code}, ${Number(amount)}, ${frequency}, ${day_of_week ?? null}, ${day_of_month ?? null}, ${start}, ${end_date ? new Date(end_date) : null}, ${fmtDate(next)}, ${'active'})
  `;
  return Response.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  await ensureSchema();
  const body = await req.json();
  const { id, status } = body;
  if (!id || !status) return Response.json({ error: 'missing fields' }, { status: 400 });
  await sql`UPDATE investment_plans SET status=${status} WHERE id=${id}`;
  return Response.json({ ok: true });
}
