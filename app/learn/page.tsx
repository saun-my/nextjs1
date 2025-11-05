import Link from 'next/link';
import LearnNavGrid from '../ui/learn/nav-grid';

export const dynamic = 'force-dynamic';

export default async function Page() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">学习导航</h2>
      </div>
      <LearnNavGrid />
    </div>
  );
}