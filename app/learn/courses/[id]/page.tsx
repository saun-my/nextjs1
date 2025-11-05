import { fetchCourseById, fetchLessonsByCourseId } from '@/app/lib/learn-data';
import { Suspense } from 'react';

async function LessonList({ courseId }: { courseId: string }) {
  const lessons = await fetchLessonsByCourseId(courseId);
  return (
    <ul className="space-y-2">
      {lessons.map((l) => (
        <li key={l.id} className="rounded border p-3 hover:bg-gray-50">
          <a href={`/learn/lessons/${l.id}`}>
            <div className="font-medium">{l.title}</div>
            <div className="text-sm text-gray-600">{l.objective}</div>
            <div className="text-xs text-gray-500">{l.duration_min} min</div>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const course = await fetchCourseById(id);
  if (!course) {
    return <div className="text-red-600">Course not found.</div>;
  }
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-gray-50 p-4">
        <h2 className="text-xl font-semibold">{course.title}</h2>
        <p className="text-sm text-gray-600">{course.level}</p>
        <p className="mt-2 text-gray-700">{course.description}</p>
      </div>
      <h3 className="text-lg font-semibold">Lessons</h3>
      <Suspense fallback={<div>Loading lessons...</div>}>
        <LessonList courseId={course.id} />
      </Suspense>
    </div>
  );
}