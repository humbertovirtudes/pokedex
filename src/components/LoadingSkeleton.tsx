export function LoadingSkeleton() {
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 animate-pulse">
      <div className="aspect-square bg-gray-800 rounded-xl mb-3" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-800 rounded w-3/4" />
        <div className="flex gap-2">
          <div className="h-6 bg-gray-800 rounded-full w-16" />
          <div className="h-6 bg-gray-800 rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}
