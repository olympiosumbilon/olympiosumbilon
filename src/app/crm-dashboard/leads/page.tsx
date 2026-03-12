import Link from 'next/link'
import { CrmShell } from '@/components/crm/CrmShell'
import { RealtimeRefresh } from '@/components/crm/RealtimeRefresh'
import { fetchLeadsPage } from '@/lib/crm/store'

export const dynamic = 'force-dynamic'

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: {
    q?: string
    stage?: string
    priority?: string
    page?: string
  }
}) {
  const search = searchParams.q || ''
  const stage = searchParams.stage || ''
  const priority = searchParams.priority || ''
  const page = Number.parseInt(searchParams.page || '1', 10) || 1

  const result = await fetchLeadsPage({ page, search, stage, priority })
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize))

  const buildQuery = (nextPage: number) => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (stage) params.set('stage', stage)
    if (priority) params.set('priority', priority)
    if (nextPage > 1) params.set('page', String(nextPage))
    return `/crm-dashboard/leads${params.toString() ? `?${params.toString()}` : ''}`
  }

  return (
    <CrmShell
      eyebrow="Phase 1"
      title="Leads Table"
      description="Search, filter, and paginate through leads fetched directly from Supabase."
    >
      <RealtimeRefresh tables={['leads', 'contacts', 'form_submissions']} />

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <form className="grid gap-4 rounded-[28px] border border-white/10 bg-[#081321]/92 p-5 md:grid-cols-[1.6fr_1fr_1fr_auto]">
          <input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Search by name or email"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-slate-500"
          />

          <select
            name="stage"
            defaultValue={stage}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="">All stages</option>
            {result.stageOptions.map((option) => (
              <option key={option} value={option} className="bg-slate-900">
                {option}
              </option>
            ))}
          </select>

          <select
            name="priority"
            defaultValue={priority}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="">All priorities</option>
            <option value="High" className="bg-slate-900">High</option>
            <option value="Medium" className="bg-slate-900">Medium</option>
            <option value="Low" className="bg-slate-900">Low</option>
          </select>

          <button
            type="submit"
            className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-400/20"
          >
            Apply Filters
          </button>
        </form>

        {result.error && (
          <div className="mt-6 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm text-amber-100">
            {result.error}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-10">
        <div className="rounded-[28px] border border-white/10 bg-[#0a1728]/88 p-6">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
                Live Results
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">
                {result.total} Leads Found
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              Page {result.page} of {totalPages}
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Business Type</th>
                  <th className="px-4 py-3 font-semibold">Lead Score</th>
                  <th className="px-4 py-3 font-semibold">Priority</th>
                  <th className="px-4 py-3 font-semibold">Stage</th>
                  <th className="px-4 py-3 font-semibold">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-[#07101d]">
                {result.rows.length ? (
                  result.rows.map((lead) => (
                    <tr key={lead.leadId}>
                      <td className="px-4 py-4">
                        <Link
                          href={`/crm-dashboard/leads/${lead.leadId}`}
                          className="font-semibold text-white hover:text-cyan-200"
                        >
                          {lead.name}
                        </Link>
                        <p className="mt-1 text-slate-500">{lead.company}</p>
                      </td>
                      <td className="px-4 py-4 text-slate-300">{lead.email}</td>
                      <td className="px-4 py-4 text-slate-300">{lead.businessType}</td>
                      <td className="px-4 py-4 text-slate-300">{lead.leadScore}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            lead.priority === 'High'
                              ? 'bg-rose-400/10 text-rose-200'
                              : lead.priority === 'Medium'
                                ? 'bg-amber-400/10 text-amber-200'
                                : 'bg-slate-400/10 text-slate-200'
                          }`}
                        >
                          {lead.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-300">{lead.stage}</td>
                      <td className="px-4 py-4 text-slate-300">
                        {lead.createdAt ? lead.createdAt.slice(0, 10) : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      No leads matched your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <Link
              href={buildQuery(Math.max(1, page - 1))}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                page <= 1
                  ? 'pointer-events-none border-white/5 bg-white/5 text-slate-500'
                  : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              Previous
            </Link>
            <Link
              href={buildQuery(Math.min(totalPages, page + 1))}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                page >= totalPages
                  ? 'pointer-events-none border-white/5 bg-white/5 text-slate-500'
                  : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              Next
            </Link>
          </div>
        </div>
      </section>
    </CrmShell>
  )
}
