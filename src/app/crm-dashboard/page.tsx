import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type ContactRow = {
  id: number
  full_name?: string | null
  name?: string | null
  email?: string | null
  phone?: string | null
  company?: string | null
  service_interest?: string | null
  lead_source?: string | null
  created_at?: string | null
}

type LeadRow = {
  id: number
  contact_id?: number | null
  pipeline?: string | null
  stage?: string | null
  lead_score?: number | null
  priority?: string | null
  created_at?: string | null
}

type SubmissionRow = {
  id: number
  contact_id?: number | null
  form_name?: string | null
  business_type?: string | null
  service_selected?: string | null
  inquiries_per_week?: string | null
  message?: string | null
  submitted_at?: string | null
}

type ActivityRow = {
  id: number
  contact_id?: number | null
  type?: string | null
  activity_date?: string | null
  outcome?: string | null
  notes?: string | null
}

const pipelineAccents: Record<string, string> = {
  'New Lead': 'from-lime-300/30 to-lime-500/5',
  Qualified: 'from-sky-300/30 to-sky-500/5',
  'Proposal Sent': 'from-amber-300/30 to-amber-500/5',
  Won: 'from-emerald-300/30 to-emerald-500/5',
  Lost: 'from-rose-300/30 to-rose-500/5',
}

function formatDate(value?: string | null) {
  if (!value) return 'N/A'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function toneForPriority(priority?: string | null) {
  return priority === 'High'
    ? 'bg-rose-400/10 text-rose-200'
    : priority === 'Medium'
      ? 'bg-amber-400/10 text-amber-200'
      : 'bg-slate-400/10 text-slate-200'
}

async function getDashboardData() {
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return {
      configured: false,
      error: 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      contacts: [] as ContactRow[],
      leads: [] as LeadRow[],
      submissions: [] as SubmissionRow[],
      activities: [] as ActivityRow[],
    }
  }

  const [contactsRes, leadsRes, submissionsRes, activitiesRes] = await Promise.all([
    supabase
      .from('contacts')
      .select('id, full_name, name, email, phone, company, service_interest, lead_source, created_at')
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('leads')
      .select('id, contact_id, pipeline, stage, lead_score, priority, created_at')
      .order('created_at', { ascending: false })
      .limit(12),
    supabase
      .from('form_submissions')
      .select('id, contact_id, form_name, business_type, service_selected, inquiries_per_week, message, submitted_at')
      .order('submitted_at', { ascending: false })
      .limit(50),
    supabase
      .from('activities')
      .select('id, contact_id, type, activity_date, outcome, notes')
      .order('activity_date', { ascending: false })
      .limit(8),
  ])

  const errors = [contactsRes.error, leadsRes.error, submissionsRes.error, activitiesRes.error]
    .filter(Boolean)
    .map((entry) => entry?.message)
    .join(' | ')

  return {
    configured: !errors,
    error: errors || null,
    contacts: (contactsRes.data ?? []) as ContactRow[],
    leads: (leadsRes.data ?? []) as LeadRow[],
    submissions: (submissionsRes.data ?? []) as SubmissionRow[],
    activities: (activitiesRes.data ?? []) as ActivityRow[],
  }
}

export default async function CrmDashboardPage() {
  const { configured, error, contacts, leads, submissions, activities } = await getDashboardData()

  const contactsById = new Map(
    contacts.map((contact) => [
      contact.id,
      {
        name: contact.full_name || contact.name || 'Unnamed Contact',
        email: contact.email || 'No email',
        phone: contact.phone || 'No phone yet',
        company: contact.company || 'No company yet',
        serviceInterest: contact.service_interest || 'Lead System Audit',
        source: contact.lead_source || 'Website',
      },
    ])
  )

  const leadRows = leads.map((lead) => {
    const contact = lead.contact_id ? contactsById.get(lead.contact_id) : null
    const relatedSubmission = submissions.find((entry) => entry.contact_id === lead.contact_id)

    return {
      id: lead.id,
      name: contact?.name || 'Unknown Lead',
      company: contact?.company || 'No company yet',
      service:
        relatedSubmission?.service_selected ||
        relatedSubmission?.business_type ||
        contact?.serviceInterest ||
        'Lead System Audit',
      stage: lead.stage || 'New Lead',
      score: lead.lead_score ?? 0,
      priority: lead.priority || 'Medium',
      source: contact?.source || 'Website',
    }
  })

  const stageMap = new Map<string, { count: number; totalScore: number }>()
  leads.forEach((lead) => {
    const stage = lead.stage || 'New Lead'
    const current = stageMap.get(stage) || { count: 0, totalScore: 0 }
    current.count += 1
    current.totalScore += lead.lead_score ?? 0
    stageMap.set(stage, current)
  })

  const pipelineStages = Array.from(stageMap.entries()).map(([name, stats]) => ({
    name,
    count: stats.count,
    avgScore: stats.count ? Math.round(stats.totalScore / stats.count) : 0,
    accent: pipelineAccents[name] || 'from-slate-300/20 to-slate-500/5',
  }))

  const sourceCounts = contacts.reduce<Record<string, number>>((acc, contact) => {
    const source = contact.lead_source || 'Website'
    acc[source] = (acc[source] || 0) + 1
    return acc
  }, {})
  const topSource = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0]

  const serviceCounts = submissions.reduce<Record<string, number>>((acc, submission) => {
    const service =
      submission.service_selected || submission.business_type || 'Lead System Audit'
    acc[service] = (acc[service] || 0) + 1
    return acc
  }, {})
  const topService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]

  const qualifiedCount = leads.filter((lead) =>
    ['Qualified', 'Proposal Sent', 'Won'].includes(lead.stage || '')
  ).length
  const averageLeadScore = leads.length
    ? Math.round(
        leads.reduce((sum, lead) => sum + (lead.lead_score ?? 0), 0) / leads.length
      )
    : 0

  const recentContacts = contacts.slice(0, 4).map((contact) => {
    const lead = leads.find((entry) => entry.contact_id === contact.id)
    return {
      id: contact.id,
      name: contact.full_name || contact.name || 'Unnamed Contact',
      company: contact.company || 'No company yet',
      email: contact.email || 'No email',
      phone: contact.phone || 'No phone yet',
      status: lead?.stage || 'Contact Added',
    }
  })

  const recentActivity = activities.length
    ? activities.map((activity) => {
        const contact = activity.contact_id ? contactsById.get(activity.contact_id) : null
        return `${contact?.name || 'A contact'}: ${activity.type || 'Activity'}${activity.outcome ? ` - ${activity.outcome}` : ''}${activity.notes ? ` - ${activity.notes}` : ''}`
      })
    : leadRows.slice(0, 4).map((lead) => `${lead.name} entered ${lead.stage}.`)

  const stats = [
    {
      label: 'Total Leads',
      value: String(leads.length),
      change: `${qualifiedCount} currently qualified`,
      tone: 'border-lime-400/30 bg-lime-400/8 text-lime-200',
    },
    {
      label: 'Contacts',
      value: String(contacts.length),
      change: `${topSource ? `${topSource[0]} leads: ${topSource[1]}` : 'No source data yet'}`,
      tone: 'border-sky-400/30 bg-sky-400/8 text-sky-200',
    },
    {
      label: 'Pipeline Stages',
      value: String(pipelineStages.length),
      change: pipelineStages.length ? 'Live stage breakdown from Supabase' : 'No stages yet',
      tone: 'border-amber-400/30 bg-amber-400/8 text-amber-200',
    },
    {
      label: 'Avg Lead Score',
      value: String(averageLeadScore),
      change: leads.length ? 'Calculated from the leads table' : 'Waiting for lead data',
      tone: 'border-rose-400/30 bg-rose-400/8 text-rose-200',
    },
  ]

  const analytics = [
    {
      label: 'Top Lead Source',
      value: topSource?.[0] || 'N/A',
      note: topSource ? `${topSource[1]} contacts captured` : 'Add contact source values to see distribution',
    },
    {
      label: 'Top Service',
      value: topService?.[0] || 'N/A',
      note: topService ? `${topService[1]} submissions tied to this offer` : 'Needs form submission data',
    },
    {
      label: 'Latest Submission',
      value: submissions[0]?.submitted_at ? formatDate(submissions[0].submitted_at) : 'N/A',
      note: submissions[0]?.form_name || 'Waiting for website inquiries',
    },
    {
      label: 'Recent Activity',
      value: String(activities.length),
      note: activities.length ? 'Pulled from the activities table' : 'No logged sales activity yet',
    },
  ]

  return (
    <main className="min-h-screen bg-[#06111f] text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(163,230,53,0.13),transparent_24%),linear-gradient(180deg,#07111d_0%,#020816_100%)]" />

      <section className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-6 lg:px-10">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
              PyowDigitals CRM
            </p>
            <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Standalone Revenue Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Live data is now read from Supabase so this page can grow into a separate dashboard
              surface later.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              {configured ? 'Connected to Supabase' : 'Setup needed'}
            </span>
            <Link
              href="/"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
            >
              Back to Site
            </Link>
          </div>
        </div>
      </section>

      {!configured && (
        <section className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
          <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm text-amber-100">
            <p className="font-semibold">Supabase is not fully configured yet.</p>
            <p className="mt-2">
              {error}
              {' '}
              Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`,
              then make sure the `contacts`, `leads`, `form_submissions`, and `activities` tables
              exist.
            </p>
          </div>
        </section>
      )}

      {configured && error && (
        <section className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
          <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-5 text-sm text-rose-100">
            <p className="font-semibold">Supabase responded with an error.</p>
            <p className="mt-2">{error}</p>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((card) => (
            <article
              key={card.label}
              className={`rounded-2xl border p-5 shadow-[0_18px_40px_rgba(0,0,0,0.24)] ${card.tone}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                {card.label}
              </p>
              <p className="mt-4 text-4xl font-black tracking-[-0.05em] text-white">{card.value}</p>
              <p className="mt-2 text-sm text-slate-300">{card.change}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-8 lg:grid-cols-[1.35fr_0.9fr] lg:px-10">
        <div className="rounded-[28px] border border-white/10 bg-[#0a1728]/88 p-6 backdrop-blur">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
                Pipeline Stages
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">Current Deal Flow</h2>
            </div>
            <p className="text-sm text-slate-400">Live grouped by the `leads.stage` field</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {pipelineStages.length ? (
              pipelineStages.map((stage) => (
                <article
                  key={stage.name}
                  className={`rounded-3xl border border-white/10 bg-gradient-to-br ${stage.accent} p-5`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{stage.name}</p>
                      <p className="mt-3 text-4xl font-black tracking-[-0.05em] text-white">
                        {stage.count}
                      </p>
                      <p className="mt-2 text-sm text-slate-300">
                        Avg score {stage.avgScore}
                      </p>
                    </div>
                    <div className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">
                      Live
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/15 p-8 text-sm text-slate-400">
                No lead stages yet. Once rows exist in `leads`, the stage breakdown will appear here.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#081321]/92 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
            Analytics
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">Performance Signals</h2>

          <div className="mt-6 space-y-4">
            {analytics.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-white/8 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-slate-200">{item.label}</p>
                  <p className="text-xl font-black tracking-[-0.04em] text-lime-300">
                    {item.value}
                  </p>
                </div>
                <p className="mt-2 text-sm text-slate-400">{item.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-12 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
        <div className="rounded-[28px] border border-white/10 bg-[#0a1728]/88 p-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
                Leads
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">Lead Queue</h2>
            </div>
            <p className="text-sm text-slate-400">Joined from `leads` + `contacts` + `form_submissions`</p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Lead</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Stage</th>
                  <th className="px-4 py-3 font-semibold">Score</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-[#07101d]">
                {leadRows.length ? (
                  leadRows.map((lead) => (
                    <tr key={lead.id} className="align-top">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-white">{lead.name}</p>
                        <p className="mt-1 text-slate-400">{lead.company}</p>
                      </td>
                      <td className="px-4 py-4 text-slate-300">{lead.service}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                          {lead.stage}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{lead.score}</span>
                          <span
                            className={`rounded-full px-2 py-1 text-[11px] font-semibold ${toneForPriority(lead.priority)}`}
                          >
                            {lead.priority}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-300">{lead.source}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                      No leads found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-[#081321]/92 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
              Contacts
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">Recent Contacts</h2>

            <div className="mt-5 space-y-3">
              {recentContacts.length ? (
                recentContacts.map((contact) => (
                  <article
                    key={contact.id}
                    className="rounded-2xl border border-white/8 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{contact.name}</p>
                        <p className="mt-1 text-sm text-slate-400">{contact.company}</p>
                      </div>
                      <span className="rounded-full bg-lime-400/10 px-3 py-1 text-[11px] font-semibold text-lime-200">
                        {contact.status}
                      </span>
                    </div>
                    <div className="mt-4 space-y-1 text-sm text-slate-300">
                      <p>{contact.email}</p>
                      <p>{contact.phone}</p>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/15 p-6 text-sm text-slate-400">
                  No contacts yet.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#081321]/92 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
              Activity
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">Recent Timeline</h2>

            <div className="mt-6 space-y-4">
              {recentActivity.length ? (
                recentActivity.map((entry) => (
                  <div key={entry} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                    <p className="text-sm leading-relaxed text-slate-300">{entry}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">No activity logged yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
