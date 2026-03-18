export const CONTACT_DEFAULTS = {
  businessType: 'Not specified',
  inquiryVolume: 'Not specified',
  source: 'website-contact-form',
  serviceInterest: 'Lead System Audit',
  leadSource: 'Website',
  submissionFormName: 'Website Inquiry',
  activityType: 'Form Submission',
  activityOutcome: 'New Inquiry',
  activityNotes: 'Website contact form submitted',
  submittedAtLocale: 'en-PH',
} as const

export const CONTACT_FORM_LIMITS = {
  maxBodySize: 10_000,
  maxFieldLength: 1_000,
  maxMessageLength: 2_500,
  minChallengeLength: 10,
  rateLimitWindowMs: 10 * 60 * 1000,
  rateLimitMaxRequests: 5,
} as const

export const CONTACT_FIELD_LENGTHS = {
  firstName: 80,
  lastName: 80,
  fullName: 160,
  email: 160,
  businessType: 120,
  inquiryVolume: 120,
  challenge: 2_000,
  source: 120,
} as const

export const LEAD_SCORE_RULES = {
  baseScore: 40,
  maxScore: 100,
  longChallengeLength: 80,
  mediumChallengeLength: 30,
  businessTypeBonus: 10,
  longChallengeBonus: 12,
  mediumChallengeBonus: 6,
  highPriorityThreshold: 80,
  mediumPriorityThreshold: 55,
} as const

export const LEAD_VOLUME_SCORES: Record<string, number> = {
  '60+': 30,
  '30-60': 22,
  '10-30': 14,
  'Less than 10': 6,
}

export const CONTACT_PIPELINE = {
  defaultPipeline: 'Agency Sales',
  defaultStage: 'New Lead',
} as const
