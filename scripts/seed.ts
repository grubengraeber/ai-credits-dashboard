import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { account } from "../src/lib/db/schema";
import bcrypt from "bcryptjs";

async function main() {
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client);

  const email = process.env.ADMIN_EMAIL || "fabio@tietz-playground.com";
  const password = process.env.ADMIN_PASSWORD || "AiCr3d1ts2026!";
  const hash = await bcrypt.hash(password, 12);

  // Better Auth speichert Passwort in der account Tabelle (providerId = "credential")
  // User wird über die better-auth signup API erstellt
  console.log(`Seed: Bitte erstelle den Admin-User über die App (Sign Up) oder via API:`);
  console.log(`  Email: ${email}`);
  console.log(`  Password: ${password}`);

  await client.end();
}

main().catch(console.error);
