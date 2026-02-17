import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";
import { fetchProviderUsage } from "@/lib/providers";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json().catch(() => ({ id: undefined }));

  const where = id ? { id, enabled: true } : { enabled: true };
  const providers = await prisma.provider.findMany({ where });

  const results = await Promise.all(
    providers.map(async (p) => {
      const apiKey = decrypt(p.apiKey);
      const usage = await fetchProviderUsage(p.type, apiKey);
      await prisma.provider.update({
        where: { id: p.id },
        data: { lastFetched: new Date(), lastData: JSON.stringify(usage) },
      });
      return { id: p.id, ...usage };
    })
  );

  return NextResponse.json(results);
}
