import { NextResponse } from 'next/server'
import { performLeadAction } from '@/lib/crm/store'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      leadId?: string
      action?: 'mark-qualified' | 'schedule-call' | 'send-proposal' | 'close-deal'
    }

    if (!body.leadId || !body.action) {
      return NextResponse.json({ message: 'Missing leadId or action.' }, { status: 400 })
    }

    await performLeadAction({
      leadId: body.leadId,
      action: body.action,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to run lead action.' },
      { status: 500 }
    )
  }
}
