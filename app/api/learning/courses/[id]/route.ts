'use server';

import postgres from 'postgres';
import { NextRequest } from 'next/server';

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: process.env.POSTGRES_SSL === 'require' ? 'require' : undefined,
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rows = await sql`
      SELECT id, title, level, description, cover_url, lessons_count, estimated_hours, difficulty_score
      FROM courses WHERE id = ${id}
    `;
    if (!rows[0]) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(rows[0]);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
