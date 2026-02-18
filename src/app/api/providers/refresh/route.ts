import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { provider } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { fetchProviderUsage } from "@/lib/providers";
import { headers } from "next/headers";
import { decryptServerSide } from "@/lib/server-crypto";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json().catch(() => ({ id: undefined }));

  const where = id ? and(eq(provider.id, id), eq(provider.enabled, true)) : eq(provider.enabled, true);
  const providers = await db.select().from(provider).where(where);

  const results = await Promise.all(
    providers.map(async (p) => {
      // Decrypt API key server-side
      let apiKey: string;
      try {
        apiKey = decryptServerSide(p.apiKey);
      } catch {
        // Fallback: key might be stored unencrypted (legacy)
        apiKey = p.apiKey;
      }
      const usage = await fetchProviderUsage(p.type, apiKey);
      await db
        .update(provider)
        .set({ lastFetched: new Date(), lastData: JSON.stringify(usage), updatedAt: new Date() })
        .where(eq(provider.id, p.id));
      return { id: p.id, ...usage };
    })
  );

  return NextResponse.json(results);
}
