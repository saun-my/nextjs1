 

import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import postgres from 'postgres';



const sql = postgres(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING!, {
  ssl: process.env.POSTGRES_SSL === 'require' ? 'require' : undefined,
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const rows = userId
      ? await sql`SELECT * FROM investments WHERE user_id = ${userId} ORDER BY trade_date DESC`
      : await sql`SELECT * FROM investments ORDER BY trade_date DESC LIMIT 100`;
    return Response.json(rows);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, fund_code, amount, price, trade_date, note } = body;
    if (!user_id || !fund_code || !amount || !price || !trade_date) {
      return Response.json({ error: 'missing fields' }, { status: 400 });
    }
    await sql`
      INSERT INTO investments (id, user_id, fund_code, amount, price, trade_date, note)
      VALUES (${randomUUID()}, ${user_id}, ${fund_code}, ${Number(amount)}, ${Number(price)}, ${new Date(trade_date)}, ${note ?? null})
    `;
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
