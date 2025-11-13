'use server';

import postgres from 'postgres';
import { NextRequest } from 'next/server';

const sql = postgres(process.env.POSTGRES_URL!, {
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

