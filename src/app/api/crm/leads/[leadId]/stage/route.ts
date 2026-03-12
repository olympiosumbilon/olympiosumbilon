import { NextResponse } from 'next/server'
import { updateLeadStage } from '@/lib/crm/store'

export async function POST(
  request: Request,
  { params }: { params: { leadId: string } }
) {
  try {
    const body = (await request.json()) as { newStage?: string }

    if (!params.leadId || !body.newStage) {
      return NextResponse.json({ message: 'Missing leadId or newStage.' }, { status: 400 })
    }

    await updateLeadStage({
      leadId: params.leadId,
      newStage: body.newStage,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to update stage.' },
      { status: 500 }
    )
  }
}
