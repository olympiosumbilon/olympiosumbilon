type LeadScoreInput = {
  inquiriesPerWeek?: string | number | null
  businessType?: string | null
  challenge?: string | null
}

function parseInquiriesPerWeek(value?: string | number | null) {
  if (typeof value === 'number') return value
  if (!value) return 0

  if (value.includes('60+')) return 60
  if (value.includes('50')) return 50
  if (value.includes('30-60')) return 45
  if (value.includes('10-30')) return 20
  if (value.includes('Less than 10')) return 5

  const firstNumber = Number.parseInt(value, 10)
  return Number.isNaN(firstNumber) ? 0 : firstNumber
}

export function calculateLeadScore(input: LeadScoreInput) {
  let score = 30

  const inquiries = parseInquiriesPerWeek(input.inquiriesPerWeek)
  const businessType = input.businessType?.toLowerCase() || ''
  const challenge = input.challenge?.toLowerCase() || ''

  if (inquiries > 50) score += 20
  else if (inquiries >= 30) score += 12
  else if (inquiries >= 10) score += 8

  if (businessType.includes('clinic')) score += 10
  if (challenge.includes('automation')) score += 15
  if (challenge.includes('follow-up') || challenge.includes('follow up')) score += 8
  if (challenge.includes('booking')) score += 5

  return Math.min(score, 100)
}

export function getLeadPriority(score: number) {
  if (score >= 80) return 'High'
  if (score >= 60) return 'Medium'
  return 'Low'
}
