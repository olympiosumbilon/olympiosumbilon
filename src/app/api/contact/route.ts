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
            .email-body {
              margin: 0;
              padding: 0;
              background-color: #f4f7fa;
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            }
            .wrapper {
              width: 100%;
              table-layout: fixed;
              background-color: #f4f7fa;
              padding-bottom: 40px;
            }
            .main {
              background-color: #ffffff;
              margin: 0 auto;
              width: 100%;
              max-width: 600px;
              border-spacing: 0;
              color: #1a1a1a;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .header {
              background-color: #2f4a8a;
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: -0.5px;
            }
            .banner {
              background-color: #e8a030;
              height: 4px;
            }
            .content {
              padding: 40px 30px;
            }
            .lead-info {
              background-color: #f8fafc;
              border-radius: 12px;
              padding: 25px;
              margin-top: 20px;
              border: 1px solid #e2e8f0;
            }
            .label {
              font-size: 11px;
              font-weight: 700;
              color: #4a6cb3;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 6px;
            }
            .value {
              font-size: 16px;
              color: #1e293b;
              margin-bottom: 20px;
              font-weight: 500;
            }
            .message-label {
              font-size: 11px;
              font-weight: 700;
              color: #4a6cb3;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 12px;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 8px;
            }
            .message-content {
              font-size: 15px;
              line-height: 1.6;
              color: #334155;
              white-space: pre-wrap;
              background-color: #ffffff;
              padding: 15px;
              border-radius: 8px;
              border: 1px solid #f1f5f9;
            }
            .footer {
              text-align: center;
              padding: 30px;
              color: #64748b;
            }
            .footer-logo {
              font-weight: 700;
              color: #2f4a8a;
              font-size: 18px;
              margin-bottom: 10px;
            }
            .footer-links {
              margin: 15px 0;
            }
            .footer-links a {
              color: #4a6cb3;
              text-decoration: none;
              margin: 0 10px;
              font-size: 13px;
            }
            .copyright {
              font-size: 11px;
              color: #94a3b8;
              margin-top: 20px;
            }
          </style>
        </head>
        <body class="email-body">
          <center class="wrapper">
            <table class="main" width="100%">
              <tr>
                <td class="banner"></td>
              </tr>
              <tr>
                <td class="header">
                  <h1>🚀 Got New Lead</h1>
                </td>
              </tr>
              <tr>
                <td class="content">
                  <p style="font-size: 16px; color: #64748b; margin-top: 0;">You have a new inquiry from your portfolio website.</p>
                  
                  <div class="lead-info">
                    <div class="label">Client Name</div>
                    <div class="value">${name}</div>
                    
                    <div class="label">Email Address</div>
                    <div class="value">${email}</div>
                    
                    <div class="message-label">Project Details</div>
                    <div class="message-content">${message}</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="footer">
                  <div class="footer-logo">Pyow Digitals</div>
                  <div class="footer-links">
                    <a href="https://github.com/olympiosumbilon">GitHub</a>
                    <a href="https://www.linkedin.com/in/olympiosumbilonjr/">LinkedIn</a>
                    <a href="https://www.facebook.com/olympiosumbilonjr">Facebook</a>
                  </div>
                  <div class="copyright">
                    &copy; 2026 Pyow Digitals. All rights reserved.<br>
                    This is an automated notification from your portfolio system.
                  </div>
                </td>
              </tr>
            </table>
          </center>
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