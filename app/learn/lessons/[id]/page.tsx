import { Suspense } from 'react';
import postgres from 'postgres';
import Quiz from '@/app/ui/learn/quiz';

async function getLesson(id: string) {
  const sql = postgres(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING!, {
    ssl: process.env.POSTGRES_SSL === 'require' ? 'require' : undefined,
  });
  const rows = await sql`
    SELECT id, course_id, title, objective, content, duration_min, order_index
    FROM lessons WHERE id = ${id}
  `;
  return rows[0] || null;
}

async function getQuiz(id: string) {
  const sql = postgres(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING!, {
    ssl: process.env.POSTGRES_SSL === 'require' ? 'require' : undefined,
  });
  const rows = await sql`
    SELECT id, lesson_id, prompt, choices
    FROM quiz_questions WHERE lesson_id = ${id}
  `;
  return rows as any[];
}

async function LessonContent({ id }: { id: string }) {
  const lesson = await getLesson(id);
  if (!lesson) return <div className="text-red-600">Lesson not found.</div>;
  return (
    <div className="space-y-2 rounded-xl bg-gray-50 p-4">
      <h2 className="text-xl font-semibold">{lesson.title}</h2>
      <p className="text-sm text-gray-600">{lesson.objective}</p>
      <pre className="whitespace-pre-wrap text-gray-800">{lesson.content}</pre>
      <div className="text-xs text-gray-500">Duration: {lesson.duration_min} min</div>
    </div>
  );
}

async function LessonQuiz({ id }: { id: string }) {
  const qs = await getQuiz(id);
  return <Quiz questions={qs} />;
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading lesson...</div>}>
        <LessonContent id={id} />
      </Suspense>
      <Suspense fallback={<div>Loading practice...</div>}>
        <LessonQuiz id={id} />
      </Suspense>
    </div>
  );
}
