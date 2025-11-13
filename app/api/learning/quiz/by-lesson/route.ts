'use server';

import postgres from 'postgres';
import { NextRequest } from 'next/server';

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: process.env.POSTGRES_SSL === 'require' ? 'require' : undefined,
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get('lessonId');
    if (!lessonId) return Response.json({ error: 'lessonId required' }, { status: 400 });
    const rows = await sql`
      SELECT id, lesson_id, prompt, choices
      FROM quiz_questions WHERE lesson_id = ${lessonId}
    `;
    return Response.json(rows.map((r: any) => ({
      id: r.id,
      lesson_id: r.lesson_id,
      prompt: r.prompt,
      choices: r.choices,
    })));
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

