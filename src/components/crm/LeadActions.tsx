'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const actions = [
  { id: 'mark-qualified', label: 'Mark as Qualified' },
  { id: 'schedule-call', label: 'Schedule Call' },
  { id: 'send-proposal', label: 'Send Proposal' },
  { id: 'close-deal', label: 'Close Deal' },
] as const

export function LeadActions({ leadId }: { leadId: string }) {
  const router = useRouter()
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [error, setError] = useState('')

  const runAction = async (action: (typeof actions)[number]['id']) => {
    setPendingAction(action)
    setError('')

    try {
      const response = await fetch('/api/crm/lead-actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadId, action }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ message: 'Failed to update lead.' }))
        throw new Error(payload.message)
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update lead.')
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#081321]/92 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
        CRM Actions
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">Next Best Action</h2>

      <div className="mt-5 grid gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => runAction(action.id)}
            disabled={pendingAction !== null}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-slate-100 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pendingAction === action.id ? 'Updating...' : action.label}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
    </div>
  )
}
