'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type PipelineColumn = {
  stage: string
  leads: Array<{
    leadId: string
    name: string
    company: string
    businessType: string
    leadScore: number
    priority: string
  }>
}

export function PipelineBoard({ columns }: { columns: PipelineColumn[] }) {
  const router = useRouter()
  const [dragLeadId, setDragLeadId] = useState<string | null>(null)
  const [pendingStage, setPendingStage] = useState<string | null>(null)
  const [error, setError] = useState('')

  const updateStage = async (leadId: string, stage: string) => {
    setPendingStage(stage)
    setError('')

    try {
      const response = await fetch(`/api/crm/leads/${leadId}/stage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newStage: stage }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ message: 'Failed to move lead.' }))
        throw new Error(payload.message)
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move lead.')
    } finally {
      setPendingStage(null)
      setDragLeadId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-6">
        {columns.map((column) => (
          <section
            key={column.stage}
            className="rounded-[28px] border border-white/10 bg-[#081321]/92 p-4"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              const leadId = event.dataTransfer.getData('text/plain') || dragLeadId
              if (leadId) {
                void updateStage(leadId, column.stage)
              }
            }}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{column.stage}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                  {column.leads.length} leads
                </p>
              </div>
              {pendingStage === column.stage && (
                <span className="text-xs font-semibold text-cyan-300">Saving...</span>
              )}
            </div>

            <div className="space-y-3">
              {column.leads.map((lead) => (
                <article
                  key={lead.leadId}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData('text/plain', lead.leadId)
                    setDragLeadId(lead.leadId)
                  }}
                  className="cursor-grab rounded-2xl border border-white/8 bg-white/5 p-4 active:cursor-grabbing"
                >
                  <p className="font-semibold text-white">{lead.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{lead.company}</p>
                  <p className="mt-3 text-sm text-slate-300">{lead.businessType}</p>
                  <div className="mt-4 flex items-center justify-between gap-3 text-xs">
                    <span className="rounded-full bg-white/10 px-2 py-1 font-semibold text-slate-200">
                      Score {lead.leadScore}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 font-semibold ${
                        lead.priority === 'High'
                          ? 'bg-rose-400/10 text-rose-200'
                          : lead.priority === 'Medium'
                            ? 'bg-amber-400/10 text-amber-200'
                            : 'bg-slate-400/10 text-slate-200'
                      }`}
                    >
                      {lead.priority}
                    </span>
                  </div>
                </article>
              ))}

              {!column.leads.length && (
                <div className="rounded-2xl border border-dashed border-white/15 px-4 py-8 text-center text-sm text-slate-500">
                  Drop a lead here
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {error && <p className="text-sm text-rose-300">{error}</p>}
    </div>
  )
}
