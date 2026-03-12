export default function CrmDashboardLoading() {
  return (
    <main className="min-h-screen bg-[#06111f] px-6 py-10 text-slate-100 lg:px-10">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-20 rounded-3xl bg-white/5" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 rounded-3xl bg-white/5" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="h-96 rounded-3xl bg-white/5" />
          <div className="h-96 rounded-3xl bg-white/5" />
        </div>
      </div>
    </main>
  )
}
