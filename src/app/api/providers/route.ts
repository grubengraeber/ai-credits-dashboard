import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/crypto";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const providers = await prisma.provider.findMany({
    select: { id: true, name: true, type: true, enabled: true, lastFetched: true, lastData: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(providers);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, type, apiKey } = await req.json();
  if (!name || !type || !apiKey) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const provider = await prisma.provider.create({
    data: { name, type, apiKey: encrypt(apiKey) },
  });

  return NextResponse.json({ id: provider.id, name: provider.name, type: provider.type });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await prisma.provider.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
