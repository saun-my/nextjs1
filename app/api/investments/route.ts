 

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
      ? await sql`SELECT * FROM investments WHERE user_id = ${userId} ORDER BY trade_date DESC, id DESC`
      : await sql`SELECT * FROM investments ORDER BY trade_date DESC, id DESC LIMIT 100`;
    return Response.json(rows);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, fund_code, amount, price, trade_date, note, action } = body;
    if (!user_id || !fund_code || !amount || !price || !trade_date) {
      return Response.json({ error: 'missing fields' }, { status: 400 });
    }
    await sql`
      INSERT INTO investments (id, user_id, fund_code, amount, price, trade_date, note, action)
      VALUES (${randomUUID()}, ${user_id}, ${fund_code}, ${Number(amount)}, ${Number(price)}, ${new Date(trade_date)}, ${note ?? null}, ${action ?? 'buy'})
    `;
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, amount, price, trade_date, note, action } = body;
    if (!id) return Response.json({ error: 'missing id' }, { status: 400 });
    await sql`
      UPDATE investments
      SET amount = COALESCE(${amount != null ? Number(amount) : null}, amount),
          price = COALESCE(${price != null ? Number(price) : null}, price),
          trade_date = COALESCE(${trade_date ? new Date(trade_date) : null}, trade_date),
          note = COALESCE(${note ?? null}, note),
          action = COALESCE(${action ?? null}, action)
      WHERE id = ${id}
    `;
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'missing id' }, { status: 400 });
    await sql`DELETE FROM investments WHERE id=${id}`;
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
