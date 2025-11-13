'use server';

import postgres from 'postgres';
import { NextRequest } from 'next/server';

const sql = postgres(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING!, {
  ssl: process.env.POSTGRES_SSL === 'require' ? 'require' : undefined,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, course_id, title, objective, content, duration_min, order_index } = body;
    if (!id || !course_id || !title || !duration_min || !order_index) {
      return Response.json({ error: 'missing fields' }, { status: 400 });
    }
    await sql`
      INSERT INTO lessons (id, course_id, title, objective, content, duration_min, order_index)
      VALUES (${id}, ${course_id}, ${title}, ${objective ?? null}, ${content ?? null}, ${duration_min}, ${order_index})
      ON CONFLICT (id) DO NOTHING
    `;
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

