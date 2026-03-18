import { BOOKING_CONSTANTS } from '@/backend/constants/booking'
import { CONTACT_DEFAULTS } from '@/backend/constants/contact'
import { getAdminSupabaseClient } from '@/backend/infrastructure/supabase/adminClient'

export async function insertSubmissionActivity(contactId: number | string) {
  const supabase = getAdminSupabaseClient()
  const { error } = await supabase.from('activities').insert({
    contact_id: contactId,
    type: CONTACT_DEFAULTS.activityType,
    outcome: CONTACT_DEFAULTS.activityOutcome,
    notes: CONTACT_DEFAULTS.activityNotes,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function insertBookingActivity(input: {
  contactId: number | string
  bookingId: number | string
  slotDate: string
  startTime: string
  endTime: string
}) {
  const supabase = getAdminSupabaseClient()
  const { error } = await supabase.from('activities').insert({
    contact_id: input.contactId,
    type: BOOKING_CONSTANTS.activityType,
    outcome: BOOKING_CONSTANTS.activityOutcome,
    notes: `Website booking scheduled for ${input.slotDate} ${input.startTime}-${input.endTime}`,
    booking_id: input.bookingId,
  })

  if (error) {
    throw error
  }
}
