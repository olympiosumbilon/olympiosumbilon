export const AUTOMATION_STATUSES = {
  pending: 'pending',
  cancelled: 'cancelled',
} as const

export const AUTOMATION_RULE_KEYS = {
  leadInstantReply: 'lead_instant_reply',
  leadNoBooking24h: 'lead_no_booking_24h',
  bookingConfirmation: 'booking_confirmation',
  bookingReminder24h: 'booking_reminder_24h',
  bookingReminder1h: 'booking_reminder_1h',
} as const

export const AUTOMATION_TIMING = {
  oneMinute: 1,
  oneHourInMinutes: 60,
  oneDayInMinutes: 24 * 60,
} as const

export const AUTOMATION_URLS = {
  leadBookingPath: '#contact',
} as const
