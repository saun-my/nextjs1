export const dynamic = 'force-dynamic';

export default async function Page() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">我的进度</h2>
      <p className="text-gray-700">显示已完成课节与测验成绩（当前为占位）。</p>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="h-24 rounded bg-white" />
        <p className="mt-2 text-sm text-gray-600">占位内容</p>
      </div>
    </div>
  );
}