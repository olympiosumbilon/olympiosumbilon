import nodemailer from 'nodemailer'

type NewLeadNotificationPayload = {
  name: string
  email: string
  businessType: string
  score: number
}

export async function notifyNewLead(payload: NewLeadNotificationPayload) {
  await Promise.allSettled([
    sendSlackNotification(payload),
    sendEmailNotification(payload),
  ])
}

async function sendSlackNotification(payload: NewLeadNotificationPayload) {
  if (!process.env.SLACK_WEBHOOK_URL) return

  const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: [
        'New Lead Received',
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Business Type: ${payload.businessType}`,
        `Score: ${payload.score}`,
      ].join('\n'),
    }),
  })

  if (!response.ok) {
    throw new Error(`Slack webhook failed with status ${response.status}`)
  }
}

async function sendEmailNotification(payload: NewLeadNotificationPayload) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_TO) {
    return
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: `"Pyow Digitals CRM" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `New Lead Received: ${payload.name}`,
    text: [
      'New Lead Received',
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Business Type: ${payload.businessType}`,
      `Score: ${payload.score}`,
    ].join('\n'),
  })
}
