import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@hirex.ai';

export const sendVerificationEmail = async ({ toEmail, userName, otpCode, verificationUrl }) => {
  console.log(`[Email] Dispatching verification email to ${toEmail} with OTP: ${otpCode}`);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #0D0E15; color: #FFFFFF; padding: 32px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 28px; font-weight: 900; color: #FFD60A; letter-spacing: 2px;">HIREX</span>
        <p style="color: #94A3B8; font-size: 13px; margin-top: 4px;">Smarter Hiring. Better Talent.</p>
      </div>

      <h2 style="color: #FFFFFF; font-size: 20px; margin-bottom: 12px;">Verify Your Email Address</h2>
      <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">Hello ${userName || 'there'}, welcome to HIREX! Please use the 6-digit verification code below to verify your account:</p>

      <div style="background: rgba(255,214,10,0.1); border: 2px dashed #FFD60A; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
        <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #FFD60A;">${otpCode}</span>
        <p style="color: #94A3B8; font-size: 11px; margin-top: 8px;">Valid for 15 minutes. Do not share this code.</p>
      </div>

      <p style="color: #64748B; font-size: 12px; text-align: center; margin-top: 32px;">If you did not request this verification, please disregard this email.</p>
    </div>
  `;

  // 1. If Resend is configured
  if (RESEND_API_KEY && RESEND_API_KEY !== 'your_resend_api_key') {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: toEmail,
          subject: `${otpCode} is your HIREX verification code`,
          html: htmlContent,
        }),
      });
      if (res.ok) {
        console.log('[Email] Verification email dispatched via Resend.');
        return { success: true, provider: 'Resend' };
      }
    } catch (err) {
      console.warn('[Email] Resend API error:', err.message);
    }
  }

  // 2. If SendGrid is configured
  if (SENDGRID_API_KEY && SENDGRID_API_KEY !== 'your_sendgrid_api_key') {
    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: toEmail }] }],
          from: { email: FROM_EMAIL, name: 'HIREX Platform' },
          subject: `${otpCode} is your HIREX verification code`,
          content: [{ type: 'text/html', value: htmlContent }],
        }),
      });
      if (res.ok) {
        console.log('[Email] Verification email dispatched via SendGrid.');
        return { success: true, provider: 'SendGrid' };
      }
    } catch (err) {
      console.warn('[Email] SendGrid API error:', err.message);
    }
  }

  // 3. Local simulated development email logger
  console.log(`[Email] Development Simulation: Verification OTP for ${toEmail} is [${otpCode}]`);
  return { success: true, provider: 'Local-Simulation', otpCode };
};
