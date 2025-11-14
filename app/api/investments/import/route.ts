import { NextRequest } from 'next/server';
import postgres from 'postgres';
import { randomUUID } from 'crypto';

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL!, {
  ssl: 'require',
  prepare: false,
});

async function ensureSchema() {
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

export async function POST(req: NextRequest) {
  await ensureSchema();
  const body = await req.json();
  const records = Array.isArray(body?.records) ? body.records : [];
  if (!records.length) return Response.json({ error: 'no records' }, { status: 400 });
  const results: any[] = [];
  for (const r of records) {
    try {
      const id = r.id ?? randomUUID();
      const user_id = r.user_id;
      const fund_code = r.fund_code;
      const amount = Number(r.amount);
      const price = Number(r.price);
      const trade_date = r.trade_date ? new Date(r.trade_date) : new Date();
      const note = r.note ?? null;
      if (!user_id || !fund_code || !amount || !price) {
        results.push({ id, ok: false, error: 'missing fields' });
        continue;
      }
      await sql`
        INSERT INTO investments (id, user_id, fund_code, amount, price, trade_date, note, action)
        VALUES (${id}, ${user_id}, ${fund_code}, ${amount}, ${price}, ${trade_date}, ${note}, ${r.action ?? 'buy'})
        ON CONFLICT (id) DO NOTHING
      `;
      results.push({ id, ok: true });
    } catch (e) {
      results.push({ id: r.id ?? null, ok: false, error: (e as Error).message });
    }
  }
  return Response.json({ ok: true, results });
}
