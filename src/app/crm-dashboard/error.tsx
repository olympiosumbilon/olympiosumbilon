'use client'

export default function CrmDashboardError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <main className="min-h-screen bg-[#06111f] px-6 py-10 text-slate-100 lg:px-10">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-rose-400/20 bg-rose-400/10 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-200">
          CRM Error
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.03em]">Dashboard failed to load</h1>
        <p className="mt-3 text-sm text-rose-100">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
        >
          Retry
        </button>
      </div>
    </main>
  )
}
