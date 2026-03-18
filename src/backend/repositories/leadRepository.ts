import { CONTACT_PIPELINE } from '@/backend/constants/contact'
import type { LeadPriority } from '@/backend/models/contact'
import { getAdminSupabaseClient } from '@/backend/infrastructure/supabase/adminClient'

export async function insertLead(contactId: number | string, leadScore: number, priority: LeadPriority) {
  const supabase = getAdminSupabaseClient()
  const { data, error } = await supabase
    .from('leads')
    .insert({
      contact_id: contactId,
      pipeline: CONTACT_PIPELINE.defaultPipeline,
      stage: CONTACT_PIPELINE.defaultStage,
      lead_score: leadScore,
      priority,
    })
    .select('id')
    .single()

  if (error || !data) {
    throw new Error(error?.message || 'Failed to create lead record.')
  }

  return data
}

export async function getLatestLeadId(contactId: number | string) {
  const supabase = getAdminSupabaseClient()
  const { data, error } = await supabase
    .from('leads')
    .select('id')
    .eq('contact_id', contactId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data?.id ?? null
}
