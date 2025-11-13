 

import postgres from 'postgres';
import { NextRequest } from 'next/server';

const sql = postgres(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING!, {
  ssl: process.env.POSTGRES_SSL === 'require' ? 'require' : undefined,
});

type DbCourse = {
  id: string;
  title: string;
  level: string;
  description: string;
  cover_url: string | null;
  lessons_count: number;
  estimated_hours: number;
  difficulty_score: number;
  tags: string[] | null;
};

type DbProfile = {
  user_id: string;
  preferred_difficulty: number | null;
  preferred_topics: string[] | null;
  learning_style: string | null;
  weekly_goal_hours: number | null;
  study_time_preference: string | null;
};

type DbProgress = {
  course_id: string;
  completed_lessons: string[] | null;
  total_score: number | null;
  time_spent_minutes: number | null;
  completion_percentage: number | null;
  is_completed: boolean | null;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || '';
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.max(1, Math.min(20, Number(limitParam))) : 6;

    const courses: DbCourse[] = await sql`
      SELECT id, title, level, description, cover_url, lessons_count, estimated_hours, difficulty_score, tags
      FROM courses
    `;

    let profile: DbProfile | null = null;
    if (userId) {
      const rows = await sql<DbProfile[]>`
        SELECT user_id, preferred_difficulty, preferred_topics, learning_style, weekly_goal_hours, study_time_preference
        FROM user_learning_profiles WHERE user_id = ${userId}
      `;
      profile = rows[0] || null;
    }

    const progressRows: DbProgress[] = userId
      ? await sql<DbProgress[]>`
          SELECT course_id, completed_lessons, total_score, time_spent_minutes, completion_percentage, is_completed
          FROM user_course_progress WHERE user_id = ${userId}
        `
      : [];

    const progressByCourse = new Map<string, DbProgress>();
    for (const p of progressRows) progressByCourse.set(p.course_id, p);

    const preferredDifficulty = profile?.preferred_difficulty ?? 5;
    const preferredTopics = profile?.preferred_topics ?? [];
    const learningStyle = profile?.learning_style ?? 'interactive';

    const recommendations = courses.map((c) => {
      let score = 50;
      const diffMatch = 10 - Math.abs((c.difficulty_score ?? 5) - preferredDifficulty);
      score += diffMatch * 2;

      const tags = c.tags ?? [];
      const topicMatches = tags.filter((t) => preferredTopics.includes(t)).length;
      score += topicMatches * 5;

      if (learningStyle === 'interactive' && c.level === 'Beginner') score += 10;

      const prog = progressByCourse.get(c.id);
      if (prog) {
        if (prog.is_completed) score = 0;
        else score += 20;
      }

      score = Math.min(100, Math.max(0, Math.round(score)));
      const confidence = Math.min(100, Math.max(70, score));

      return {
        course: {
          id: c.id,
          title: c.title,
          description: c.description,
          category: tags[0] || 'General',
          difficulty: c.level === 'Beginner' ? 'beginner' : c.level === 'Intermediate' ? 'intermediate' : 'advanced',
          estimatedHours: c.estimated_hours,
          prerequisites: [],
          tags,
          learningObjectives: [],
          modules: [],
          rating: 4.6,
          enrollmentCount: 1000,
          completionRate: 0.7,
          lastUpdated: new Date(),
        },
        score,
        reasons: buildReasons(c, preferredTopics, prog),
        confidence: confidence / 100,
        estimatedCompletionTime: c.estimated_hours * 60,
        skillGapAnalysis: [],
      };
    })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return Response.json({ recommendations, totalCount: recommendations.length, queryTime: 1, hasMore: false });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

function buildReasons(c: DbCourse, preferredTopics: string[], prog?: DbProgress | undefined): string[] {
  const reasons: string[] = [];
  const tags = c.tags ?? [];
  const match = tags.filter((t) => preferredTopics.includes(t));
  if (match.length) reasons.push(`匹配你的兴趣：${match.join('、')}`);
  if (c.level === 'Beginner') reasons.push('适合初学者逐步提升');
  if (prog && !prog.is_completed) reasons.push('继续你已开始但未完成的课程类别');
  return reasons.length ? reasons : ['综合匹配度较高'];
}
