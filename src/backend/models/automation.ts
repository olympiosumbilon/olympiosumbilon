export type LeadAutomationInput = {
  contactId: string | number
  leadId: string | number
  name: string
  email: string
  businessType: string
}

export type BookingAutomationInput = {
  contactId: string | number
  leadId?: string | number | null
  bookingId: string | number
  name: string
  email: string
  slotDate: string
  startTime: string
  endTime: string
}
