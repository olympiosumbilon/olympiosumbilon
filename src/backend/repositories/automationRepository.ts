import type { BookingAutomationInput, LeadAutomationInput } from '@/backend/models/automation'
import {
  AUTOMATION_RULE_KEYS,
  AUTOMATION_STATUSES,
  AUTOMATION_TIMING,
  AUTOMATION_URLS,
} from '@/backend/constants/automation'
import { getAdminSupabaseClient } from '@/backend/infrastructure/supabase/adminClient'

const AUTOMATION_RULES = [
  {
    key: AUTOMATION_RULE_KEYS.leadInstantReply,
    name: 'Lead Instant Reply',
    channel: 'email',
    delay_minutes: 0,
    template_key: AUTOMATION_RULE_KEYS.leadInstantReply,
  },
  {
    key: AUTOMATION_RULE_KEYS.leadNoBooking24h,
    name: 'Lead No Booking 24h',
    channel: 'email',
    delay_minutes: AUTOMATION_TIMING.oneDayInMinutes,
    template_key: AUTOMATION_RULE_KEYS.leadNoBooking24h,
  },
  {
    key: AUTOMATION_RULE_KEYS.bookingConfirmation,
    name: 'Booking Confirmation',
    channel: 'email',
    delay_minutes: 0,
    template_key: AUTOMATION_RULE_KEYS.bookingConfirmation,
  },
  {
    key: AUTOMATION_RULE_KEYS.bookingReminder24h,
    name: 'Booking Reminder 24h',
    channel: 'email',
    delay_minutes: 0,
    template_key: AUTOMATION_RULE_KEYS.bookingReminder24h,
  },
  {
    key: AUTOMATION_RULE_KEYS.bookingReminder1h,
    name: 'Booking Reminder 1h',
    channel: 'email',
    delay_minutes: 0,
    template_key: AUTOMATION_RULE_KEYS.bookingReminder1h,
  },
  {
    key: AUTOMATION_RULE_KEYS.internalBookingNotification,
    name: 'Internal Booking Notification',
    channel: 'email',
    delay_minutes: 0,
    template_key: AUTOMATION_RULE_KEYS.internalBookingNotification,
  },
  {
    key: AUTOMATION_RULE_KEYS.internalBookingReminder24h,
    name: 'Internal Booking Reminder 24h',
    channel: 'email',
    delay_minutes: 0,
    template_key: AUTOMATION_RULE_KEYS.internalBookingReminder24h,
  },
  {
    key: AUTOMATION_RULE_KEYS.internalBookingReminder1h,
    name: 'Internal Booking Reminder 1h',
    channel: 'email',
    delay_minutes: 0,
    template_key: AUTOMATION_RULE_KEYS.internalBookingReminder1h,
  },
] as const

function getBookingUrl() {
  const websiteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  return websiteUrl ? `${websiteUrl.replace(/\/$/, '')}/${AUTOMATION_URLS.leadBookingPath}` : ''
}

function scheduleAtFromNow(minutes: number) {
  return new Date(Date.now() + minutes * 60_000).toISOString()
}

function scheduleAtFromBooking(date: string, time: string, offsetMinutes: number) {
  const scheduled = new Date(`${date}T${time}`)
  scheduled.setMinutes(scheduled.getMinutes() - offsetMinutes)

  const minimumTime = Date.now() + AUTOMATION_TIMING.oneMinute * 60_000
  if (scheduled.getTime() < minimumTime) {
    return new Date(minimumTime).toISOString()
  }

  return scheduled.toISOString()
}

function buildLeadAutomationJobs(input: LeadAutomationInput) {
  const bookingUrl = getBookingUrl()

  return [
    {
      rule_key: AUTOMATION_RULE_KEYS.leadInstantReply,
      contact_id: input.contactId,
      lead_id: input.leadId,
      status: AUTOMATION_STATUSES.pending,
      scheduled_for: scheduleAtFromNow(AUTOMATION_TIMING.oneMinute),
      dedupe_key: `${AUTOMATION_RULE_KEYS.leadInstantReply}:lead:${input.leadId}`,
      payload: {
        name: input.name,
        email: input.email,
        businessType: input.businessType,
        bookingUrl,
      },
    },
    {
      rule_key: AUTOMATION_RULE_KEYS.leadNoBooking24h,
      contact_id: input.contactId,
      lead_id: input.leadId,
      status: AUTOMATION_STATUSES.pending,
      scheduled_for: scheduleAtFromNow(AUTOMATION_TIMING.oneDayInMinutes),
      dedupe_key: `${AUTOMATION_RULE_KEYS.leadNoBooking24h}:lead:${input.leadId}`,
      payload: {
        name: input.name,
        email: input.email,
        businessType: input.businessType,
        bookingUrl,
      },
    },
  ]
}

function buildBookingAutomationJobs(input: BookingAutomationInput) {
  return [
    {
      rule_key: AUTOMATION_RULE_KEYS.bookingConfirmation,
      contact_id: input.contactId,
      lead_id: input.leadId ?? null,
      booking_id: input.bookingId,
      status: AUTOMATION_STATUSES.pending,
      scheduled_for: scheduleAtFromNow(AUTOMATION_TIMING.oneMinute),
      dedupe_key: `${AUTOMATION_RULE_KEYS.bookingConfirmation}:booking:${input.bookingId}`,
      payload: {
        name: input.name,
        email: input.email,
        slotDate: input.slotDate,
        startTime: input.startTime,
        endTime: input.endTime,
      },
    },
    {
      rule_key: AUTOMATION_RULE_KEYS.bookingReminder24h,
      contact_id: input.contactId,
      lead_id: input.leadId ?? null,
      booking_id: input.bookingId,
      status: AUTOMATION_STATUSES.pending,
      scheduled_for: scheduleAtFromBooking(
        input.slotDate,
        input.startTime,
        AUTOMATION_TIMING.oneDayInMinutes
      ),
      dedupe_key: `${AUTOMATION_RULE_KEYS.bookingReminder24h}:booking:${input.bookingId}`,
      payload: {
        name: input.name,
        email: input.email,
        slotDate: input.slotDate,
        startTime: input.startTime,
        endTime: input.endTime,
      },
    },
    {
      rule_key: AUTOMATION_RULE_KEYS.bookingReminder1h,
      contact_id: input.contactId,
      lead_id: input.leadId ?? null,
      booking_id: input.bookingId,
      status: AUTOMATION_STATUSES.pending,
      scheduled_for: scheduleAtFromBooking(
        input.slotDate,
        input.startTime,
        AUTOMATION_TIMING.oneHourInMinutes
      ),
      dedupe_key: `${AUTOMATION_RULE_KEYS.bookingReminder1h}:booking:${input.bookingId}`,
      payload: {
        name: input.name,
        email: input.email,
        slotDate: input.slotDate,
        startTime: input.startTime,
        endTime: input.endTime,
      },
    },
    {
      rule_key: AUTOMATION_RULE_KEYS.internalBookingNotification,
      contact_id: input.contactId,
      lead_id: input.leadId ?? null,
      booking_id: input.bookingId,
      status: AUTOMATION_STATUSES.pending,
      scheduled_for: scheduleAtFromNow(AUTOMATION_TIMING.oneMinute),
      dedupe_key: `${AUTOMATION_RULE_KEYS.internalBookingNotification}:booking:${input.bookingId}`,
      payload: {
        name: input.name,
        email: input.email,
        slotDate: input.slotDate,
        startTime: input.startTime,
        endTime: input.endTime,
      },
    },
    {
      rule_key: AUTOMATION_RULE_KEYS.internalBookingReminder24h,
      contact_id: input.contactId,
      lead_id: input.leadId ?? null,
      booking_id: input.bookingId,
      status: AUTOMATION_STATUSES.pending,
      scheduled_for: scheduleAtFromBooking(
        input.slotDate,
        input.startTime,
        AUTOMATION_TIMING.oneDayInMinutes
      ),
      dedupe_key: `${AUTOMATION_RULE_KEYS.internalBookingReminder24h}:booking:${input.bookingId}`,
      payload: {
        name: input.name,
        email: input.email,
        slotDate: input.slotDate,
        startTime: input.startTime,
        endTime: input.endTime,
      },
    },
    {
      rule_key: AUTOMATION_RULE_KEYS.internalBookingReminder1h,
      contact_id: input.contactId,
      lead_id: input.leadId ?? null,
      booking_id: input.bookingId,
      status: AUTOMATION_STATUSES.pending,
      scheduled_for: scheduleAtFromBooking(
        input.slotDate,
        input.startTime,
        AUTOMATION_TIMING.oneHourInMinutes
      ),
      dedupe_key: `${AUTOMATION_RULE_KEYS.internalBookingReminder1h}:booking:${input.bookingId}`,
      payload: {
        name: input.name,
        email: input.email,
        slotDate: input.slotDate,
        startTime: input.startTime,
        endTime: input.endTime,
      },
    },
  ]
}

export async function ensureAutomationRules() {
  const supabase = getAdminSupabaseClient()
  const { error } = await supabase.from('automation_rules').upsert(AUTOMATION_RULES, {
    onConflict: 'key',
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function upsertLeadAutomationJobs(input: LeadAutomationInput) {
  const supabase = getAdminSupabaseClient()
  const { error } = await supabase.from('automation_jobs').upsert(buildLeadAutomationJobs(input), {
    onConflict: 'dedupe_key',
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function cancelPendingNoBookingJobs(contactId: string | number) {
  const supabase = getAdminSupabaseClient()
  const { error } = await supabase
    .from('automation_jobs')
    .update({
      status: AUTOMATION_STATUSES.cancelled,
      cancelled_at: new Date().toISOString(),
      last_error: null,
    })
    .eq('contact_id', contactId)
    .eq('status', AUTOMATION_STATUSES.pending)
    .eq('rule_key', AUTOMATION_RULE_KEYS.leadNoBooking24h)

  if (error) {
    throw new Error(error.message)
  }
}

export async function upsertBookingAutomationJobs(input: BookingAutomationInput) {
  const supabase = getAdminSupabaseClient()
  const { error } = await supabase.from('automation_jobs').upsert(buildBookingAutomationJobs(input), {
    onConflict: 'dedupe_key',
  })

  if (error) {
    throw new Error(error.message)
  }
}
