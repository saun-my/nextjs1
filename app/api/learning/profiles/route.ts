'use server';

import postgres from 'postgres';
import { NextRequest } from 'next/server';

const sql = postgres(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING!, {
  ssl: process.env.POSTGRES_SSL === 'require' ? 'require' : undefined,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, preferred_difficulty, preferred_topics, learning_style, weekly_goal_hours, study_time_preference } = body;
    if (!user_id) return Response.json({ error: 'user_id required' }, { status: 400 });

    const topics: string[] = Array.isArray(preferred_topics)
      ? (preferred_topics as string[]).map((t) => String(t).trim()).filter(Boolean)
      : typeof preferred_topics === 'string'
      ? String(preferred_topics)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const diff = preferred_difficulty == null ? null : Number(preferred_difficulty);
    const weekly = weekly_goal_hours == null ? null : Number(weekly_goal_hours);
    await sql`
      INSERT INTO user_learning_profiles (user_id, preferred_difficulty, preferred_topics, learning_style, weekly_goal_hours, study_time_preference)
      VALUES (${user_id}, ${diff}, ${sql.array(topics)}, ${learning_style ?? null}, ${weekly}, ${study_time_preference ?? null})
      ON CONFLICT (user_id) DO UPDATE SET
        preferred_difficulty = EXCLUDED.preferred_difficulty,
        preferred_topics = EXCLUDED.preferred_topics,
        learning_style = EXCLUDED.learning_style,
        weekly_goal_hours = EXCLUDED.weekly_goal_hours,
        study_time_preference = EXCLUDED.study_time_preference,
        updated_at = NOW()
    `;
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
