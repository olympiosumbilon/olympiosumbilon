import nodemailer from 'nodemailer'

const DEFAULT_SMTP_PORT = 587
const SECURE_SMTP_PORT = 465

export type MailMessage = {
  fromName: string
  to: string
  subject: string
  text: string
  html: string
  replyTo?: string
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || DEFAULT_SMTP_PORT)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const senderEmail = process.env.EMAIL_FROM || user

  if (!host || !user || !pass || !senderEmail) {
    return null
  }

  return {
    host,
    port,
    secure: port === SECURE_SMTP_PORT,
    user,
    pass,
    senderEmail,
  }
}

export function getInternalRecipientEmail() {
  const smtpConfig = getSmtpConfig()
  return process.env.EMAIL_TO || smtpConfig?.senderEmail || ''
}

export async function sendMail(message: MailMessage) {
  const smtpConfig = getSmtpConfig()
  if (!smtpConfig) {
    return false
  }

  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass,
    },
  })

  await transporter.sendMail({
    from: `"${message.fromName}" <${smtpConfig.senderEmail}>`,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html,
    replyTo: message.replyTo,
  })

  return true
}
