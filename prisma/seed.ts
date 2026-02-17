import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "fabio@tietz-playground.com";
  const password = process.env.ADMIN_PASSWORD || "AiCr3d1ts2026!";

  const hash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { password: hash },
    create: { email, password: hash, name: "Fabio" },
  });

  console.log(`User seeded: ${email}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
