import { NextRequest } from 'next/server';
import postgres from 'postgres';
import { randomUUID } from 'crypto';

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL!, {
  ssl: 'require',
  prepare: false,
});

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS watchlist (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      fund_code TEXT NOT NULL,
      note TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, fund_code)
    );
  `;
}

export async function GET(req: NextRequest) {
  await ensureSchema();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const rows = userId
    ? await sql`SELECT * FROM watchlist WHERE user_id=${userId} ORDER BY created_at DESC`
    : await sql`SELECT * FROM watchlist ORDER BY created_at DESC LIMIT 100`;
  return Response.json(rows);
}

export async function POST(req: NextRequest) {
  await ensureSchema();
  const body = await req.json();
  const { user_id, fund_code, note } = body;
  if (!user_id || !fund_code) return Response.json({ error: 'missing fields' }, { status: 400 });
  try {
    await sql`
      INSERT INTO watchlist (id, user_id, fund_code, note)
      VALUES (${randomUUID()}, ${user_id}, ${fund_code}, ${note ?? null})
      ON CONFLICT (user_id, fund_code) DO NOTHING
    `;
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await ensureSchema();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return Response.json({ error: 'missing id' }, { status: 400 });
  await sql`DELETE FROM watchlist WHERE id=${id}`;
  return Response.json({ ok: true });
}

