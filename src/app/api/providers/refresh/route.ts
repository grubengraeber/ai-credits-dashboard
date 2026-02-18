import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { provider } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { fetchProviderUsage } from "@/lib/providers";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, decryptedKeys } = await req.json().catch(() => ({ id: undefined, decryptedKeys: undefined }));

  // decryptedKeys: Record<providerId, klartext-apiKey> — vom Client entschlüsselt
  const where = id ? and(eq(provider.id, id), eq(provider.enabled, true)) : eq(provider.enabled, true);
  const providers = await db.select().from(provider).where(where);

  const results = await Promise.all(
    providers.map(async (p) => {
      // Verwende den vom Client entschlüsselten Key, oder den gespeicherten (für Abwärtskompatibilität)
      const apiKey = decryptedKeys?.[p.id] || p.apiKey;
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
