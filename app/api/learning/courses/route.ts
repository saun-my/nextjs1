 

import postgres from 'postgres';
import { NextRequest } from 'next/server';

const sql = postgres(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING!, {
  ssl: process.env.POSTGRES_SSL === 'require' ? 'require' : undefined,
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').toLowerCase();
    const rows = await sql`
      SELECT id, title, level, description, cover_url, lessons_count
      FROM courses
    `;
    const filtered = rows.filter((c: any) => {
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.level.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    });
    return Response.json(filtered);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, level, description, cover_url, lessons_count, estimated_hours, difficulty_score, tags } = body;
    if (!id || !title || !level || !description || !lessons_count || !estimated_hours || !difficulty_score) {
      return Response.json({ error: 'missing fields' }, { status: 400 });
    }
    await sql`
      INSERT INTO courses (id, title, level, description, cover_url, lessons_count, estimated_hours, difficulty_score, tags)
      VALUES (${id}, ${title}, ${level}, ${description}, ${cover_url ?? null}, ${lessons_count}, ${estimated_hours}, ${difficulty_score}, ${sql.array(tags ?? [])})
      ON CONFLICT (id) DO NOTHING
    `;
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
