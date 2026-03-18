import { CONTACT_DEFAULTS } from '@/backend/constants/contact'
import { getAdminSupabaseClient } from '@/backend/infrastructure/supabase/adminClient'

export async function upsertContact(name: string, email: string) {
  const supabase = getAdminSupabaseClient()
  const { data, error } = await supabase
    .from('contacts')
    .upsert(
      {
        full_name: name,
        name,
        email,
        service_interest: CONTACT_DEFAULTS.serviceInterest,
        lead_source: CONTACT_DEFAULTS.leadSource,
      },
      { onConflict: 'email' }
    )
    .select('id')
    .single()

  if (error || !data) {
    throw new Error(error?.message || 'Failed to create contact record.')
  }

  return data
}

export async function getContactByEmail(email: string) {
  const supabase = getAdminSupabaseClient()
  const { data, error } = await supabase
    .from('contacts')
    .select('id, name, full_name, email')
    .eq('email', email)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}
