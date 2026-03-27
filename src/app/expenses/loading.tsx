import LoadingCard from "@/components/ui/LoadingCard";
import TableSkeleton from "@/components/ui/TableSkeleton";

export default function ExpensesLoading() {
  return (
    <main className="space-y-6 sm:space-y-8">
      <LoadingCard lines={2} className="sm:p-8" />
      <LoadingCard lines={2} />
      <LoadingCard lines={1}>
      </LoadingCard>
      <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_0_24px_rgba(15,23,42,0.28)] backdrop-blur-sm sm:p-6">
        <div className="mb-4">
          <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />
          <div className="mt-3 h-8 w-48 rounded bg-white/10 animate-pulse" />
        </div>
        <TableSkeleton rows={6} />
      </section>
    </main>
  );
}