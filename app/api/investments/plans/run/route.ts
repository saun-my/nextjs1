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
      frequency TEXT NOT NULL,
      day_of_week INT,
      day_of_month INT,
      start_date DATE NOT NULL,
      end_date DATE,
      next_run DATE NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS investments (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      fund_code TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      price NUMERIC NOT NULL,
      trade_date DATE NOT NULL,
      note TEXT
    );
  `;
  await sql`ALTER TABLE investments ADD COLUMN IF NOT EXISTS action TEXT NOT NULL DEFAULT 'buy'`;
}

function fmtDate(d: Date) {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10);
}

function addDays(d: Date, days: number) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + days));
}

function nextMonthly(from: Date, dom: number) {
  const y = from.getUTCFullYear();
  const m = from.getUTCMonth();
  if (from.getUTCDate() <= dom) return new Date(Date.UTC(y, m, dom));
  return new Date(Date.UTC(y, m + 1, dom));
}

export async function GET() {
  await ensureSchema();
  const todayISO = fmtDate(new Date());
  const plans = await sql`
    SELECT * FROM investment_plans
    WHERE status='active' AND next_run <= ${todayISO}
      AND (end_date IS NULL OR next_run <= end_date)
  `;

  const origin = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? '3000'}`);

  const results: any[] = [];
  for (const p of plans as any[]) {
    try {
      let price = null as number | null;
      try {
        const res = await fetch(`${origin}/api/funds/${encodeURIComponent(p.fund_code)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          price = data?.data?.[0]?.netWorth ?? null;
        }
      } catch {}
      if (price == null) {
        results.push({ id: p.id, skipped: true, reason: 'no price' });
        continue;
      }
      await sql`
        INSERT INTO investments (id, user_id, fund_code, amount, price, trade_date, note, action)
        VALUES (${randomUUID()}, ${p.user_id}, ${p.fund_code}, ${Number(p.amount)}, ${Number(price)}, ${new Date()}, ${'定投自动执行'}, ${'buy'})
      `;
      let nextRun: Date;
      if (p.frequency === 'weekly') {
        nextRun = addDays(new Date(p.next_run), 7);
      } else {
        const dom = p.day_of_month ?? new Date(p.next_run).getUTCDate();
        nextRun = nextMonthly(new Date(p.next_run), dom);
      }
      await sql`UPDATE investment_plans SET next_run=${fmtDate(nextRun)} WHERE id=${p.id}`;
      results.push({ id: p.id, executed: true, price });
    } catch (e) {
      results.push({ id: p.id, error: (e as Error).message });
    }
  }

  return Response.json({ ok: true, results });
}
