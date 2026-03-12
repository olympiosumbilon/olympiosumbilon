import { calculateLeadScore, getLeadPriority } from '@/lib/crm/scoring'
import type {
  CrmActivity,
  CrmContact,
  CrmFormSubmission,
  CrmLead,
  CrmLeadListItem,
  CrmLeadProfile,
} from '@/lib/crm/types'
import { getSupabaseAdminClient, getSupabaseServerClient } from '@/lib/supabase/server'

const PAGE_SIZE = 12

const STAGE_ORDER = [
  'New Lead',
  'Qualified',
  'Discovery',
  'Proposal',
  'Closed Won',
  'Closed Lost',
] as const

function getClient() {
  return getSupabaseAdminClient() || getSupabaseServerClient()
}

function normalizeContact(contact: CrmContact | CrmContact[] | null | undefined) {
  if (!contact) return null
  return Array.isArray(contact) ? contact[0] || null : contact
}

function getContactId(contact: CrmContact | CrmContact[] | null | undefined) {
  const normalized = normalizeContact(contact)
  return normalized?.contact_id ?? normalized?.id ?? null
}

function getLeadId(lead: CrmLead) {
  return lead.lead_id ?? lead.id ?? null
}

async function fetchContactsByIds(contactIds: string[]) {
  const client = getClient()
  if (!client || !contactIds.length) return new Map<string, CrmContact>()

  const { data } = await client
    .from('contacts')
    .select('id, name, full_name, email, phone, company, service_interest, lead_source, created_at')
    .in('id', contactIds)

  const map = new Map<string, CrmContact>()
  ;((data as CrmContact[]) || []).forEach((contact) => {
    const key = String(contact.id ?? contact.contact_id ?? '')
    if (key) {
      map.set(key, contact)
    }
  })

  return map
}

function buildLeadListItem(
  lead: CrmLead,
  contactMap: Map<string, CrmContact>,
  submissionMap: Map<string, CrmFormSubmission | undefined>
): CrmLeadListItem {
  const contactId = String(lead.contact_id ?? getContactId(lead.contacts) ?? '')
  const contact = contactMap.get(contactId) || normalizeContact(lead.contacts)
  const submission = submissionMap.get(contactId)

  return {
    leadId: String(getLeadId(lead) ?? ''),
    contactId,
    name: contact?.full_name || contact?.name || 'Unnamed Contact',
    email: contact?.email || 'No email',
    company: contact?.company || 'No company yet',
    businessType:
      submission?.business_type || submission?.service_selected || 'Not specified',
    leadScore: lead.lead_score ?? 0,
    priority: lead.priority || 'Low',
    stage: lead.stage || 'New Lead',
    createdAt: lead.created_at || '',
  }
}

async function fetchLatestSubmissions(contactIds: string[]) {
  const client = getClient()
  if (!client || !contactIds.length) return new Map<string, CrmFormSubmission | undefined>()

  const { data } = await client
    .from('form_submissions')
    .select(
      'id, contact_id, form_name, business_type, service_selected, inquiries_per_week, message, submitted_at'
    )
    .in('contact_id', contactIds)
    .order('submitted_at', { ascending: false })

  const map = new Map<string, CrmFormSubmission | undefined>()
  ;((data as CrmFormSubmission[]) || []).forEach((entry) => {
    const key = String(entry.contact_id ?? '')
    if (key && !map.has(key)) {
      map.set(key, entry)
    }
  })

  return map
}

export async function fetchLeadsPage({
  page = 1,
  search = '',
  stage = '',
  priority = '',
}: {
  page?: number
  search?: string
  stage?: string
  priority?: string
}) {
  const client = getClient()
  if (!client) {
    return {
      rows: [] as CrmLeadListItem[],
      total: 0,
      page,
      pageSize: PAGE_SIZE,
      stageOptions: [...STAGE_ORDER],
      error: 'Supabase is not configured.',
    }
  }

  let query = client
    .from('leads')
    .select(
      `
        id,
        contact_id,
        stage,
        lead_score,
        priority,
        created_at
      `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })

  if (stage) {
    query = query.eq('stage', stage)
  }

  if (priority) {
    query = query.eq('priority', priority)
  }

  if (search) {
    const { data: matchedContacts, error: searchError } = await client
      .from('contacts')
      .select('id')
      .or(`name.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`)

    if (searchError) {
      return {
        rows: [] as CrmLeadListItem[],
        total: 0,
        page,
        pageSize: PAGE_SIZE,
        stageOptions: [...STAGE_ORDER],
        error: searchError.message,
      }
    }

    const matchedContactIds = ((matchedContacts as Array<{ id: string | number }>) || [])
      .map((contact) => String(contact.id))
      .filter(Boolean)

    if (!matchedContactIds.length) {
      return {
        rows: [] as CrmLeadListItem[],
        total: 0,
        page,
        pageSize: PAGE_SIZE,
        stageOptions: [...STAGE_ORDER],
        error: null,
      }
    }

    query = query.in('contact_id', matchedContactIds)
  }

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const { data, count, error } = await query.range(from, to)

  if (error) {
    return {
      rows: [] as CrmLeadListItem[],
      total: 0,
      page,
      pageSize: PAGE_SIZE,
      stageOptions: [...STAGE_ORDER],
      error: error.message,
    }
  }

  const leads = (data as CrmLead[]) || []
  const contactIds = leads
    .map((lead) => String(lead.contact_id || ''))
    .filter(Boolean)
  const [contactMap, submissionMap] = await Promise.all([
    fetchContactsByIds(contactIds),
    fetchLatestSubmissions(contactIds),
  ])

  return {
    rows: leads.map((lead) => buildLeadListItem(lead, contactMap, submissionMap)),
    total: count || 0,
    page,
    pageSize: PAGE_SIZE,
    stageOptions: [...STAGE_ORDER],
    error: null,
  }
}

export async function fetchLeadProfile(leadId: string) {
  const client = getClient()
  if (!client) {
    return { profile: null as CrmLeadProfile | null, error: 'Supabase is not configured.' }
  }

  const { data: leadData, error: leadError } = await client
    .from('leads')
    .select(
      `
        id,
        contact_id,
        pipeline,
        stage,
        lead_score,
        priority,
        created_at
      `
    )
    .eq('id', leadId)
    .single()

  if (leadError || !leadData) {
    return { profile: null as CrmLeadProfile | null, error: leadError?.message || 'Lead not found.' }
  }

  const lead = leadData as CrmLead
  const contactId = String(lead.contact_id ?? '')

  const [contactMap, submissionRes, activitiesRes] = await Promise.all([
    fetchContactsByIds(contactId ? [contactId] : []),
    client
      .from('form_submissions')
      .select(
        'id, contact_id, form_name, business_type, service_selected, inquiries_per_week, message, submitted_at'
      )
      .eq('contact_id', contactId)
      .order('submitted_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    client
      .from('activities')
      .select('id, contact_id, activity_date, type, outcome, notes')
      .eq('contact_id', contactId)
      .order('activity_date', { ascending: false }),
  ])

  const contact = contactMap.get(contactId) || null
  const latestSubmission = submissionRes.data as CrmFormSubmission | null
  const activities = (activitiesRes.data as CrmActivity[]) || []

  const submissionMap = new Map<string, CrmFormSubmission | undefined>()
  if (latestSubmission) {
    submissionMap.set(contactId, latestSubmission)
  }

  const profile: CrmLeadProfile = {
    lead: buildLeadListItem(lead, contactMap, submissionMap),
    inquiriesPerWeek: latestSubmission?.inquiries_per_week || 'Not specified',
    challengeMessage: latestSubmission?.message || 'No challenge message recorded yet.',
    serviceSelected:
      latestSubmission?.service_selected ||
      latestSubmission?.business_type ||
      contact?.service_interest ||
      'Lead System Audit',
    timeline: activities.map((activity) => ({
      id: String(activity.id || activity.activity_id || crypto.randomUUID()),
      type: activity.type || 'Activity',
      outcome: activity.outcome || 'Logged',
      notes: activity.notes || '',
      activityDate: activity.activity_date || '',
    })),
  }

  return { profile, error: null }
}

export async function fetchPipelineBoard() {
  const client = getClient()
  if (!client) {
    return { columns: STAGE_ORDER.map((stage) => ({ stage, leads: [] as CrmLeadListItem[] })), error: 'Supabase is not configured.' }
  }

  const { data, error } = await client
    .from('leads')
    .select(
      `
        id,
        contact_id,
        stage,
        lead_score,
        priority,
        created_at
      `
    )
    .order('created_at', { ascending: false })

  if (error) {
    return { columns: STAGE_ORDER.map((stage) => ({ stage, leads: [] as CrmLeadListItem[] })), error: error.message }
  }

  const leads = (data as CrmLead[]) || []
  const contactIds = leads
    .map((lead) => String(lead.contact_id || ''))
    .filter(Boolean)
  const [contactMap, submissionMap] = await Promise.all([
    fetchContactsByIds(contactIds),
    fetchLatestSubmissions(contactIds),
  ])
  const rows = leads.map((lead) => buildLeadListItem(lead, contactMap, submissionMap))

  return {
    columns: STAGE_ORDER.map((stage) => ({
      stage,
      leads: rows.filter((row) => row.stage === stage),
    })),
    error: null,
  }
}

export async function fetchDashboardOverview() {
  const client = getClient()
  if (!client) {
    return {
      stats: {
        totalLeads: 0,
        qualifiedLeads: 0,
        conversionRate: 0,
        averageLeadScore: 0,
      },
      leadsPerDay: [] as Array<{ date: string; count: number }>,
      leadsByBusinessType: [] as Array<{ label: string; count: number }>,
      pipelineDistribution: [] as Array<{ label: string; count: number }>,
      recentLeads: [] as CrmLeadListItem[],
      error: 'Supabase is not configured.',
    }
  }

  const [leadRes, submissionRes] = await Promise.all([
    client
      .from('leads')
      .select(
        `
          id,
          contact_id,
          stage,
          lead_score,
          priority,
          created_at
        `
      )
      .order('created_at', { ascending: false }),
    client
      .from('form_submissions')
      .select(
        'id, contact_id, form_name, business_type, service_selected, inquiries_per_week, message, submitted_at'
      )
      .order('submitted_at', { ascending: false }),
  ])

  if (leadRes.error || submissionRes.error) {
    return {
      stats: {
        totalLeads: 0,
        qualifiedLeads: 0,
        conversionRate: 0,
        averageLeadScore: 0,
      },
      leadsPerDay: [] as Array<{ date: string; count: number }>,
      leadsByBusinessType: [] as Array<{ label: string; count: number }>,
      pipelineDistribution: [] as Array<{ label: string; count: number }>,
      recentLeads: [] as CrmLeadListItem[],
      error: leadRes.error?.message || submissionRes.error?.message || 'Failed to load CRM data.',
    }
  }

  const leads = (leadRes.data as CrmLead[]) || []
  const submissions = (submissionRes.data as CrmFormSubmission[]) || []
  const contactIds = leads
    .map((lead) => String(lead.contact_id || ''))
    .filter(Boolean)
  const contactMap = await fetchContactsByIds(contactIds)
  const submissionMap = new Map<string, CrmFormSubmission | undefined>()
  submissions.forEach((entry) => {
    const key = String(entry.contact_id ?? '')
    if (key && !submissionMap.has(key)) {
      submissionMap.set(key, entry)
    }
  })

  const rows = leads.map((lead) => buildLeadListItem(lead, contactMap, submissionMap))
  const qualifiedLeads = rows.filter((row) =>
    ['Qualified', 'Discovery', 'Proposal', 'Closed Won'].includes(row.stage)
  ).length
  const closedWon = rows.filter((row) => row.stage === 'Closed Won').length
  const averageLeadScore = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + row.leadScore, 0) / rows.length)
    : 0

  const perDay = rows.reduce<Record<string, number>>((acc, row) => {
    const date = row.createdAt ? row.createdAt.slice(0, 10) : 'Unknown'
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const byBusinessType = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.businessType] = (acc[row.businessType] || 0) + 1
    return acc
  }, {})

  const byStage = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.stage] = (acc[row.stage] || 0) + 1
    return acc
  }, {})

  return {
    stats: {
      totalLeads: rows.length,
      qualifiedLeads,
      conversionRate: rows.length ? Math.round((closedWon / rows.length) * 100) : 0,
      averageLeadScore,
    },
    leadsPerDay: Object.entries(perDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7),
    leadsByBusinessType: Object.entries(byBusinessType)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6),
    pipelineDistribution: STAGE_ORDER.map((label) => ({
      label,
      count: byStage[label] || 0,
    })),
    recentLeads: rows.slice(0, 8),
    error: null,
  }
}

export async function updateLeadStage({
  leadId,
  newStage,
  type = 'Stage Change',
  notes,
}: {
  leadId: string
  newStage: string
  type?: string
  notes?: string
}) {
  const client = getClient()
  if (!client) {
    throw new Error('Supabase is not configured.')
  }

  const { data: updatedLead, error: updateError } = await client
    .from('leads')
    .update({ stage: newStage })
    .eq('id', leadId)
    .select('id, contact_id, stage')
    .single()

  if (updateError || !updatedLead) {
    throw new Error(updateError?.message || 'Failed to update lead stage.')
  }

  const { error: activityError } = await client.from('activities').insert({
    contact_id: updatedLead.contact_id,
    type,
    outcome: newStage,
    notes: notes || `Lead moved to ${newStage} stage`,
    activity_date: new Date().toISOString(),
  })

  if (activityError) {
    throw new Error(activityError.message)
  }

  return updatedLead
}

export async function performLeadAction({
  leadId,
  action,
}: {
  leadId: string
  action: 'mark-qualified' | 'schedule-call' | 'send-proposal' | 'close-deal'
}) {
  const actionMap = {
    'mark-qualified': {
      stage: 'Qualified',
      type: 'Stage Change',
      notes: 'Lead moved to Qualified stage',
    },
    'schedule-call': {
      stage: 'Discovery',
      type: 'Call Scheduled',
      notes: 'Discovery call scheduled for lead',
    },
    'send-proposal': {
      stage: 'Proposal',
      type: 'Proposal Sent',
      notes: 'Proposal sent to lead',
    },
    'close-deal': {
      stage: 'Closed Won',
      type: 'Deal Closed',
      notes: 'Lead marked as closed won',
    },
  } as const

  const config = actionMap[action]
  return updateLeadStage({
    leadId,
    newStage: config.stage,
    type: config.type,
    notes: config.notes,
  })
}

export async function createLeadRecordsFromSubmission(input: {
  firstName: string
  lastName: string
  name: string
  email: string
  businessType: string
  inquiriesPerWeek: string
  challenge: string
  source: string
  submittedAt: string
}) {
  const client = getClient()
  if (!client) return null

  const score = calculateLeadScore({
    inquiriesPerWeek: input.inquiriesPerWeek,
    businessType: input.businessType,
    challenge: input.challenge,
  })
  const priority = getLeadPriority(score)

  const { data: contact, error: contactError } = await client
    .from('contacts')
    .upsert(
      {
        name: input.name,
        full_name: input.name,
        email: input.email,
        service_interest: input.businessType,
        lead_source: input.source,
      },
      {
        onConflict: 'email',
      }
    )
    .select('id, name, full_name, email')
    .single()

  if (contactError || !contact) {
    throw new Error(contactError?.message || 'Failed to create contact record.')
  }

  const contactId = contact.id

  const { error: leadError } = await client.from('leads').insert({
    contact_id: contactId,
    pipeline: 'Agency Sales',
    stage: 'New Lead',
    lead_score: score,
    priority,
    created_at: new Date().toISOString(),
  })

  if (leadError) {
    throw new Error(leadError.message)
  }

  const { error: submissionError } = await client.from('form_submissions').insert({
    contact_id: contactId,
    form_name: 'Website Inquiry',
    business_type: input.businessType,
    inquiries_per_week: input.inquiriesPerWeek,
    message: input.challenge,
    submitted_at: new Date().toISOString(),
  })

  if (submissionError) {
    throw new Error(submissionError.message)
  }

  const { error: activityError } = await client.from('activities').insert({
    contact_id: contactId,
    type: 'Form Submission',
    outcome: 'New Lead',
    notes: 'Lead created from website inquiry form',
    activity_date: new Date().toISOString(),
  })

  if (activityError) {
    throw new Error(activityError.message)
  }

  return {
    contactId: String(contactId),
    score,
    priority,
  }
}

export { PAGE_SIZE, STAGE_ORDER }
