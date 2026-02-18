import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { db } from "./db";
import * as schema from "./db/schema";
import { sendOTPEmail } from "./email";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || process.env.AUTH_URL || process.env.NEXTAUTH_URL,
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000",
  ].filter(Boolean) as string[],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  emailAndPassword: {
    enabled: false,
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const subject =
          type === "sign-in"
            ? `Your login code: ${otp}`
            : type === "email-verification"
              ? `Verify your email: ${otp}`
              : `Reset your password: ${otp}`;

        await sendOTPEmail(email, otp, subject, type);
      },
      otpLength: 6,
      expiresIn: 600, // 10 minutes
    }),
    nextCookies(),
  ],
});
