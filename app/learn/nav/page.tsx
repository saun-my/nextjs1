import LearnNavGrid from '@/app/ui/learn/nav-grid';

export const dynamic = 'force-dynamic';

export default async function Page() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">学习导航</h2>
      </div>
      <p className="text-gray-700">
        从这里进入课程、分级路径、练习与个人进度。
      </p>
      <LearnNavGrid />
    </div>
  );
}