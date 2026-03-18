import {
  CONTACT_FIELD_LENGTHS,
  CONTACT_FORM_LIMITS,
  CONTACT_DEFAULTS,
  LEAD_SCORE_RULES,
  LEAD_VOLUME_SCORES,
} from '@/backend/constants/contact'
import type { ContactPayload, LeadPriority, NormalizedContactPayload } from '@/backend/models/contact'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function trimToLength(value: string, maxLength: number = CONTACT_FORM_LIMITS.maxFieldLength) {
  return value.trim().slice(0, maxLength)
}

export function normalizeContactPayload(payload: ContactPayload): NormalizedContactPayload {
  const firstName = trimToLength(payload.firstName || '', CONTACT_FIELD_LENGTHS.firstName)
  const lastName = trimToLength(payload.lastName || '', CONTACT_FIELD_LENGTHS.lastName)
  const name = trimToLength(payload.name || `${firstName} ${lastName}`.trim(), CONTACT_FIELD_LENGTHS.fullName)
  const email = trimToLength(payload.email || '', CONTACT_FIELD_LENGTHS.email).toLowerCase()
  const businessType = trimToLength(
    payload.businessType || CONTACT_DEFAULTS.businessType,
    CONTACT_FIELD_LENGTHS.businessType
  )
  const inquiriesPerWeek = trimToLength(
    payload.inquiriesPerWeek || CONTACT_DEFAULTS.inquiryVolume,
    CONTACT_FIELD_LENGTHS.inquiryVolume
  )
  const challenge = trimToLength(
    payload.challenge || CONTACT_DEFAULTS.businessType,
    CONTACT_FIELD_LENGTHS.challenge
  )
  const source = trimToLength(payload.source || CONTACT_DEFAULTS.source, CONTACT_FIELD_LENGTHS.source)
  const message =
    trimToLength(payload.message || '', CONTACT_FORM_LIMITS.maxMessageLength) ||
    `Business Type: ${businessType}\nInquiries Per Week: ${inquiriesPerWeek}\n\nBiggest Challenge:\n${challenge}`

  return {
    firstName,
    lastName,
    name,
    email,
    businessType,
    inquiriesPerWeek,
    challenge,
    source,
    message,
    turnstileToken: payload.turnstileToken?.trim() || '',
  }
}

export function getContactPayloadError(payload: ContactPayload, normalized: NormalizedContactPayload) {
  if (payload.website?.trim()) {
    return 'Submission blocked.'
  }

  if (!normalized.name || !normalized.email || !normalized.challenge) {
    return 'Missing required fields.'
  }

  if (!EMAIL_PATTERN.test(normalized.email)) {
    return 'Please enter a valid email address.'
  }

  if (normalized.challenge.length < CONTACT_FORM_LIMITS.minChallengeLength) {
    return 'Please provide a bit more detail about your challenge.'
  }

  return null
}

export function calculateLeadScore(input: {
  inquiriesPerWeek: string
  businessType: string
  challenge: string
}) {
  let score = LEAD_SCORE_RULES.baseScore
  score += LEAD_VOLUME_SCORES[input.inquiriesPerWeek] || 0

  if (input.businessType !== CONTACT_DEFAULTS.businessType) {
    score += LEAD_SCORE_RULES.businessTypeBonus
  }

  const challengeLength = input.challenge.trim().length
  if (challengeLength >= LEAD_SCORE_RULES.longChallengeLength) {
    score += LEAD_SCORE_RULES.longChallengeBonus
  } else if (challengeLength >= LEAD_SCORE_RULES.mediumChallengeLength) {
    score += LEAD_SCORE_RULES.mediumChallengeBonus
  }

  return Math.min(score, LEAD_SCORE_RULES.maxScore)
}

export function getLeadPriority(score: number): LeadPriority {
  if (score >= LEAD_SCORE_RULES.highPriorityThreshold) return 'High'
  if (score >= LEAD_SCORE_RULES.mediumPriorityThreshold) return 'Medium'
  return 'Low'
}
