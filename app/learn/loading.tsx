export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 rounded bg-gray-100" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-xl bg-gray-50 p-4">
            <div className="h-32 rounded bg-white" />
            <div className="mt-3 h-4 w-3/4 rounded bg-gray-100" />
            <div className="mt-2 h-4 w-1/2 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}