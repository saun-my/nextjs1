import { Suspense } from 'react';
import Quiz from '@/app/ui/learn/quiz';

async function getLesson(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/learning/lessons/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

async function getQuiz(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/learning/quiz/by-lesson?lessonId=${encodeURIComponent(id)}`, { cache: 'no-store' });
  return res.json();
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
