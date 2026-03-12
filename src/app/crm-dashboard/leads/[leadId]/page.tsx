import { notFound } from 'next/navigation'
import { CrmShell } from '@/components/crm/CrmShell'
import { LeadActions } from '@/components/crm/LeadActions'
import { RealtimeRefresh } from '@/components/crm/RealtimeRefresh'
import { fetchLeadProfile } from '@/lib/crm/store'

export const dynamic = 'force-dynamic'

export default async function LeadProfilePage({
  params,
}: {
  params: { leadId: string }
}) {
  const { profile, error } = await fetchLeadProfile(params.leadId)

  if (!profile) {
    notFound()
  }

  return (
    <CrmShell
      eyebrow="Phase 2 / 4 / 8"
      title={profile.lead.name}
      description="Lead profile with CRM context, latest form details, and a chronological activity timeline."
    >
      <RealtimeRefresh tables={['leads', 'activities', 'form_submissions', 'contacts']} />

      {error && (
        <section className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
          <div className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm text-amber-100">
            {error}
          </div>
        </section>
      )}

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-[#0a1728]/88 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
              Contact Details
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ['Name', profile.lead.name],
                ['Email', profile.lead.email],
                ['Company', profile.lead.company],
                ['Lead Score', String(profile.lead.leadScore)],
                ['Priority', profile.lead.priority],
                ['Stage', profile.lead.stage],
                ['Business Type', profile.lead.businessType],
                ['Inquiries Per Week', profile.inquiriesPerWeek],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#0a1728]/88 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
              Challenge Message
            </p>
            <div className="mt-4 rounded-3xl border border-white/8 bg-white/5 p-5 text-sm leading-relaxed text-slate-300">
              {profile.challengeMessage}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#0a1728]/88 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
              Activities Timeline
            </p>
            <div className="mt-6 space-y-5">
              {profile.timeline.length ? (
                profile.timeline.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="mt-1 h-3 w-3 rounded-full bg-cyan-300" />
                      <span className="mt-2 h-full min-h-[2rem] w-px bg-white/10" />
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
                      <p className="font-semibold text-white">
                        {item.type}
                        <span className="ml-2 text-cyan-200">{item.outcome}</span>
                      </p>
                      <p className="mt-2 text-sm text-slate-300">{item.notes || 'No notes provided.'}</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500">
                        {item.activityDate ? item.activityDate.replace('T', ' ').slice(0, 16) : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">No activity logged yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <LeadActions leadId={profile.lead.leadId} />

          <div className="rounded-[28px] border border-white/10 bg-[#081321]/92 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
              Submission Summary
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">Latest Inquiry</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p>
                <span className="font-semibold text-white">Service:</span> {profile.serviceSelected}
              </p>
              <p>
                <span className="font-semibold text-white">Created:</span>{' '}
                {profile.lead.createdAt ? profile.lead.createdAt.slice(0, 10) : 'N/A'}
              </p>
              <p>
                <span className="font-semibold text-white">Contact ID:</span> {profile.lead.contactId}
              </p>
              <p>
                <span className="font-semibold text-white">Lead ID:</span> {profile.lead.leadId}
              </p>
            </div>
          </div>
        </div>
      </section>
    </CrmShell>
  )
}
