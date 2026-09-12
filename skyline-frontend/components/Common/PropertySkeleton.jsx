export default function PropertySkeleton({ count = 6 }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-[10px] overflow-hidden animate-pulse">
          <div className="h-[190px] bg-slate-200" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-9 bg-slate-200 rounded mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
