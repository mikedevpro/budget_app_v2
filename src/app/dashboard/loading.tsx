import LoadingCard from "@/components/ui/LoadingCard";

export default function DashboardLoading() {
  return (
    <main className="space-y-6 sm:space-y-8">
      <LoadingCard lines={2} className="sm:p-8" />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <LoadingCard lines={1} />
        <LoadingCard lines={1} />
        <LoadingCard lines={1} />
        <LoadingCard lines={1} />
      </section>

      <LoadingCard lines={2} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <LoadingCard lines={5} className="min-h-[320px]" />
        <div className="space-y-6">
          <LoadingCard lines={4} className="min-h-[280px]" />
          <LoadingCard lines={4} className="min-h-[280px]" />
        </div>
      </div>
    </main>
  );
}