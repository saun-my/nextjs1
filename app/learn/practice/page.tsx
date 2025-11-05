export const dynamic = 'force-dynamic';

export default async function Page() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">练习</h2>
      <p className="text-gray-700">这里是快速练习入口，后续可接入测验与打分。</p>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="h-24 rounded bg-white" />
        <p className="mt-2 text-sm text-gray-600">占位内容</p>
      </div>
    </div>
  );
}