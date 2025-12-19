import { NextResponse } from 'next/server'
import { createTransport } from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { to, subject, message, html } = await request.json()

    console.log({
      to,
      html,
    })

    if (!to || !html) {
      return NextResponse.json(
        { status: 'error', error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const transporter = createTransport({
      host: 'smtp.ethereal.email',
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL!,
        pass: process.env.NEXT_PUBLIC_EMAIL_PASSKEY!,
      },
    })

    const info = await transporter.sendMail({
      from: `"Website Sender" <${process.env.NEXT_PUBLIC_EMAIL}>`,
      to: to,
      subject: subject,
      text: message,
      html,
    })

    return NextResponse.json({
      status: 'success',
      message: 'Email sent successfully!',
      info,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', error: error.message || 'Failed to send email' },
      { status: 500 },
    )
  }
}
