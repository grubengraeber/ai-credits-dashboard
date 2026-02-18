import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";
import * as schema from "./db/schema";

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
    enabled: true,
  },
  plugins: [nextCookies()],
});
