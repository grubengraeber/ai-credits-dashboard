import nodemailer from "nodemailer";

const SMTP_HOST = process.env.EMAIL_SERVER_HOST || "mail.tietz-playground.com";
const SMTP_PORT = parseInt(process.env.EMAIL_SERVER_PORT || "587");
const SMTP_USER = process.env.EMAIL_SERVER_USER || "";
const SMTP_PASS = process.env.EMAIL_SERVER_PASSWORD || "";
const EMAIL_FROM = process.env.EMAIL_FROM || SMTP_USER;

export async function sendOTPEmail(
  to: string,
  otp: string,
  subject: string,
  type: string
) {
  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #09090b; color: #fafafa; padding: 40px 20px;">
  <div style="max-width: 400px; margin: 0 auto; background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px;">
    <h1 style="font-size: 20px; margin: 0 0 8px;">AI Credits Dashboard</h1>
    <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 24px;">
      ${type === "sign-in" ? "Enter this code to sign in" : type === "email-verification" ? "Enter this code to verify your email" : "Enter this code to reset your password"}
    </p>
    <div style="background: #27272a; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: monospace;">${otp}</span>
    </div>
    <p style="color: #71717a; font-size: 12px; margin: 0;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
  </div>
</body>
</html>`;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"AI Credits Dashboard" <${EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
}
