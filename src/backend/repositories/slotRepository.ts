import { BOOKING_CONSTANTS } from '@/backend/constants/booking'
import { getAdminSupabaseClient } from '@/backend/infrastructure/supabase/adminClient'

export async function lockAvailableSlot(slotId: number) {
  const supabase = getAdminSupabaseClient()
  const { data, error } = await supabase
    .from('available_slots')
    .update({ is_booked: true })
    .eq('id', slotId)
    .eq('is_booked', false)
    .select('id, slot_date, start_time, end_time')

  if (error) {
    throw new Error('Failed to reserve the selected slot.')
  }

  return data?.[0] || null
}

export async function releaseAvailableSlot(slotId: number | string) {
  const supabase = getAdminSupabaseClient()
  await supabase
    .from('available_slots')
    .update({ is_booked: false, booking_id: null })
    .eq('id', slotId)
}

function getTodayInManila() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BOOKING_CONSTANTS.manilaTimeZone,
  }).format(new Date())
}

export async function fetchAvailableSlots(windowDays: number) {
  const supabase = getAdminSupabaseClient()
  const today = getTodayInManila()

  const { data, error } = await supabase
    .from('available_slots')
    .select('id, slot_date, start_time, end_time')
    .eq('is_booked', false)
    .gte('slot_date', today)
    .order('slot_date', { ascending: true })
    .order('start_time', { ascending: true })
    .limit(windowDays * BOOKING_CONSTANTS.slotsPerDayLimit)

  if (error) {
    throw new Error('Failed to load booking slots.')
  }

  return data ?? []
}
