import { BOOKING_CONSTANTS } from '@/backend/constants/booking'
import { getAdminSupabaseClient } from '@/backend/infrastructure/supabase/adminClient'

export async function createBookingRecord(input: {
  contactId: number | string
  formSubmissionId: number | string | null
  slotId: number | string
}) {
  const supabase = getAdminSupabaseClient()
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      contact_id: input.contactId,
      form_submission_id: input.formSubmissionId,
      slot_id: input.slotId,
      status: BOOKING_CONSTANTS.status,
    })
    .select('id')
    .single()

  if (error || !data) {
    throw new Error(error?.message || 'Booking record was not created.')
  }

  return data
}

export async function linkSlotToBooking(slotId: number | string, bookingId: number | string) {
  const supabase = getAdminSupabaseClient()
  const { error } = await supabase
    .from('available_slots')
    .update({ booking_id: bookingId })
    .eq('id', slotId)

  if (error) {
    throw error
  }
}
