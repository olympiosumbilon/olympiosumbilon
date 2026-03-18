import type { BookingAutomationInput, LeadAutomationInput } from '@/backend/models/automation'
import {
  cancelPendingNoBookingJobs,
  ensureAutomationRules,
  upsertBookingAutomationJobs,
  upsertLeadAutomationJobs,
} from '@/backend/repositories/automationRepository'

export async function scheduleLeadAutomationJobs(input: LeadAutomationInput) {
  await ensureAutomationRules()
  await upsertLeadAutomationJobs(input)
}

export async function scheduleBookingAutomationJobs(input: BookingAutomationInput) {
  await ensureAutomationRules()
  await cancelPendingNoBookingJobs(input.contactId)
  await upsertBookingAutomationJobs(input)
}
