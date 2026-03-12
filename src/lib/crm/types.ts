export type CrmContact = {
  id?: string | number
  contact_id?: string | number
  name: string | null
  full_name?: string | null
  email: string | null
  phone?: string | null
  company?: string | null
  service_interest?: string | null
  lead_source?: string | null
  created_at?: string | null
}

export type CrmLead = {
  id?: string | number
  lead_id?: string | number
  contact_id: string | number | null
  pipeline?: string | null
  stage?: string | null
  lead_score?: number | null
  priority?: string | null
  created_at?: string | null
  contacts?: CrmContact | CrmContact[] | null
}

export type CrmFormSubmission = {
  id?: string | number | null
  form_id?: string | number | null
  contact_id: string | number | null
  form_name?: string | null
  business_type?: string | null
  service_selected?: string | null
  inquiries_per_week?: string | null
  message?: string | null
  submitted_at?: string | null
}

export type CrmActivity = {
  id?: string | number | null
  activity_id?: string | number | null
  contact_id: string | number | null
  type?: string | null
  activity_date?: string | null
  outcome?: string | null
  notes?: string | null
}

export type CrmLeadListItem = {
  leadId: string
  contactId: string
  name: string
  email: string
  company: string
  businessType: string
  leadScore: number
  priority: string
  stage: string
  createdAt: string
}

export type CrmLeadProfile = {
  lead: CrmLeadListItem
  inquiriesPerWeek: string
  challengeMessage: string
  serviceSelected: string
  timeline: Array<{
    id: string
    type: string
    outcome: string
    notes: string
    activityDate: string
  }>
}
