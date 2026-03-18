import type { BookingRequest, BookingResult, BookingSlot } from '@/backend/models/booking'
import { scheduleBookingAutomationJobs } from '@/backend/services/automationService'
import { insertBookingActivity } from '@/backend/repositories/activityRepository'
import { createBookingRecord, linkSlotToBooking } from '@/backend/repositories/bookingRepository'
import { getContactByEmail } from '@/backend/repositories/contactRepository'
import { getLatestLeadId } from '@/backend/repositories/leadRepository'
import { fetchAvailableSlots, lockAvailableSlot, releaseAvailableSlot } from '@/backend/repositories/slotRepository'
import { getLatestFormSubmissionId } from '@/backend/repositories/submissionRepository'
import { BOOKING_CONSTANTS } from '@/backend/constants/booking'

function getSlotAlreadyBookedResponse(): BookingResult {
  return {
    status: 409,
    body: { message: 'That slot has already been booked. Please choose another one.' },
  }
}

function getMissingLeadResponse(): BookingResult {
  return {
    status: 409,
    body: { message: 'Your lead record is not ready yet. Please wait a few seconds and try again.' },
  }
}

function getBookingFailureResponse(): BookingResult {
  return {
    status: 500,
    body: { message: 'We could not finalize your booking. Please try another slot.' },
  }
}

async function getBookingContactContext(email: string, lockedSlotId: number | string) {
  const contact = await getContactByEmail(email)
  if (!contact?.id) {
    await releaseAvailableSlot(lockedSlotId)
    return null
  }

  const [formSubmissionId, leadId] = await Promise.all([
    getLatestFormSubmissionId(contact.id),
    getLatestLeadId(contact.id),
  ])

  return {
    contact,
    formSubmissionId,
    leadId,
  }
}

async function scheduleBookingJobs(input: {
  contactId: number | string
  leadId: number | string | null
  bookingId: number | string
  contactName: string
  contactEmail: string
  slotDate: string
  startTime: string
  endTime: string
}) {
  try {
    await scheduleBookingAutomationJobs({
      contactId: input.contactId,
      leadId: input.leadId,
      bookingId: input.bookingId,
      name: input.contactName,
      email: input.contactEmail,
      slotDate: input.slotDate,
      startTime: input.startTime,
      endTime: input.endTime,
    })
  } catch (error) {
    console.error('Booking automation scheduling failed:', error)
  }
}

async function finalizeBooking(input: {
  contactId: number | string
  formSubmissionId: number | string | null
  leadId: number | string | null
  contactName: string
  contactEmail: string
  slot: BookingSlot
}) {
  const booking = await createBookingRecord({
    contactId: input.contactId,
    formSubmissionId: input.formSubmissionId,
    slotId: input.slot.id,
  })

  await linkSlotToBooking(input.slot.id, booking.id)
  await insertBookingActivity({
    contactId: input.contactId,
    bookingId: booking.id,
    slotDate: input.slot.slot_date,
    startTime: input.slot.start_time,
    endTime: input.slot.end_time,
  })
  await scheduleBookingJobs({
    contactId: input.contactId,
    leadId: input.leadId,
    bookingId: booking.id,
    contactName: input.contactName,
    contactEmail: input.contactEmail,
    slotDate: input.slot.slot_date,
    startTime: input.slot.start_time,
    endTime: input.slot.end_time,
  })

  return {
    status: 200,
    body: {
      message: 'Booking confirmed.',
      bookingId: booking.id,
      slot: input.slot,
    },
  }
}

export async function createWebsiteBooking(input: BookingRequest): Promise<BookingResult> {
  const lockedSlot = await lockAvailableSlot(input.slotId)
  if (!lockedSlot) {
    return getSlotAlreadyBookedResponse()
  }

  try {
    const bookingContext = await getBookingContactContext(input.email, lockedSlot.id)
    if (!bookingContext) {
      return getMissingLeadResponse()
    }

    return finalizeBooking({
      contactId: bookingContext.contact.id,
      formSubmissionId: bookingContext.formSubmissionId,
      leadId: bookingContext.leadId,
      contactName: bookingContext.contact.full_name || bookingContext.contact.name || 'there',
      contactEmail: bookingContext.contact.email || input.email,
      slot: lockedSlot,
    })
  } catch (error) {
    console.error('Failed to create booking:', error)
    await releaseAvailableSlot(lockedSlot.id)
    return getBookingFailureResponse()
  }
}

export async function getPublicBookingSlots(requestedDays: number) {
  const days = Number.isFinite(requestedDays)
    ? Math.min(Math.max(Math.trunc(requestedDays), 1), BOOKING_CONSTANTS.maxWindowDays)
    : BOOKING_CONSTANTS.defaultWindowDays

  return fetchAvailableSlots(days)
}
