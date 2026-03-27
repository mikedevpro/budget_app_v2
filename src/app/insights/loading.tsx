import LoadingCard from "@/components/ui/LoadingCard";

export default function InsightsLoading() {
  return (
    <main className="space-y-6 sm:space-y-8">
      <LoadingCard lines={2} className="sm:p-8" />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <LoadingCard lines={1} />
        <LoadingCard lines={1} />
        <LoadingCard lines={1} />
        <LoadingCard lines={1} />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <LoadingCard lines={5} className="min-h-[360px]" />
        <LoadingCard lines={5} className="min-h-[360px]" />
      </div>
    </main>
  );
}