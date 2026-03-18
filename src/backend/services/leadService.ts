import { CONTACT_DEFAULTS } from '@/backend/constants/contact'
import type { LeadPriority, NormalizedContactPayload } from '@/backend/models/contact'
import { scheduleLeadAutomationJobs } from '@/backend/services/automationService'
import {
  calculateLeadScore,
  getLeadPriority,
} from '@/backend/services/contactValidationService'
import { sendInternalLeadNotification } from '@/backend/services/notificationService'
import { insertSubmissionActivity } from '@/backend/repositories/activityRepository'
import { upsertContact } from '@/backend/repositories/contactRepository'
import { insertLead } from '@/backend/repositories/leadRepository'
import { insertFormSubmission } from '@/backend/repositories/submissionRepository'

function getSubmittedAtText() {
  return new Date().toLocaleString(CONTACT_DEFAULTS.submittedAtLocale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

async function scheduleLeadJobs(input: {
  contactId: number | string
  leadId: number | string
  payload: NormalizedContactPayload
}) {
  try {
    await scheduleLeadAutomationJobs({
      contactId: input.contactId,
      leadId: input.leadId,
      name: input.payload.name,
      email: input.payload.email,
      businessType: input.payload.businessType,
    })
  } catch (error) {
    console.error('Lead automation scheduling failed:', error)
  }
}

async function sendLeadNotification(input: {
  payload: NormalizedContactPayload
  submittedAt: string
  leadScore: number
  priority: LeadPriority
}) {
  try {
    await sendInternalLeadNotification({
      name: input.payload.name,
      email: input.payload.email,
      message: input.payload.message,
      businessType: input.payload.businessType,
      inquiriesPerWeek: input.payload.inquiriesPerWeek,
      challenge: input.payload.challenge,
      submittedAt: input.submittedAt,
      leadScore: input.leadScore,
      priority: input.priority,
    })
  } catch (error) {
    console.error('Lead email notification failed:', error)
  }
}

export async function captureLeadFromWebsite(payload: NormalizedContactPayload) {
  const submittedAt = getSubmittedAtText()
  const leadScore = calculateLeadScore({
    inquiriesPerWeek: payload.inquiriesPerWeek,
    businessType: payload.businessType,
    challenge: payload.challenge,
  })
  const priority = getLeadPriority(leadScore)

  const contact = await upsertContact(payload.name, payload.email)
  const lead = await insertLead(contact.id, leadScore, priority)

  await insertFormSubmission(contact.id, payload)
  await insertSubmissionActivity(contact.id)
  await scheduleLeadJobs({ contactId: contact.id, leadId: lead.id, payload })
  await sendLeadNotification({ payload, submittedAt, leadScore, priority })

  return {
    contactId: contact.id,
    leadId: lead.id,
    submittedAt,
    leadScore,
    priority,
  }
}
