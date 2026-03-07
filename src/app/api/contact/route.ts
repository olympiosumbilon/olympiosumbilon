import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  const recipientEmail = process.env.EMAIL_TO || 'olympiosumbilonpersonal@gmail.com'

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email configuration is missing: EMAIL_USER / EMAIL_PASS')
    return NextResponse.json(
      {
        message:
          'Server email is not configured yet. Add EMAIL_USER and EMAIL_PASS in .env.local, then restart the dev server.',
      },
      { status: 500 }
    )
  }

  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeMessage = escapeHtml(message)

    const businessType =
      message.match(/Business Type:\s*(.+)/i)?.[1]?.trim() || 'Not specified'
    const inquiriesPerWeek =
      message.match(/Inquiries Per Week:\s*(.+)/i)?.[1]?.trim() || 'Not specified'
    const challenge =
      message.match(/Biggest Challenge:\s*([\s\S]*)/i)?.[1]?.trim() || message

    const safeBusinessType = escapeHtml(businessType)
    const safeInquiries = escapeHtml(inquiriesPerWeek)
    const safeChallenge = escapeHtml(challenge)
    const initials =
      safeName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || '')
        .join('') || 'NL'

    const timestamp = new Date().toLocaleString('en-PH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })

    const leadScore = safeInquiries.includes('60+')
      ? 88
      : safeInquiries.includes('30-60')
        ? 82
        : safeInquiries.includes('10-30')
          ? 74
          : 66

    const priorityClass = leadScore >= 80 ? 'priority-high' : 'priority-med'
    const priorityText = leadScore >= 80 ? 'High' : 'Medium'

    await transporter.sendMail({
      from: `"Pyow Digitals Website" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `Alert: New Leads... Take Action !! [${name}]`,
      text: `Alert: New Leads... Take Action !!\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
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
        <div class="score-val">${leadScore}<span style="font-size:13px;color:#4a4a64;">/100</span></div>
        <div class="score-bar-track"><div class="score-bar-fill"></div></div>
        <span class="priority-pill ${priorityClass}">${priorityText}</span>
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
          <div class="ts-val">${escapeHtml(timestamp)}</div>
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

    const firstName = escapeHtml(
      name
        .trim()
        .split(/\s+/)
        .filter(Boolean)[0] || 'there'
    )

    await transporter.sendMail({
      from: `"Pyow Digitals" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Message Received - Pyow Digitals',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Message Received - Pyow Digitals</title>
  <style>
    body { margin: 0; padding: 0; background: #050914; font-family: Arial, Helvetica, sans-serif; color: #dbe7ff; }
    .wrap { width: 100%; padding: 24px 10px; box-sizing: border-box; }
    .card { max-width: 760px; margin: 0 auto; background: #0d1324; border: 1px solid #1a2540; border-radius: 20px; overflow: hidden; }
    .hero { padding: 34px 28px; background: radial-gradient(120% 120% at 0% 0%, rgba(0, 229, 160, 0.18), rgba(9, 14, 28, 0) 56%), linear-gradient(135deg, #0b1a23 0%, #0f172d 70%); border-bottom: 1px solid #1a2540; text-align: center; }
    .brand { font-size: 20px; font-weight: 800; letter-spacing: 0.4px; color: #f3f7ff; }
    .brand .dot { color: #00e5a0; }
    .status-icon { width: 56px; height: 56px; margin: 22px auto 14px; border-radius: 50%; border: 1px solid rgba(0, 229, 160, 0.4); background: rgba(0, 229, 160, 0.15); color: #00e5a0; line-height: 56px; font-size: 30px; font-weight: 700; }
    .hero-title { margin: 0; font-size: 34px; line-height: 1.08; color: #f6f9ff; letter-spacing: -0.8px; }
    .hero-sub { margin: 10px 0 0; font-size: 15px; color: #9db0d4; }
    .hero-sub strong { color: #00e5a0; }
    .body { padding: 28px; }
    .body p { margin: 0 0 14px; color: #b8c7e3; line-height: 1.7; font-size: 15px; }
    .body .hello { margin-bottom: 16px; color: #eef4ff; font-size: 18px; font-weight: 700; }
    .body .hello span { color: #00e5a0; }
    .panel { margin: 20px 0; border: 1px solid #1f2a45; background: #090f1e; border-radius: 12px; padding: 16px 18px; }
    .panel-title { margin: 0 0 6px; font-size: 14px; font-weight: 700; color: #f0f5ff; }
    .panel-text { margin: 0; font-size: 13px; color: #8ea3ca; line-height: 1.6; }
    .section-label { margin: 24px 0 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.4px; color: #637aa8; }
    .timeline-item { margin: 0 0 12px; padding-left: 30px; position: relative; }
    .timeline-dot { position: absolute; left: 0; top: 1px; width: 18px; height: 18px; border-radius: 50%; border: 1px solid #2b3b62; background: #111a31; color: #8ea3ca; text-align: center; font-size: 11px; line-height: 18px; font-weight: 700; }
    .timeline-item.active .timeline-dot { border-color: rgba(0, 229, 160, 0.5); background: rgba(0, 229, 160, 0.2); color: #00e5a0; }
    .timeline-title { margin: 0 0 4px; font-size: 14px; color: #f0f5ff; font-weight: 700; }
    .timeline-item.active .timeline-title { color: #00e5a0; }
    .timeline-meta { margin: 0; font-size: 12px; color: #7f93bc; }
    .cta-wrap { text-align: center; margin: 24px 0 10px; }
    .cta { display: inline-block; background: #00e5a0; color: #061019 !important; text-decoration: none; font-weight: 800; font-size: 14px; border-radius: 10px; padding: 13px 26px; }
    .cta-note { margin: 8px 0 0; color: #6f83ab; font-size: 12px; }
    .founder { margin-top: 22px; padding-top: 16px; border-top: 1px solid #1b2642; }
    .founder-name { margin: 0; font-size: 20px; font-weight: 800; color: #f3f8ff; }
    .founder-role { margin: 4px 0 0; font-size: 13px; color: #00e5a0; font-weight: 700; }
    .socials { margin-top: 10px; }
    .social-link { display: inline-block; margin-right: 8px; margin-bottom: 8px; padding: 7px 10px; border: 1px solid #243559; border-radius: 8px; color: #99add3 !important; text-decoration: none; font-size: 12px; }
    .footer { padding: 14px 28px 20px; border-top: 1px solid #1a2540; display: flex; gap: 12px; justify-content: space-between; align-items: center; }
    .footer-brand { color: #7f93bc; font-size: 12px; font-weight: 700; letter-spacing: 0.4px; }
    .footer-brand .dot { color: #00e5a0; }
    .footer-note { color: #60749f; font-size: 11px; text-align: right; }
    @media screen and (max-width: 680px) {
      .wrap { padding: 8px 0; }
      .card { border-radius: 0; border-left: 0; border-right: 0; }
      .hero { padding: 24px 16px; }
      .hero-title { font-size: 28px; }
      .body { padding: 20px 16px; }
      .footer { padding: 14px 16px 18px; display: block; }
      .footer-note { text-align: left; margin-top: 6px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="hero">
        <div class="brand">PYOW<span class="dot">.</span>DIGITALS</div>
        <div class="status-icon">✓</div>
        <h1 class="hero-title">Message Received!</h1>
        <p class="hero-sub">I will get back to you within <strong>24 hours</strong>.</p>
      </div>
      <div class="body">
        <p class="hello">Hi <span>${firstName}</span>,</p>
        <p>Thank you for contacting <strong>Pyow Digitals</strong>. I have received your message and I will review the details shortly.</p>
        <p>If your inquiry is about a website project or automation system, I may ask a few quick questions so I can better understand your goals.</p>
        <p>You can expect a response within <strong>24 hours</strong>.</p>
        <p>In the meantime, feel free to check out some of the insights I share on building websites that generate leads and automate business processes.</p>
        <p>Thanks again for reaching out. I am looking forward to learning more about your project.</p>
        <div class="panel">
          <p class="panel-title">You will hear from me within 24 hours</p>
          <p class="panel-text">Usually much faster. I will reply through this email address.</p>
        </div>
        <p class="section-label">What Happens Next</p>
        <div class="timeline-item active">
          <span class="timeline-dot">1</span>
          <p class="timeline-title">Inquiry received</p>
          <p class="timeline-meta">Done now. Your message is already in my inbox.</p>
        </div>
        <div class="timeline-item">
          <span class="timeline-dot">2</span>
          <p class="timeline-title">I review your details</p>
          <p class="timeline-meta">I will check your business type and current challenge.</p>
        </div>
        <div class="timeline-item">
          <span class="timeline-dot">3</span>
          <p class="timeline-title">We connect and map your system</p>
          <p class="timeline-meta">Clear recommendations, no pressure.</p>
        </div>
        <div class="cta-wrap">
          <a class="cta" href="https://pyowdigitals.com">Visit Pyow Digitals</a>
          <p class="cta-note">You can also reply directly to this email.</p>
        </div>
        <div class="founder">
          <p class="founder-name">Olympio</p>
          <p class="founder-role">Founder - Pyow Digitals</p>
          <div class="socials">
            <a class="social-link" href="https://pyowdigitals.com">Website</a>
            <a class="social-link" href="https://www.linkedin.com">LinkedIn</a>
            <a class="social-link" href="https://www.facebook.com">Facebook</a>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="footer-brand">PYOW<span class="dot">.</span>DIGITALS</div>
        <div class="footer-note">Automated confirmation from pyowdigitals.com</div>
      </div>
    </div>
  </div>
</body>
</html>
      `,
      text: `Hi ${name},

Thank you for contacting Pyow Digitals. I have received your message and I will review the details shortly.

If your inquiry is about a website project or automation system, I may ask a few quick questions so I can better understand your goals.

You can expect a response within 24 hours.

In the meantime, feel free to check out some of the insights I share on building websites that generate leads and automate business processes.

Thanks again for reaching out. I am looking forward to learning more about your project.

Best regards,
Olympio
Pyow Digitals`,
    })

    return NextResponse.json({ message: 'Email sent successfully.' }, { status: 200 })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      {
        message:
          'Failed to send email. Check Gmail App Password and EMAIL_USER / EMAIL_PASS in .env.local.',
      },
      { status: 500 }
    )
  }
}
