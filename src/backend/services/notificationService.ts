import { getInternalRecipientEmail, sendMail } from '@/backend/infrastructure/mail/mailTransport'
import type { LeadPriority } from '@/backend/models/contact'

type LeadNotificationInput = {
  name: string
  email: string
  message: string
  businessType: string
  inquiriesPerWeek: string
  challenge: string
  submittedAt: string
  leadScore: number
  priority: LeadPriority
}

const BRAND_NAME = 'PYOW.DIGITALS'
const WEBSITE_DOMAIN = 'pyowdigitals.com'
const FALLBACK_INITIALS = 'NL'
const HIGH_PRIORITY_CLASS = 'priority-high'
const MEDIUM_PRIORITY_CLASS = 'priority-med'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function getInitials(name: string) {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || FALLBACK_INITIALS
  )
}

function getPriorityClass(priority: LeadPriority) {
  return priority === 'High' ? HIGH_PRIORITY_CLASS : MEDIUM_PRIORITY_CLASS
}

function getLeadNotificationSubject(name: string) {
  return `Alert: New Leads... Take Action !! [${name}]`
}

function buildLeadNotificationText(input: LeadNotificationInput) {
  return [
    'Alert: New Leads... Take Action !!',
    '',
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    '',
    'Message:',
    input.message,
  ].join('\n')
}

function buildLeadNotificationStyles(leadScore: number) {
  return `
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; background-color: #0d0d14; }
    .email-wrapper { background-color: #0d0d14; padding: 18px 8px; font-family: Helvetica, Arial, sans-serif; }
    .email-card { width: 100%; max-width: 1120px; margin: 0 auto; background: #13131e; border-radius: 18px; overflow: hidden; border: 1px solid rgba(255,255,255,0.07); box-sizing: border-box; }
    .header { background: linear-gradient(135deg, #0d1f18 0%, #0f1a2a 100%); padding: 40px 46px 36px; border-bottom: 1px solid rgba(255,255,255,0.07); }
    .header-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
    .logo-text { font-size: 14px; font-weight: 800; color: #f0f0f5; letter-spacing: -0.3px; }
    .logo-dot { color: #00e5a0; }
    .live-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,229,160,0.12); border: 1px solid rgba(0,229,160,0.25); color: #00e5a0; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: #00e5a0; display: inline-block; }
    .alert-tag { display: inline-block; margin-bottom: 8px; padding: 5px 10px; border-radius: 6px; background: rgba(123,92,255,0.14); border: 1px solid rgba(123,92,255,0.35); color: #c7bcff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; }
    .header-title { font-size: 22px; font-weight: 800; color: #f0f0f5; margin: 0 0 6px 0; letter-spacing: -0.5px; }
    .header-sub { font-size: 13px; color: #7a7a95; margin: 0; }
    .header-sub span { color: #00e5a0; }
    .score-banner { background: rgba(0,229,160,0.07); border: 1px solid rgba(0,229,160,0.15); border-radius: 12px; padding: 18px 22px; margin-top: 22px; }
    .score-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #7a7a95; margin-bottom: 4px; }
    .score-val { font-size: 20px; font-weight: 800; color: #00e5a0; }
    .score-bar-track { height: 6px; background: rgba(255,255,255,0.07); border-radius: 3px; overflow: hidden; margin-top: 6px; }
    .score-bar-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #00e5a0, #7b5cff); width: ${leadScore}%; }
    .priority-pill { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 10px; }
    .priority-high { background: rgba(0,229,160,0.12); color: #00e5a0; border: 1px solid rgba(0,229,160,0.25); }
    .priority-med { background: rgba(251,191,36,0.12); color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); }
    .body { padding: 36px 46px; }
    .section-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #4a4a64; margin-bottom: 12px; }
    .contact-row { display: flex; gap: 12px; margin-bottom: 20px; }
    .contact-avatar { width: 46px; height: 46px; border-radius: 12px; background: linear-gradient(135deg, #7b5cff, #00e5a0); color: white; text-align: center; font-size: 16px; font-weight: 800; line-height: 46px; flex-shrink: 0; }
    .contact-name { font-size: 16px; font-weight: 700; color: #f0f0f5; margin: 0 0 4px; }
    .contact-email { font-size: 13px; color: #00e5a0; text-decoration: none; }
    .fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .field-box { background: #0d0d14; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 14px 16px; }
    .field-box.full { grid-column: span 2; }
    .field-key { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #4a4a64; margin-bottom: 6px; }
    .field-val { font-size: 14px; font-weight: 600; color: #c8c8d8; line-height: 1.4; }
    .field-val.highlight { color: #00e5a0; }
    .challenge-block { background: #0d0d14; border: 1px solid rgba(255,255,255,0.06); border-left: 3px solid #7b5cff; border-radius: 0 10px 10px 0; padding: 16px 18px; margin: 20px 0; }
    .challenge-text { font-size: 13px; font-weight: 400; color: #9494ac; line-height: 1.65; white-space: pre-wrap; }
    .timestamp-strip { background: #0d0d14; border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 12px 16px; display: flex; justify-content: space-between; gap: 8px; }
    .ts-item { text-align: center; flex: 1; }
    .ts-val { font-size: 12px; font-weight: 600; color: #c8c8d8; }
    .ts-label { font-size: 10px; color: #4a4a64; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
    .ts-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.06); }
    .footer { padding: 22px 46px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .footer-brand { font-size: 12px; font-weight: 700; color: #4a4a64; letter-spacing: -0.3px; }
    .footer-brand span { color: #00e5a0; }
    .footer-note { font-size: 11px; color: #333349; text-align: right; }
  </style>`
}

function buildLeadNotificationHeaderHtml(leadScore: number, priority: LeadPriority) {
  return `
    <div class="header">
      <div class="header-top">
        <span class="logo-text">${BRAND_NAME.replace('.', '<span class="logo-dot">.</span>')}</span>
        <span class="live-badge"><span class="live-dot"></span> New Lead</span>
      </div>
      <span class="alert-tag">Alert: New Leads... Take Action !!</span>
      <p class="header-title">New Audit Request</p>
      <p class="header-sub">Submitted via <span>${WEBSITE_DOMAIN}</span></p>
      <div class="score-banner">
        <div class="score-label">Lead Score</div>
        <div class="score-val">${leadScore}<span style="font-size:13px;color:#4a4a64;">/100</span></div>
        <div class="score-bar-track"><div class="score-bar-fill"></div></div>
        <span class="priority-pill ${getPriorityClass(priority)}">${priority}</span>
      </div>
    </div>`
}

function buildLeadNotificationBodyHtml(input: {
  safeName: string
  safeEmail: string
  safeMessage: string
  safeBusinessType: string
  safeInquiries: string
  safeChallenge: string
  safeSubmittedAt: string
}) {
  const initials = getInitials(input.safeName)

  return `
    <div class="body">
      <div class="section-label">Contact Details</div>
      <div class="contact-row">
        <div class="contact-avatar">${initials}</div>
        <div>
          <p class="contact-name">${input.safeName}</p>
          <a href="mailto:${input.safeEmail}" class="contact-email">${input.safeEmail}</a>
        </div>
      </div>
      <div class="section-label">Business Info</div>
      <div class="fields-grid">
        <div class="field-box">
          <div class="field-key">Business Type</div>
          <div class="field-val highlight">${input.safeBusinessType}</div>
        </div>
        <div class="field-box">
          <div class="field-key">Inquiries / Week</div>
          <div class="field-val highlight">${input.safeInquiries}</div>
        </div>
        <div class="field-box full">
          <div class="field-key">Original Message</div>
          <div class="field-val">${input.safeMessage.replace(/\n/g, '<br>')}</div>
        </div>
      </div>
      <div class="section-label" style="margin-top:20px;">Biggest Challenge</div>
      <div class="challenge-block">
        <div class="challenge-text">${input.safeChallenge.replace(/\n/g, '<br>')}</div>
      </div>
      <div class="timestamp-strip">
        <div class="ts-item">
          <div class="ts-val">${input.safeSubmittedAt}</div>
          <div class="ts-label">Submitted</div>
        </div>
        <div class="ts-divider"></div>
        <div class="ts-item">
          <div class="ts-val">${WEBSITE_DOMAIN}</div>
          <div class="ts-label">Source</div>
        </div>
        <div class="ts-divider"></div>
        <div class="ts-item">
          <div class="ts-val">Contact Form</div>
          <div class="ts-label">Channel</div>
        </div>
      </div>
    </div>`
}

function buildLeadNotificationFooterHtml() {
  return `
    <div class="footer">
      <span class="footer-brand">${BRAND_NAME.replace('.', '<span>.</span>')}</span>
      <span class="footer-note">Automated lead notification</span>
    </div>`
}

function buildLeadNotificationHtml(input: LeadNotificationInput) {
  const safeFields = {
    safeName: escapeHtml(input.name),
    safeEmail: escapeHtml(input.email),
    safeMessage: escapeHtml(input.message),
    safeBusinessType: escapeHtml(input.businessType),
    safeInquiries: escapeHtml(input.inquiriesPerWeek),
    safeChallenge: escapeHtml(input.challenge),
    safeSubmittedAt: escapeHtml(input.submittedAt),
  }

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${getLeadNotificationSubject(safeFields.safeName)}</title>
  ${buildLeadNotificationStyles(input.leadScore)}
</head>
<body>
<div class="email-wrapper">
  <div class="email-card">
    ${buildLeadNotificationHeaderHtml(input.leadScore, input.priority)}
    ${buildLeadNotificationBodyHtml(safeFields)}
    ${buildLeadNotificationFooterHtml()}
  </div>
</div>
</body>
</html>`
}

export async function sendInternalLeadNotification(input: LeadNotificationInput) {
  const recipientEmail = getInternalRecipientEmail()
  if (!recipientEmail) {
    return false
  }

  return sendMail({
    fromName: 'Pyow Digitals Website',
    to: recipientEmail,
    replyTo: input.email,
    subject: getLeadNotificationSubject(input.name),
    text: buildLeadNotificationText(input),
    html: buildLeadNotificationHtml(input),
  })
}
