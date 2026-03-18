import { CONTACT_DEFAULTS } from '@/backend/constants/contact'
import type { NormalizedContactPayload } from '@/backend/models/contact'
import { getAdminSupabaseClient } from '@/backend/infrastructure/supabase/adminClient'

export async function insertFormSubmission(contactId: number | string, payload: NormalizedContactPayload) {
  const supabase = getAdminSupabaseClient()
  const { error } = await supabase.from('form_submissions').insert({
    contact_id: contactId,
    form_name: CONTACT_DEFAULTS.submissionFormName,
    business_type: payload.businessType,
    inquiries_per_week: payload.inquiriesPerWeek,
    message: payload.challenge,
    service_selected: payload.businessType,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function getLatestFormSubmissionId(contactId: number | string) {
  const supabase = getAdminSupabaseClient()
  const { data, error } = await supabase
    .from('form_submissions')
    .select('id')
    .eq('contact_id', contactId)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data?.id ?? null
}
