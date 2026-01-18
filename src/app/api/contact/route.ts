import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email configuration is missing')
    return NextResponse.json(
      { message: 'Email configuration is missing. Please check your environment variables.' },
      { status: 500 }
    )
  }

  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create a transporter using your email service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'olympiosumbilonpersonal@gmail.com',
      subject: `🚀 Got New Lead: ${name}`,
      text: `
        Got New Lead!
        
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .email-container {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              background-color: #f8fafc;
              border-radius: 16px;
              overflow: hidden;
              border: 1px solid #e2e8f0;
            }
            .header {
              background: linear-gradient(135deg, #2f4a8a 0%, #4a6cb3 100%);
              padding: 40px 20px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              letter-spacing: 1px;
            }
            .content {
              padding: 30px;
              background-color: white;
            }
            .field-label {
              color: #64748b;
              font-size: 12px;
              text-transform: uppercase;
              font-weight: bold;
              margin-bottom: 4px;
            }
            .field-value {
              color: #1e293b;
              font-size: 16px;
              margin-bottom: 24px;
              padding: 12px;
              background-color: #f1f5f9;
              border-radius: 8px;
            }
            .message-box {
              white-space: pre-wrap;
              line-height: 1.6;
            }
            .footer {
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
              background-color: #f8fafc;
            }
            .badge {
              display: inline-block;
              padding: 4px 12px;
              background-color: #e8a030;
              color: white;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              margin-bottom: 16px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="badge">NEW SUBMISSION</div>
              <h1>🚀 Got New Lead</h1>
            </div>
            <div class="content">
              <div class="field-label">Full Name</div>
              <div class="field-value">${name}</div>
              
              <div class="field-label">Email Address</div>
              <div class="field-value">${email}</div>
              
              <div class="field-label">Message</div>
              <div class="field-value message-box">${message}</div>
            </div>
            <div class="footer">
              Sent from Pyow Digitals Portfolio
            </div>
          </div>
        </body>
        </html>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { message: 'Failed to send email. Please try again later.' },
      { status: 500 }
    )
  }
} 