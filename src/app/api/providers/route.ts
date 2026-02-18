import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { provider } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const providers = await db
    .select({
      id: provider.id,
      name: provider.name,
      type: provider.type,
      enabled: provider.enabled,
      lastFetched: provider.lastFetched,
      lastData: provider.lastData,
    })
    .from(provider)
    .orderBy(provider.createdAt);

  return NextResponse.json(providers);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, type, apiKey } = await req.json();
  if (!name || !type || !apiKey) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // API Key kommt bereits client-seitig verschlüsselt an
  const [created] = await db
    .insert(provider)
    .values({ name, type, apiKey })
    .returning({ id: provider.id, name: provider.name, type: provider.type });

  return NextResponse.json(created);
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db.delete(provider).where(eq(provider.id, id));
  return NextResponse.json({ ok: true });
}
