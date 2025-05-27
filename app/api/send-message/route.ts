import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend("re_fgGNAw2T_MaysWBUoHYKF7Uyxsnu2DLFm")

export async function POST(request: NextRequest) {
  try {
    const { message, timestamp } = await request.json()

    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
    }

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "vedantbahekar01@gmail.com",
      subject: "💫 New Message from Your Starry Journey",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e1b4b 0%, #581c87 100%); color: white; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899); height: 4px;"></div>
          
          <div style="padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="font-size: 28px; margin: 0; background: linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                ✨ Written in the Stars ✨
              </h1>
              <p style="color: #c4b5fd; margin: 8px 0 0 0; font-size: 16px;">Someone completed your starry journey!</p>
            </div>

            <div style="background: rgba(0, 0, 0, 0.3); border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #8b5cf6;">
              <h2 style="color: #f472b6; margin: 0 0 16px 0; font-size: 20px; display: flex; align-items: center;">
                💌 Her Message for You
              </h2>
              <div style="background: rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 16px; border-left: 4px solid #f472b6;">
                <p style="margin: 0; line-height: 1.6; font-size: 16px; color: #e5e7eb;">
                  ${message.replace(/\n/g, "<br>")}
                </p>
              </div>
            </div>

            <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; font-size: 14px; color: #a78bfa;">
                <strong>Journey Completed:</strong> ${new Date(timestamp).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #4c1d95;">
              <p style="margin: 0; font-size: 14px; color: #9ca3af;">
                This message was sent from your Starry Journey website
              </p>
              <div style="margin-top: 16px;">
                <span style="font-size: 24px;">🌟</span>
                <span style="font-size: 20px; margin: 0 8px;">✨</span>
                <span style="font-size: 24px;">🌟</span>
              </div>
            </div>
          </div>
        </div>
      `,
    })

    console.log("Starry Journey message received:", {
      message,
      timestamp,
      emailId: emailResult.data?.id,
    })

    return NextResponse.json({
      success: true,
      message: "Message sent successfully to your email!",
      emailId: emailResult.data?.id,
    })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message. Please try again.",
      },
      { status: 500 },
    )
  }
}
