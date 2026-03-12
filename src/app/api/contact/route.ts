import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createLeadRecordsFromSubmission } from '@/lib/crm/store'
import { notifyNewLead } from '@/lib/crm/notifications'
import { calculateLeadScore, getLeadPriority } from '@/lib/crm/scoring'

type ContactPayload = {
  firstName?: string
  lastName?: string
  name?: string
  email?: string
  businessType?: string
  inquiriesPerWeek?: string
  challenge?: string
  source?: string
  message?: string
}

const DEFAULT_N8N_WEBHOOK_URL =
 // 'https://n8n-test.hyperaccess.net/webhook-test/7faa6f9d-5ce9-4462-aab2-d9c1070f5ba4'
  'https://n8n-test.hyperaccess.net/webhook/7faa6f9d-5ce9-4462-aab2-d9c1070f5ba4'

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

async function sendLeadToN8n(payload: {
  firstName: string
  lastName: string
  name: string
  email: string
  businessType: string
  inquiriesPerWeek: string
  challenge: string
  source: string
  message: string
  submittedAt: string
  leadScore: number
  priority: 'High' | 'Medium' | 'Low'
}) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL || DEFAULT_N8N_WEBHOOK_URL

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (!response.ok) {
    const details = await response.text().catch(() => '')
    throw new Error(`n8n webhook failed with status ${response.status}${details ? `: ${details}` : ''}`)
  }
}

async function sendLeadEmail(payload: {
  name: string
  email: string
  message: string
  businessType: string
  inquiriesPerWeek: string
  challenge: string
  submittedAt: string
  leadScore: number
  priority: 'High' | 'Medium' | 'Low'
}) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return
  }

  const recipientEmail = process.env.EMAIL_TO || 'olympiosumbilonpersonal@gmail.com'
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const safeName = escapeHtml(payload.name)
  const safeEmail = escapeHtml(payload.email)
  const safeMessage = escapeHtml(payload.message)
  const safeBusinessType = escapeHtml(payload.businessType)
  const safeInquiries = escapeHtml(payload.inquiriesPerWeek)
  const safeChallenge = escapeHtml(payload.challenge)
  const initials =
    safeName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || 'NL'

    const priorityClass = payload.priority === 'High' ? 'priority-high' : 'priority-med'

  await transporter.sendMail({
    from: `"Pyow Digitals Website" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    replyTo: payload.email,
    subject: `Alert: New Leads... Take Action !! [${payload.name}]`,
    text: `Alert: New Leads... Take Action !!\n\nName: ${payload.name}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}`,
    html: `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Alert: New Leads... Take Action !!</title>
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
    .score-bar-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #00e5a0, #7b5cff); width: ${payload.leadScore}%; }
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
    @media screen and (max-width: 720px) {
      .email-wrapper { padding: 8px 0; }
      .email-card { border-radius: 0; border-left: 0; border-right: 0; }
      .header { padding: 24px 18px 22px; }
      .body { padding: 22px 18px; }
      .header-top { display: block; }
      .live-badge { margin-top: 10px; }
      .header-title { font-size: 30px; line-height: 1.1; }
      .fields-grid { display: block; }
      .field-box { margin-bottom: 10px; }
      .field-box.full { grid-column: span 1; }
      .timestamp-strip { display: block; }
      .ts-item { text-align: left; padding: 6px 0; }
      .ts-divider { display: none; }
      .footer { display: block; padding: 16px 18px 20px; }
      .footer-note { text-align: left; margin-top: 6px; }
    }
  </style>
</head>
<body>
<div class="email-wrapper">
  <div class="email-card">
    <div class="header">
      <div class="header-top">
        <span class="logo-text">PYOW<span class="logo-dot">.</span>DIGITALS</span>
        <span class="live-badge"><span class="live-dot"></span> New Lead</span>
      </div>
      <span class="alert-tag">Alert: New Leads... Take Action !!</span>
      <p class="header-title">New Audit Request</p>
      <p class="header-sub">Submitted via <span>pyowdigitals.com</span></p>
      <div class="score-banner">
        <div class="score-label">Lead Score</div>
        <div class="score-val">${payload.leadScore}<span style="font-size:13px;color:#4a4a64;">/100</span></div>
        <div class="score-bar-track"><div class="score-bar-fill"></div></div>
        <span class="priority-pill ${priorityClass}">${payload.priority}</span>
      </div>
    </div>

    <div class="body">
      <div class="section-label">Contact Details</div>
      <div class="contact-row">
        <div class="contact-avatar">${initials}</div>
        <div>
          <p class="contact-name">${safeName}</p>
          <a href="mailto:${safeEmail}" class="contact-email">${safeEmail}</a>
        </div>
      </div>

      <div class="section-label">Business Info</div>
      <div class="fields-grid">
        <div class="field-box">
          <div class="field-key">Business Type</div>
          <div class="field-val highlight">${safeBusinessType}</div>
        </div>
        <div class="field-box">
          <div class="field-key">Inquiries / Week</div>
          <div class="field-val highlight">${safeInquiries}</div>
        </div>
        <div class="field-box full">
          <div class="field-key">Original Message</div>
          <div class="field-val">${safeMessage.replace(/\n/g, '<br>')}</div>
        </div>
      </div>

      <div class="section-label" style="margin-top:20px;">Biggest Challenge</div>
      <div class="challenge-block">
        <div class="challenge-text">${safeChallenge.replace(/\n/g, '<br>')}</div>
      </div>

      <div class="timestamp-strip">
        <div class="ts-item">
          <div class="ts-val">${escapeHtml(payload.submittedAt)}</div>
          <div class="ts-label">Submitted</div>
        </div>
        <div class="ts-divider"></div>
        <div class="ts-item">
          <div class="ts-val">pyowdigitals.com</div>
          <div class="ts-label">Source</div>
        </div>
        <div class="ts-divider"></div>
        <div class="ts-item">
          <div class="ts-val">Contact Form</div>
          <div class="ts-label">Channel</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <span class="footer-brand">PYOW<span>.</span>DIGITALS</span>
      <span class="footer-note">Automated lead notification</span>
    </div>
  </div>
</div>
</body>
</html>
    `,
  })
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload

    const firstName = body.firstName?.trim() || ''
    const lastName = body.lastName?.trim() || ''
    const name = body.name?.trim() || `${firstName} ${lastName}`.trim()
    const email = body.email?.trim() || ''
    const businessType = body.businessType?.trim() || 'Not specified'
    const inquiriesPerWeek = body.inquiriesPerWeek?.trim() || 'Not specified'
    const challenge = body.challenge?.trim() || 'Not specified'
    const source = body.source?.trim() || 'website-contact-form'
    const message =
      body.message?.trim() ||
      `Business Type: ${businessType}\nInquiries Per Week: ${inquiriesPerWeek}\n\nBiggest Challenge:\n${challenge}`

    if (!name || !email || !challenge) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 })
    }

    const submittedAt = new Date().toLocaleString('en-PH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
    const leadScore = calculateLeadScore({
      inquiriesPerWeek,
      businessType,
      challenge,
    })
    const priority = getLeadPriority(leadScore)

    await sendLeadToN8n({
      firstName,
      lastName,
      name,
      email,
      businessType,
      inquiriesPerWeek,
      challenge,
      source,
      message,
      submittedAt,
      leadScore,
      priority,
    })

    try {
      await createLeadRecordsFromSubmission({
        firstName,
        lastName,
        name,
        email,
        businessType,
        inquiriesPerWeek,
        challenge,
        source,
        submittedAt,
      })
    } catch (error) {
      console.error('Supabase CRM persistence failed:', error)
    }

    try {
      await sendLeadEmail({
        name,
        email,
        message,
        businessType,
        inquiriesPerWeek,
        challenge,
        submittedAt,
        leadScore,
        priority,
      })
    } catch (error) {
      console.error('Lead email notification failed:', error)
    }

    try {
      await notifyNewLead({
        name,
        email,
        businessType,
        score: leadScore,
      })
    } catch (error) {
      console.error('Lead notification failed:', error)
    }

    return NextResponse.json({ message: 'Lead captured successfully.' }, { status: 200 })
  } catch (error) {
    console.error('Error processing lead submission:', error)
    return NextResponse.json(
      {
        message: 'Failed to capture lead. Check the n8n webhook configuration and try again.',
      },
      { status: 500 }
    )
  }
}
