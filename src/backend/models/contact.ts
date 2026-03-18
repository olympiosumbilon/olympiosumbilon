export type ContactPayload = {
  firstName?: string
  lastName?: string
  name?: string
  email?: string
  businessType?: string
  inquiriesPerWeek?: string
  challenge?: string
  source?: string
  message?: string
  website?: string
  turnstileToken?: string
}

export type LeadPriority = 'High' | 'Medium' | 'Low'

export type NormalizedContactPayload = {
  firstName: string
  lastName: string
  name: string
  email: string
  businessType: string
  inquiriesPerWeek: string
  challenge: string
  source: string
  message: string
  turnstileToken: string
}
