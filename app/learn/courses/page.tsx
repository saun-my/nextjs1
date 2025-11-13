import { Suspense } from 'react';
import postgres from 'postgres';
import Search from '@/app/ui/search';

async function CourseGrid({ query }: { query: string }) {
  const sql = postgres(process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING!, {
    ssl: process.env.POSTGRES_SSL === 'require' ? 'require' : undefined,
  });
  const rows = await sql`
    SELECT id, title, level, description, cover_url, lessons_count
    FROM courses
  `;
  const q = (query || '').toLowerCase();
  const courses = rows.filter((c: any) =>
    !q || c.title.toLowerCase().includes(q) || c.level.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  );
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((c: any) => (
        <a
          key={c.id}
          href={`/learn/courses/${c.id}`}
          className="rounded-xl bg-gray-50 p-4 hover:bg-gray-100"
        >
          <div className="h-32 w-full overflow-hidden rounded bg-white">
            {/* 简化：用背景图模拟封面 */}
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${c.cover_url})` }}
            />
          </div>
          <h3 className="mt-3 text-lg font-semibold">{c.title}</h3>
          <p className="text-sm text-gray-600">{c.level}</p>
          <p className="mt-2 text-sm text-gray-700 line-clamp-2">
            {c.description}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            {c.lessons_count} lessons
          </p>
        </a>
      ))}
    </div>
  );
}

export default async function Page(props: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const sp = await props.searchParams;
  const query = sp?.query || '';
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Courses</h2>
      </div>
      <Search />
      <Suspense key={query} fallback={<div>Loading courses...</div>}>
        <CourseGrid query={query} />
      </Suspense>
    </div>
  );
}
