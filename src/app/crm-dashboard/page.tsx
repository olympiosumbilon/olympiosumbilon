import Link from 'next/link'
import { CrmShell } from '@/components/crm/CrmShell'
import { RealtimeRefresh } from '@/components/crm/RealtimeRefresh'
import { fetchDashboardOverview } from '@/lib/crm/store'

export const dynamic = 'force-dynamic'

export default async function CrmDashboardPage() {
  const overview = await fetchDashboardOverview()
  const maxDaily = Math.max(...overview.leadsPerDay.map((item) => item.count), 1)
  const maxBusiness = Math.max(...overview.leadsByBusinessType.map((item) => item.count), 1)
  const maxPipeline = Math.max(...overview.pipelineDistribution.map((item) => item.count), 1)

  return (
    <CrmShell
      eyebrow="PyowDigitals CRM"
      title="Revenue Dashboard"
      description="Live CRM analytics pulled from Supabase with room for future standalone deployment."
    >
      <RealtimeRefresh tables={['leads', 'activities', 'form_submissions', 'contacts']} />

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        {overview.error && (
          <div className="mb-6 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm text-amber-100">
            {overview.error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Total Leads',
              value: overview.stats.totalLeads,
              note: 'All leads currently in the CRM',
              tone: 'border-lime-400/30 bg-lime-400/8 text-lime-200',
            },
            {
              label: 'Qualified Leads',
              value: overview.stats.qualifiedLeads,
              note: 'Qualified, discovery, proposal, or won',
              tone: 'border-sky-400/30 bg-sky-400/8 text-sky-200',
            },
            {
              label: 'Conversion Rate',
              value: `${overview.stats.conversionRate}%`,
              note: 'Closed won divided by total leads',
              tone: 'border-amber-400/30 bg-amber-400/8 text-amber-200',
            },
            {
              label: 'Average Lead Score',
              value: overview.stats.averageLeadScore,
              note: 'Live score average from the leads table',
              tone: 'border-rose-400/30 bg-rose-400/8 text-rose-200',
            },
          ].map((card) => (
            <article key={card.label} className={`rounded-2xl border p-5 ${card.tone}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                {card.label}
              </p>
              <p className="mt-4 text-4xl font-black tracking-[-0.05em] text-white">{card.value}</p>
              <p className="mt-2 text-sm text-slate-300">{card.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-8 lg:grid-cols-3 lg:px-10">
        <div className="rounded-[28px] border border-white/10 bg-[#081321]/92 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
            Leads per Day
          </p>
          <div className="mt-6 space-y-4">
            {overview.leadsPerDay.length ? (
              overview.leadsPerDay.map((item) => (
                <div key={item.date}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-300">{item.date}</span>
                    <span className="font-semibold text-white">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div
                      className="h-2 rounded-full bg-cyan-300"
                      style={{ width: `${(item.count / maxDaily) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No lead history yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#081321]/92 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
            Leads by Business Type
          </p>
          <div className="mt-6 space-y-4">
            {overview.leadsByBusinessType.length ? (
              overview.leadsByBusinessType.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="font-semibold text-white">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div
                      className="h-2 rounded-full bg-lime-300"
                      style={{ width: `${(item.count / maxBusiness) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No business type data yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#081321]/92 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
            Pipeline Distribution
          </p>
          <div className="mt-6 space-y-4">
            {overview.pipelineDistribution.length ? (
              overview.pipelineDistribution.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="font-semibold text-white">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div
                      className="h-2 rounded-full bg-amber-300"
                      style={{ width: `${(item.count / maxPipeline) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No pipeline data yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-10">
        <div className="rounded-[28px] border border-white/10 bg-[#0a1728]/88 p-6">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
                Recent Leads
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">CRM Feed</h2>
            </div>
            <Link
              href="/crm-dashboard/leads"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
            >
              Open Leads Table
            </Link>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Business Type</th>
                  <th className="px-4 py-3 font-semibold">Stage</th>
                  <th className="px-4 py-3 font-semibold">Score</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-[#07101d]">
                {overview.recentLeads.length ? (
                  overview.recentLeads.map((lead) => (
                    <tr key={lead.leadId}>
                      <td className="px-4 py-4">
                        <Link href={`/crm-dashboard/leads/${lead.leadId}`} className="font-semibold text-white hover:text-cyan-200">
                          {lead.name}
                        </Link>
                        <p className="mt-1 text-slate-400">{lead.email}</p>
                      </td>
                      <td className="px-4 py-4 text-slate-300">{lead.businessType}</td>
                      <td className="px-4 py-4 text-slate-300">{lead.stage}</td>
                      <td className="px-4 py-4 text-slate-300">{lead.leadScore}</td>
                      <td className="px-4 py-4 text-slate-300">
                        {lead.createdAt ? lead.createdAt.slice(0, 10) : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                      No leads available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </CrmShell>
  )
}
