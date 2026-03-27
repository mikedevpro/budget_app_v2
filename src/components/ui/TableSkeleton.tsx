type TableSkeletonProps = {
  rows?: number;
};

export default function TableSkeleton({ rows = 5 }: TableSkeletonProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-full space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1.2fr_1fr_1fr_100px] gap-4 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-4"
          >
            <div className="h-4 rounded bg-white/10 animate-pulse" />
            <div className="h-4 rounded bg-white/10 animate-pulse" />
            <div className="h-4 rounded bg-white/10 animate-pulse" />
            <div className="h-4 rounded bg-white/10 animate-pulse" />
            <div className="h-4 rounded bg-white/10 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}