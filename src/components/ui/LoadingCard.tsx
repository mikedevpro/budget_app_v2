type LoadingCardProps = {
  lines?: number;
  className?: string;
};

export default function LoadingCard({
  lines = 3,
  className = "",
}: LoadingCardProps) {
  return (
    <div
      className={`rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[0_0_24px_rgba(15,23,42,0.28)] backdrop-blur-sm ${className}`}
    >
      <div className="animate-pulse space-y-3">
        <div className="h-3 w-24 rounded bg-white/10" />
        <div className="h-8 w-40 rounded bg-white/10" />
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className="h-4 rounded bg-white/10"
            style={{ width: `${90 - index * 12}%` }}
          />
        ))}
      </div>
    </div>
  );
}