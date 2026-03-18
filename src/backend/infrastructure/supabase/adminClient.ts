import { getSupabaseAdminClient } from '@/lib/supabase/server'

export function getAdminSupabaseClient() {
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    throw new Error('Supabase admin client is not configured.')
  }

  return supabase
}
