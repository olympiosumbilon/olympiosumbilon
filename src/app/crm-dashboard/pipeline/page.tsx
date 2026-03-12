import { CrmShell } from '@/components/crm/CrmShell'
import { PipelineBoard } from '@/components/crm/PipelineBoard'
import { RealtimeRefresh } from '@/components/crm/RealtimeRefresh'
import { fetchPipelineBoard } from '@/lib/crm/store'

export const dynamic = 'force-dynamic'

export default async function PipelinePage() {
  const result = await fetchPipelineBoard()

  return (
    <CrmShell
      eyebrow="Phase 3"
      title="Pipeline Kanban"
      description="Drag leads between stages to keep the CRM pipeline current and log stage changes automatically."
    >
      <RealtimeRefresh tables={['leads', 'activities']} />

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        {result.error && (
          <div className="mb-6 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm text-amber-100">
            {result.error}
          </div>
        )}
        <PipelineBoard columns={result.columns} />
      </section>
    </CrmShell>
  )
}
