'use server';

import postgres from 'postgres';
import { NextRequest } from 'next/server';

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: process.env.POSTGRES_SSL === 'require' ? 'require' : undefined,
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    if (!courseId) return Response.json({ error: 'courseId required' }, { status: 400 });
    const rows = await sql`
      SELECT id, course_id, title, objective, content, duration_min, order_index
      FROM lessons WHERE course_id = ${courseId} ORDER BY order_index ASC
    `;
    return Response.json(rows);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

